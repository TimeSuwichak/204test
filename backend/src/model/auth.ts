import * as jwt     from "jose";
import env          from "#core/env.ts";
import error        from "#core/error.ts";
import modelAct     from "#model/account.ts";
import
{
    type DataId as DataAccountId
}
from "#model/account.ts";

/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type DataId = string;
/**
 * รหัสของชุดรหัสข้อมูลสำหรับ Facebook (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type DataIdFb = number;
/**
 * รหัสบัญชี (หรือเรียกอีกอย่างว่า FOREIGN KEY)
*/
export type DataLink = DataAccountId;
/**
 * ชุดข้อมูลที่ได้รับจากการลงชื่อเข้าใช้
*/
export interface Session
{
    /**
     * ชุดรหัสยืนยันตัวตน
    */
    session: string;
    /**
     * วันที่ออกชุดรหัส
    */
    sessionIssued: Date;
    /**
     * วันที่ชุดรหัสหมดอายุ
    */
    sessionExpire: Date;
    /**
     * รหัสบัญชี
    */
    id: DataAccountId;
    /**
     * บทบาทบัญชี
    */
    role: number;
    /**
     * ข้อจำกัดการเข้าถึงบัญชี
    */
    restriction: number;

    /**
     * รหัสประจำตัว (ใช้ในขณะที่ลงชื่อเข้าใช้/สมัคร)
    */
    authId ?: DataId;
    /**
     * ขั้นตอนปัจจุบัน (ใช้ในขณะที่ลงชื่อเข้าใช้/สมัคร)
    */
    authStep ?: number;
}

let EXPIRE_SESSION: number;
let EXPIRE_CHALLENGE: number;
let JWT_ISSUER: string;
let JWT_SECRET: Uint8Array;
let FB_APP_ID: string;

/**
 * ระบบจัดการระบบยืนยันตัวตนผู้ใช้
*/
const content = () =>
{
    return;
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

    console.log (FB_APP_ID);

    Object.freeze (EXPIRE_SESSION);
    Object.freeze (EXPIRE_CHALLENGE);
    Object.freeze (JWT_ISSUER);
    Object.freeze (FB_APP_ID);

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
 * สร้างชุดรหัสยืนยันตัวตน
 * 
 * @param issued วันที่สร้าง
 * @param expired วันที่หมดอายุ
 * @param accountId รหัสบัญชี
 * @param accountRole บทบาท
 * @param accountRestriction ข้อจำกัด
*/
content.create = (
    issued: Date, 
    expire: Date | undefined,
    accountId: DataAccountId,
    accountRole: number,
    accountRestriction: number
) =>
{
    expire = expire ?? new Date (8640000000000000);

    const data = 
    {
        "Id": accountId,
        "Role": accountRole,
        "Restriction": accountRestriction,
    };
    return content.jwtSign (data, issued, expire).then ((x) =>
    {
        const result: Session =
        {
            session: x,
            sessionIssued: issued,
            sessionExpire: expire,
            id: accountId,
            role: accountRole,
            restriction: accountRestriction,
        };
        return result;
    });
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
content.createChallenge = (
    issued: Date, 
    expire: Date | undefined,
    accountId: DataAccountId,
    authId: DataId,
    authStep: number
) =>
{
    expire = expire ?? new Date (8640000000000000);

    const data = 
    {
        "Id": accountId,
        "Role": modelAct.ROLE_AUTH,
        "Restriction": content.RESTRICTION_CHALLENGE,
        "AuthId": authId,
        "AuthStep": authStep
    };
    return content.jwtSign (data, issued, expire).then ((x) =>
    {
        const result: Session =
        {
            session: x,
            sessionIssued: issued,
            sessionExpire: expire,
            id: accountId,
            role: modelAct.ROLE_AUTH,
            restriction: content.RESTRICTION_CHALLENGE,

            authId: authId,
            authStep: authStep
        };
        return result;
    });
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
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;