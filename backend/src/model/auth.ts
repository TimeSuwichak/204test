import * as jwt     from "jose";
import env          from "#core/env.ts";
import error        from "#core/error.ts";
import sql          from "#core/sql.ts";
import objreader    from "#core/objectReader.ts";

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
}

let EXPIRE_SESSION: number;
let EXPIRE_CHALLENGE: number;
let JWT_ISSUER: string;
let JWT_SECRET: Uint8Array;

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
    Object.seal (JWT_SECRET);

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
    void authId;

    const cmd = `SELECT link FROM auth WHERE id = ?`;
    const param = [authId];
    const result = await sql.select (cmd, param);

    if (result.length == 0) {
        throw new error.NotFound ();
    }
    if (result.length >= 2) {
        throw new error.Conflict ();
    }
    const sessionIssued = new Date (Date.now ());
    const sessionExpire = new Date (Date.now () + EXPIRE_CHALLENGE);
    const session = await content.jwtSign ({}, sessionIssued, sessionExpire);
    const reader = objreader (result.at (0));
    const output: ResultSession =
    {
        authId: authId,
        authLink: reader.requireInteger ("link"),
        session: session,
        sessionIssued: sessionIssued,
        sessionExpire: sessionExpire,
        restriction: 0,
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
content.signInPwd = (
    authLink: number,
    authId: string, 
    value: string,
) =>
{
    void authLink;
    void authId;
    void value;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;