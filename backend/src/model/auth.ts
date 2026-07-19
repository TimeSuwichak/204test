import * as jwt         from "jose";
import bcrypt           from "bcrypt";
import env              from "#core/env.ts";
import sql              from "#core/sql.ts";
import error            from "#core/error.ts";
import objectReader     from "#core/object.reader.ts";
import model            from "#model/auth.ts";
import modelAccount     from "#model/account.ts";
import { type BasicId as AccountId } from "#model/account.ts"

/**
 * ระบบจัดการระบบยืนยันตัวตนผู้ใช้
*/
const content = () =>
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
}
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

    FB_APP_ID = env.getString ("B_AUTH_FACEBOOK", "");

    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = () =>
{
    //
    // ไม่มีคุณสมบัติในตอนนี้
    //
    return;
}

content.challengeSimple = async (key: BasicId, pwd: BasicPassword)
    : Promise<Challenge> =>
{
    const cmd = `SELECT Password, Link FROM Auth WHERE Id = ?`;
    const param = [key];
    const query = await sql.select (cmd, param);

    if (query.length === 0) {
        throw new error.NotFound (`ไม่พบข้อมูลจากรหัสประจำตัว: ${key}`);
    }
    const reader = objectReader (query [0]);
    const dbPwd = reader.requireString ("Password");
    const dbLink = reader.requireInteger ("Link");
    const match = await bcrypt.compare (pwd, dbPwd).catch ((e: unknown) =>
    {
        throw new error.BadAuth (e);
    });
    if (match)
    {
        return content.challengeFinalize (dbLink);
    }
    throw new error.BadAuth (`รหัสผ่านไม่ถูกต้อง: ${key}`);
}
/**
 * ท้าทายระบบโดยการรหัสประจำตัว
*/
content.challengeId = async (key: BasicId) : Promise<Challenge> =>
{
    const cmd = `SELECT Link FROM Auth WHERE Id = ?`;
    const param = [key];
    const link = await sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound (`ไม่พบข้อมูลจากรหัสประจำตัว: ${key}`);
        }
        return objectReader (x.at (0)).requireInteger ("Link");
    });
    const issued = new Date ();
    const expired = new Date (Date.now () + model.getExpireChallenge ());

    return model.createChallenge (
        issued, expired,
        link, key, 
        content.STEP_CHALLENGE_PASSWORD
    );
}
/**
 * ท้าทายระบบโดยการรหัสผ่าน
*/
content.challengePassword = async (key: Challenge, value: string) 
    : Promise<Challenge> =>
{
    const authId = key.authId;
    const cmd = `SELECT Password, Link FROM Auth WHERE Id = ?`;
    const param = [authId];
    const query = await sql.select (cmd, param);

    if (query.length === 0) {
        throw new error.NotFound (`ไม่พบข้อมูลจากรหัสประจำตัว: ${authId}`);
    }
    const reader = objectReader (query [0]);
    const dbPwd = reader.requireString ("Password");
    const dbLink = reader.requireInteger ("Link");
    const match = await bcrypt.compare (value, dbPwd).catch ((e: unknown) =>
    {
        throw new error.BadAuth (e);
    });
    if (match)
    {
        return content.challengeFinalize (dbLink);
    }
    throw new error.BadAuth (`รหัสผ่านไม่ถูกต้อง: ${authId}`);
}

content.challengeFacebook = async (
    userId: FacebookId, 
    accessToken: string, 
    name: string,
    email: string,
    icon: string
) : Promise<Challenge> =>
{
    const search = new URLSearchParams ();
    const endpoint = `https://graph.facebook.com/v25.0/debug_token`;

    search.append ("input_token", accessToken);
    search.append ("access_token", accessToken);

    const url = `${endpoint}?${search.toString ()}`;
    const request: RequestInit =
    {
        method: "GET",
        mode: "no-cors",
        referrerPolicy: "no-referrer",
        cache: "default",
    };
    const json = await fetch (url, request)
        .then ((x) => x.json ())
        .catch ((e: unknown) =>
    {
        throw new error.NotAuthorized (e);
    });
    let jsonAppId: string;
    let jsonUserId: string;
    let jsonValid: boolean;

    try
    {
        const root = objectReader (json);
        const data = objectReader (root.requireRecord ("data"));

        jsonAppId = data.requireString ("app_id");
        jsonUserId = data.requireString ("user_id");
        jsonValid = data.requireBoolean ("is_valid");
    }
    catch (e: unknown)
    {
        throw new error.NotAuthorized (e);
    }
    if ((jsonAppId != model.fbGetAppId ()) || 
        (jsonUserId != String (userId)) || (!jsonValid)) {
        throw new error.NotAuthorized (undefined);
    }

    try
    {
        return await content.getDbFacebook (userId).then ((x) =>
        {
            return content.challengeFinalize (x.link);
        });
    }
    catch (e: unknown)
    {
        if (!(e instanceof error.NotFound))
        {
            throw new error.NotAvailable ();
        } 
    }

    try
    {
        void email;
        void icon;

        const accountId = await modelAccount.create ({
            name: name,
            role: modelAccount.ROLE_USER,
            icon: icon
        });
        await content.createDbFacebook (userId, accountId);

        return await content.challengeFinalize (accountId);
    }
    catch (e: unknown)
    {
        throw new error.NotAvailable (e);
    }
}

/**
 * จบการท้าทาย
*/
content.challengeFinalize = async (authLink: AccountId) 
    : Promise<Challenge> =>
{
    const cmd = `SELECT Id, Role FROM Account WHERE Id = ?`;
    const param = [authLink];
    const query = await sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }
        const reader = objectReader (x.at (0));
        const result =
        {
            id: reader.requireInteger ("Id"),
            role: reader.requireInteger ("Role"),
        }
        return result;
    });

    const issued = new Date ();
    const expired = new Date (Date.now () + model.getExpireSession ());
    const session = await model.createSession (
        issued, expired,
        query.id, query.role, 
        model.RESTRICTION_NONE
    );
    
    return {
        ... session,
        authId: "",
        authStep: content.STEP_CHALLENGE_COMPLETED
    }
}
/**
 * รับข้อมูลการลงชื่อเข้าใช้งานระบบ
*/
content.getDb = async (id: BasicId) =>
{
    const cmd = "SELECT Id, Password, Link FROM Auth WHERE Id = ?";
    const param = [id];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length === 0)
        {
            throw new error.NotFound ();
        }
        if (x.length !== 1)
        {
            throw new error.Conflict ();
        }
        const reader = objectReader (x.at (0));
        const result: BasicFetch =
        {
            id: reader.requireString ("Id"),
            password: reader.requireString ("Password"),
            link: reader.requireInteger ("Link"),
        };
        return result;
    });
}
/**
 * รับข้อมูลการลงชื่อเข้าใช้งานระบบด้วย Facebook
*/
content.getDbFacebook = async (id: FacebookId) =>
{
    const cmd = "SELECT Id, Link FROM AuthFacebook WHERE Id = ?";
    const param = [id];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length === 0)
        {
            throw new error.NotFound ();
        }
        if (x.length !== 1)
        {
            throw new error.Conflict ();
        }
        const reader = objectReader (x.at (0));
        const result: FacebookFetch =
        {
            id: reader.requireInteger ("Id"),
            link: reader.requireInteger ("Link"),
        };
        return result;
    });
}
/**
 * สร้างวิธีการลงชื่อเข้าใช้งานระบบด้วย: รหัสประจำตัวและรหัสผ่าน
*/
content.createDb = async (id: BasicId, pwd: string, link: AccountId) =>
{
    const hashPwd = await bcrypt.hash (pwd, 16);

    const cmd = "INSERT INTO Auth (Id, Password, Link) VALUES (?, ?, ?)";
    const param = [id, hashPwd, link];

    await sql.insert (cmd, param);
    return id;
}
/**
 * สร้างวิธีการลงชื่อเข้าใช้งานระบบด้วย: Facebook
*/
content.createDbFacebook = async (id: FacebookId, link: AccountId) =>
{
    const cmd = "INSERT INTO AuthFacebook (Id, Link) VALUES (?, ?)";
    const param = [id, link];

    await sql.insert (cmd, param);
    return id;
}
/**
 * สร้างชุดรหัสยืนยันตัวตน
 * 
 * @param issued วันที่สร้าง
 * @param expired วันที่หมดอายุ
 * @param accountId รหัสบัญชี
 * @param accountRole บทบาท
 * @param accountRestriction ข้อจำกัด
*/
content.createSession = async (
    issued: Date, 
    expire: Date | undefined,
    accountId: AccountId,
    accountRole: number,
    accountRestriction: number
) : Promise<Session> =>
{
    expire = expire ?? new Date (8640000000000000);

    const data = 
    {
        "Id": accountId,
        "Role": accountRole,
        "Restriction": accountRestriction,
    };
    const session = await content.jwtSign (data, issued, expire);
    const result: Session =
    {
        raw: session,
        issued: issued,
        expired: expire,
        id: accountId,
        role: accountRole,
        restriction: accountRestriction,
    };
    return result;
}
/**
 * สร้างชุดรหัสยืนยันตัวตนที่ใช้งานเฉพาะตอนลงชื่อเข้าใช้หรือสร้างบัญชี
 * 
 * @param issued วันที่สร้าง
 * @param expired วันที่หมดอายุ
 * @param accountId รหัสบัญชี
 * @param accountRole บทบาท
 * @param restriction ข้อจำกัด
*/
content.createChallenge = async (
    issued: Date, 
    expire: Date | undefined,
    accountId: AccountId,
    authId: BasicId,
    authStep: number
) : Promise<Challenge> =>
{
    expire = expire ?? new Date (8640000000000000);

    const data = 
    {
        "Id": accountId,
        "Role": modelAccount.ROLE_AUTH,
        "Restriction": content.RESTRICTION_CHALLENGE,
        "AuthId": authId,
        "AuthStep": authStep
    };
    const session = await content.jwtSign (data, issued, expire);
    const result: Challenge =
    {
        raw: session,
        issued: issued,
        expired: expire,
        id: accountId,
        role: modelAccount.ROLE_AUTH,
        restriction: content.RESTRICTION_CHALLENGE,

        authId: authId,
        authStep: authStep
    };
    return result;
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
        throw new error.BadData (e);
    }
}
/**
 * ยืนยันชุดข้อมูลดังกล่าวที่ใช้รูปแบบ JWT ว่าเป็นข้อมูลถูกต้อง
 * 
 * @param input ชุดข้อมูลที่ถูกประทับด้วย JWT
 * @returns {string} ชุดข้อมูลรูปแบบที่ถููกประทับแล้ว
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
        if (e instanceof jwt.errors.JWTExpired) {
            throw new error.Expired (e);
        }
        if (e instanceof jwt.errors.JWTInvalid) {
            throw new error.BadFormat (e);
        }
        throw new error.NotAvailable (e);
    }
}
content.readSession = async (value: string) : Promise<Session> =>
{
    const decoded = await content.jwtVerify (value);
    const result: Session =
    {
        raw: value,
        issued: new Date (Number (decoded.data.iat)),
        expired: new Date (Number (decoded.data.exp)),
        id: Number (decoded.data ["Id"]),
        role: Number (decoded.data ["Role"]),
        restriction: Number (decoded.data ["Restriction"]),
    };
    return result;
}
content.readChallenge = async (value: string) : Promise<Challenge> =>
{
    const decoded = await content.jwtVerify (value);
    const result: Challenge =
    {
        raw: value,
        issued: new Date (Number (decoded.data.iat)),
        expired: new Date (Number (decoded.data.exp)),
        id: Number (decoded.data ["Id"]),
        role: Number (decoded.data ["Role"]),
        restriction: Number (decoded.data ["Restriction"]),

        authId: String (decoded.data ["AuthId"]),
        authStep: Number (decoded.data ["AuthStep"]),
    };
    return result;
}
/**
 * รับหน่วยเวลาที่หมดอายุตลอดการใช้งานระบบ
*/
content.getExpireSession = () => 
{ 
    return EXPIRE_SESSION; 
}
/**
 * รับหน่วยเวลาที่หมดอายุในระหว่างการเข้าสู่ระบบ
*/
content.getExpireChallenge = () => 
{ 
    return EXPIRE_CHALLENGE; 
}
/**
 * รับชื่อผู้ออกใบรับรอง JWT
*/
content.jwtGetIssuer = () => 
{ 
    return JWT_ISSUER; 
}
/**
 * รับรหัสของ JWT
*/
content.jwtGetSecret = () => 
{ 
    return JWT_SECRET; 
}
/**
 * รับรหัสแอปของ Facebook
*/
content.fbGetAppId = () =>
{
    return FB_APP_ID;
}
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ไม่ทราบ
*/
content.STEP_UNKNOWN = 0;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ระบุรหัสประจำตัวและรหัสผ่าน
*/
content.STEP_CHALLENGE_SIMPLE = 1;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ระบุรหัสประจำตัว
*/
content.STEP_CHALLENGE_ID = 2;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ระบุรหัสผ่าน
*/
content.STEP_CHALLENGE_PASSWORD = 3;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: ยืนยันตัวตนแบบสองชั้น
*/
content.STEP_CHALLENGE_TOTP = 4;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: เสร็จสิ้น
*/
content.STEP_CHALLENGE_COMPLETED = 5;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: Facebook
*/
content.STEP_CONNECT_FACEBOOK = 101;
/**
 * ขั้นตอนการลงชื่อเข้าใช้: Facebook
*/
content.STEP_CONNECT_GOOGLE = 102;
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
 * ชุดข้อมูลที่ได้รับจากการลงชื่อเข้าใช้
*/
export interface Session
{
    /**
     * ชุดรหัสยืนยันตัวตน
    */
    raw: string;
    /**
     * วันที่ออกชุดรหัส
    */
    issued: Date;
    /**
     * วันที่ชุดรหัสหมดอายุ
    */
    expired: Date;
    /**
     * รหัสบัญชี
    */
    id: AccountId;
    /**
     * บทบาทบัญชี
    */
    role: number;
    /**
     * ข้อจำกัดการเข้าถึงบัญชี
    */
    restriction: number;
}
/**
 * ใช้ในขณะที่ลงชื่อเข้าใช้/สมัคร
*/
export interface Challenge extends Session
{
    /**
     * รหัสประจำตัว
    */
    authId: BasicId;
    /**
     * ขั้นตอนปัจจุบัน
    */
    authStep: number;
}

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลการลงชื่อเข้าใช้จากฐานข้อมูล
*/
export interface BasicFetch
{
    id: BasicId;
    password: string;
    link: AccountId;
}
/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลการลงชื่อเข้าใช้จากฐานข้อมูล
*/
export interface FacebookFetch
{
    id: FacebookId;
    link: AccountId;
}
/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type BasicId = string;
/**
 * รหัสผ่าน
*/
export type BasicPassword = string;
/**
 * รหัสบัญชี (หรือเรียกอีกอย่างว่า FOREIGN KEY)
*/
export type BasicLink = AccountId;
/**
 * รหัสของชุดรหัสข้อมูลสำหรับ Facebook (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type FacebookId = number;

let EXPIRE_SESSION: number;
let EXPIRE_CHALLENGE: number;
let JWT_ISSUER: string;
let JWT_SECRET: Uint8Array;
let FB_APP_ID: string;

/**
 * ส่งออกตัวแปร
*/
export default content;
