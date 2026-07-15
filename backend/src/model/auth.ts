import * as jwt     from "jose";
import env          from "#core/env.ts";
import error        from "#core/error.ts";
import sql          from "#core/sql.ts";
import objreader    from "#core/objectReader.ts";
import
{
    type InputCommand as SqlInputCommand,
    type InputValue as SqlInputValue
}
from "#core/sql.ts"
import
{
    type AccountId
}
from "#model/account.ts";

/**
 * ระบบจัดการระบบยืนยันตัวตนผู้ใช้
*/
const content =()=>
{
    return;
}

type AuthId = string;
type AuthLink = number;
type Session = string;
type Restriction = number;

/**
 * ชุดข้อมูลที่ได้รับจากการลงชื่อเข้าใช้
*/
interface ResultSession
{
    authId: AuthId;
    authLink: AuthLink;
    session: Session;
    sessionIssued: Date;
    sessionExpire: Date;
    restriction: Restriction;
    step: number;
}

let EXPIRE_SESSION: number;
let EXPIRE_CHALLENGE: number;
let JWT_ISSUER: string;
let JWT_SECRET: Uint8Array;

/**
 * ขั้นตอนการลงชื่อเข้าใช้: ไม่ทราบ
*/
content.STEP_UNKNOWN = 0;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ระบุรหัสประจำตัว
*/
content.STEP_IDENTIFIER = 1;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ระบุรหัสผ่าน
*/
content.STEP_PASSWORD = 2;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ยืนยันตัวตนแบบสองชั้น
*/
content.STEP_MFA = 3;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: เสร็จสิ้น
*/
content.STEP_COMPLETE = 4;

content.getExpireSession = function () { return EXPIRE_SESSION; }
content.getExpireChallenge = function () { return EXPIRE_CHALLENGE; }
content.jwtGetIssuer = function () { return JWT_ISSUER; }
content.jwtGetSecret = function () { return JWT_SECRET; }
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = async () =>
{
    /**
     * โหลดข้อมูลลับ
    */
    EXPIRE_SESSION = env.getInteger ("B_AUTH_SESSION_EXPIRE", 3600000);
    EXPIRE_CHALLENGE = env.getInteger ("B_AUTH_CHALLENGE_EXPIRE", 300000);
    JWT_ISSUER = env.getString ("B_AUTH_ISSUER", "");
    JWT_SECRET = new TextEncoder ()
        .encode (env.getString ("B_AUTH_SECRET", "WebProject"));

    Object.freeze (EXPIRE_SESSION);
    Object.freeze (EXPIRE_CHALLENGE);
    Object.freeze (JWT_ISSUER);
    // Object.seal (JWT_SECRET);

    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = async () =>
{
    return Promise.resolve ();
}
/**
 * ไม่มีข้อจำกัดใด ๆ ในการใช้งานระบบ
*/
content.RESTRICTION_NONE = 0;
/**
 * จำเป็นต้องยืนยันตัวตนก่อนใช้งานระบบ
*/
content.RESTRICTION_CHALLENGE = 1;
/**
 * บัญชีถูกปิดใช้งานชั่วคราว
*/
content.RESTRICTION_DISABLED = 2;
/**
 * บัญชีถูกระงับโดยระบบหรือผู้ดูแล
*/
content.RESTRICTION_SUSPENDED = 4;
/**
 * ลงชื่อให้กับชุดข้อมูลดังกล่าวโดยใช้รูปแบบ JWT
 * 
 * @param data ชุดข้อมูลอะไรก็ได้
 * @param issued เวลาออกรหัส
 * @param expire เวลาหมดอายุ
*/
content.jwtSign = async (
    data: Record<string, unknown>, 
    issued: Date,
    expire: Date
) : Promise<string> =>
{
    try
    {
        return await new jwt.SignJWT (data)
            .setProtectedHeader ({ alg: "HS256" })
            .setIssuer (JWT_ISSUER)
            .setNotBefore (issued)
            .setIssuedAt (issued)
            .setExpirationTime (expire)
            .sign (JWT_SECRET);
    }
    catch (e: unknown)
    {
        throw new error.BadData ("JWT Signing Error", { cause: e });
    }
}
/**
 * ยืนยันชุดข้อมูลดังกล่าวที่ใช้รูปแบบ JWT ว่าเป็นข้อมูลถูกต้อง
 * 
 * @input ชุดข้อมูลที่ถูกประทับด้วย JWT
*/
content.jwtVerify = async (input: string) =>
{
    try 
    {
        const info = await jwt.jwtVerify (input, JWT_SECRET, {
            issuer: JWT_ISSUER,
            currentDate: new Date (),
        });
        return {
            header: info.protectedHeader,
            data: info.payload            
        }
    }
    catch (e: unknown)
    {
        if (e instanceof jwt.errors.JWTExpired)
        {
            throw new error.Expired (e.message, { cause: e });
        }
        if (e instanceof jwt.errors.JWTInvalid)
        {
            throw new error.BadFormat (e.message, { cause: e });
        }
        throw new error.NotAvailable ("JWT Verification Failed", { cause: e });
    }
}
/**
 * เริ่มต้นการลงชื่อเข้าใช้โดยรหัสประจำตัวของผู้ใช้
 * 
 * @param authId รหัสประจำตัวของผู้ใช้
*/
content.signIn = async (authId: string) : Promise<ResultSession> =>
{
    let cmd: SqlInputCommand = `SELECT Link FROM Auth WHERE Id = ?`;
    let val: SqlInputValue = [authId];
    const auth = await sql.select (cmd, val);

    if (auth.length == 0) {
        throw new error.NotFound ();
    }
    if (auth.length >= 2) {
        throw new error.Conflict ();
    }

    let reader = objreader (auth.at (0));
    const outLink = reader.requireInteger ("Link");

    cmd = `SELECT Role FROM User WHERE Id = ?`;
    val = [outLink];

    const account = await sql.select (cmd, val);
    
    if (account.length !=  1) {
        throw new error.Conflict ();
    }

    reader = objreader (account.at (0));
    const outRole = reader.requireInteger ("Role");
    
    const seIssued = new Date (Date.now ());
    const seExpire = new Date (Date.now () + EXPIRE_CHALLENGE);
    const seValue = await content.jwtSign ({
        "Id": outLink,
        "Role": outRole,
        "Restriction": content.RESTRICTION_CHALLENGE,
        "AuthStep": content.STEP_PASSWORD
    }, 
    seIssued, seExpire);

    const output: ResultSession =
    {
        authId: authId,
        authLink: outLink,
        session: seValue,
        sessionIssued: seIssued,
        sessionExpire: seExpire,
        restriction: content.RESTRICTION_CHALLENGE,
        step: content.STEP_PASSWORD
    };
    return output;
}
/**
 * ดำเนินกาารต่อการลงชื่อเข้าใช้โดยรหัสผ่าน
 * 
 * @param authLink รหัสบัญชี
 * @param authId รหัสประจำตัว
 * @param value รหัสผ่าน
*/
content.signInPwd = async (
    authLink: number,
    authId: string, 
    role: number,
    value: string,
) : Promise<ResultSession> =>
{
    const cmd: SqlInputCommand = `SELECT Password FROM Auth WHERE Id = ?`;
    const val: SqlInputValue = [authId];
    const result = await sql.select (cmd, val);

    if (result.length == 0) {
        throw new error.NotFound ();
    }
    if (result.length >= 2) {
        throw new error.Conflict ();
    }
    const reader = objreader (result.at (0));
    const outPwd = reader.requireString ("Password");

    if (outPwd !== value) {
        throw new error.NotAuthorized ();
    }
    const seIssued = new Date (Date.now ());
    const seExpire = new Date (Date.now () + EXPIRE_CHALLENGE);
    const seValue = await content.jwtSign ({
        "Id": authLink,
        "Role": role,
        "Restriction": 0,
        "AuthStep": content.STEP_MFA
    }, 
    seIssued, seExpire);

    const output: ResultSession =
    {
        authId: authId,
        authLink: authLink,
        session: seValue,
        sessionIssued: seIssued,
        sessionExpire: seExpire,
        restriction: 0,
        step: content.STEP_COMPLETE
    };
    return output;
}

content.create = async (id: string, pwd: string, link: AccountId) =>
{
    await sql.insert (`
        INSERT INTO Auth (Id, Password, Link) 
        VALUES (?, ?, ?)`, 
        [id, pwd, link]
    );
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;