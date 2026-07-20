/**
 * 
 * ทำหน้าที่เป็นตัวกลางในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับข้อมูลบการยืนยันตัวตนของผู้ใช้ เช่น การลงทะเบียนผู้ใช้ใหม่, 
 * การเข้าสู่ระบบ, การออกจากระบบ และการจัดการข้อมูลการเข้าสู่ระบบที่บันทึกไว้
 * 
 * สำหรับการดำเนินการที่เกี่ยวข้องกับข้อมูลบัญชีผู้ใช้ เช่น ข้อมูลพื้นฐาน, 
 * ข้อมูลติดต่อ, ข้อมูลงานของผู้ใช้ และอื่น ๆ ที่เกี่ยวข้องกับบัญชีผู้ใช้ 
 * โปรดดูที่โมดูล: api.account.ts
 * 
*/
import reader   from "#util/common.objectReader.ts";
import common   from "#util/api.common.ts";

import { type ObjectReader } from "#util/common.objectReader.ts";

/**
 * ตัวกลางในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับข้อมูลบการยืนยันตัวตนของผู้ใช้
*/
const content = () =>
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
}
/**
 * เริ่มต้นดำเนินการลงชื่อเข้าใช้งานด้วยรหัสประจำตัว
*/
content.challengeId = async (input: string) 
    : Promise<Challenge> =>
{
    const endpoint = `${content.NET_URL}/challenge`;
    const response = await common.postJson ("", endpoint, 
    {
        "Type": content.STEP_CHALLENGE_ID,
        "Value": input
    });
    const reader = await common.toJson (response);
    const result = content.readChallenge (reader);

    return result;
}

content.challengePassword = async (session: string, input: string) 
    : Promise<Challenge> =>
{
    const endpoint = `${content.NET_URL}/challenge`;
    const response = await common.postJson (session, endpoint, 
    {
        "Type": content.STEP_CHALLENGE_PASSWORD,
        "Value": input
    });
    const reader = await common.toJson (response);
    const result = content.readChallenge (reader);

    return result;
}
content.challengeTotp = async (session: string, input: string)
    : Promise<Challenge> =>
{
    const endpoint = `${content.NET_URL}/challenge`;
    const response = await common.postJson (session, endpoint, 
    {
        "Type": content.STEP_CHALLENGE_TOTP,
        "Value": input
    });
    const reader = await common.toJson (response);
    const result = content.readChallenge (reader);

    return result;
}

content.readSession = (reader: ObjectReader) : Session =>
{
    return {
        secret: reader.requireString ("Session"),
        issued: reader.requireDate ("SessionIssued"),
        expire: reader.requireDate ("SessionExpire"),
    }
}
content.readChallenge = (reader: ObjectReader) : Challenge =>
{
    return {
        ... content.readSession (reader),
        step: reader.requireInteger ("Step"),
    }
}

content.checkSession = (input: Session) =>
{
    const now = Date.now ();
    return (
        input.secret.length > 0 &&
        now >= input.issued.getTime () &&
        now <= input.expire.getTime ()
    );
}

content.checkCompliantId = (input: string) =>
{
    const lengthEmpty = input.length != 0;
    const lengthMin = input.length >= 2;
    const lengthMax = input.length <= 32;
    const all = lengthMin && lengthMax;

    return {
        lengthEmpty,
        lengthMin,
        lengthMax,
        all
    }
}
content.checkCompliantPwd = (input: string) =>
{
    const lengthEmpty = input.length != 0;
    const lengthMin = input.length >= 8;
    const lengthMax = input.length <= 32;
    const all = lengthMin && lengthMax;

    return {
        lengthEmpty,
        lengthMin,
        lengthMax,
        all
    }
}
/**
 * ทำการตั้งค่าข้อมูลใหม่
*/
content.saveReset = () =>
{
    STORAGE = 
    {
        created: new Date (),
        modified: new Date (NaN),
        prefered: -1,
        item: []
    };
}
/**
 * เพิ่มข้อมูลการลงชื่อเข้าใช้
*/
content.saveAdd = (value: StorageEntry) =>
{
    const existence = STORAGE.item.findIndex ((x) => x.name === value.name);

    if (existence !== -1)
    {
        STORAGE.item[existence] = value;
        return existence;
    }
    STORAGE.item.push (value);
    
    return STORAGE.item.length - 1;
}
/**
 * ลบข้อมูลการลงชื่อเข้าใช้
*/
content.saveRemove = (index: number) =>
{
    STORAGE.item.splice (index, 1);
}
/**
 * รับข้อมูลการลงชื่อเข้าใช้
*/
content.saveGetItem = (index: number) : StorageEntry =>
{
    return STORAGE.item [index];
}
/**
 * รับข้อมูลการลงชื่อเข้าใช้ที่ผู้ใช้ต้องการ
*/
content.saveGetItemPrefered = () : StorageEntry | null =>
{
    if (STORAGE.prefered === -1) {
        return null;
    }
    return STORAGE.item [STORAGE.prefered];
}
/**
 * รับจำนวนบัญชีที่บันทึกไว้ทั้งหมด
*/
content.saveGetItemCount = () =>
{
    return STORAGE.item.length;
}
/**
 * รับค่าบัญชีที่ต้องการลงชื่อใช้เสมอ
*/
content.saveGetPrefered = () =>
{
    return STORAGE.prefered;
}
/**
 * ตั้งบัญชีที่ต้องการลงชื่อใช้เสมอ
*/
content.saveSetPrefered = (value: number) =>
{
    STORAGE.prefered = value;
}
/**
 * โหลดข้อมูลที่อยู่ในพื้นที่จัดเก็บ
*/
content.saveLoad = () =>
{
    if (typeof localStorage !== "undefined")
    {
        const raw = localStorage.getItem (STORAGE_KEY);

        if (typeof raw !== "string")
        {
            // ไม่มีข้อมูลอยู่ใน Local Storage
            return;
        }
        const record = JSON.parse (raw) as Record<string, unknown>;
        const data = reader (record);
        
        const dCreated  = data.requireDate ("Created");
        const dModified = data.requireDate ("Modified");
        const dPrefered = data.requireInteger ("Prefered");
        const dItem     = data.requireArrayUnknown ("Item").map ((x) =>
        {
            const inner = reader (x);
            const name  = inner.requireString ("Name");
            const secret = inner.requireString ("Secret");
            const issued = inner.requireDate ("Issued");
            const expired = inner.requireDate ("Expired");

            const result: StorageEntry =
            {
                name: name,
                secret: secret,
                issued: issued,
                expired: expired,
            }
            return result;
        });

        const result: Storage = 
        {
            created: dCreated,
            modified: dModified,
            prefered: dPrefered,
            item: dItem
        };
        STORAGE = result;
    }
}
/**
 * บันทีกข้อมูลลงในพื้นที่จัดเก็บ
*/
content.saveWrite = () =>
{
    if (typeof localStorage !== "undefined")
    {
        STORAGE.modified = new Date ();

        const object = 
        {
            "Created": STORAGE.created.getTime (),
            "Modified": STORAGE.modified.getTime (),
            "Prefered": STORAGE.prefered,
            "Item": STORAGE.item.map ((x) =>
            {
                return {
                    "Name": x.name,
                    "Secret": x.secret,
                    "Issued": x.issued.getTime (),
                    "Expired": x.expired.getTime (),
                }
            })
        };
        localStorage.setItem (STORAGE_KEY, JSON.stringify (object, null, 2));
    }
}
/**
 * โปรโตอลที่ใช้ในการสื่อสารระหว่างเซิร์ฟเวอร์
*/
content.NET_PROTOCOL = "http";
/**
 * ที่อยู่ของเซิร์ฟเวอร์
*/
content.NET_ADDRESS = location.hostname;
/**
 * พอร์ตการเชื่อมต่อกับเซิร์ฟเวอร์
*/
content.NET_PORT = 51000;
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์
*/
content.NET_PREFIX = "/auth";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 10000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;
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


export interface Session
{
    /**
     * วันที่/เวลาที่สร้างข้อมูลนี้ขึ้นมา
    */
    issued: Date;
    /**
     * วันที่/เวลา หมดอายุของชุดรหัสยืนยันตัวตน
    */
    expire: Date;
    /**
     * ชุดรหัสยืนยันตัวตนที่ได้รับหลังจากลงชื่อเข้าใช้สำเร็จ
    */
    secret: string;
}
export interface Challenge extends Session
{
    /**
     * ขั้นตอนในปัจจุบัน
    */
    step: number;
}
/**
 * คลังเก็บข้อมูลการลงชื่อเข้าใช้
*/
export interface Storage
{
    /**
     * วันที่/เวลาที่สร้างข้อมูลนี้ขึ้นมา
    */
    created: Date;
    /**
     * วันที่/เวลาที่มีการแก้ไขข้อมูลนี้ครั้งล่าสุด
    */
    modified: Date;
    /**
     * ดัชนีของข้อมูลการลงชื่อเข้าใช้ที่ผู้ใช้ต้องการลงชื่อใช้เสมอ หากไม่มีการตั้งค่าใด ๆ จะมีค่าเป็น -1
    */
    prefered: number;
    /**
     * รายการข้อมูลการลงชื่อเข้าใช้ที่บันทึกไว้ในระบบ
    */
    item: StorageEntry [];
}
/**
 * รายการข้อมูลการลงชื่อเข้าใช้
*/
export interface StorageEntry
{
    /**
     * ชื่อบัญชีผู้ใช้หรืออีเมลที่ใช้ในการลงชื่อเข้าใช้
    */
    name: string;
    /**
     * ชุดรหัสยืนยันตัวตนที่ได้รับหลังจากลงชื่อเข้าใช้สำเร็จ
    */
    secret: string;
    /**
     * วันที่/เวลา สร้างของชุดรหัสยืนยันตัวตน
    */
    issued: Date;
    /**
     * วันที่/เวลา หมดอายุของชุดรหัสยืนยันตัวตน
    */
    expired: Date;
}

let STORAGE: Storage = 
{
    created: new Date (),
    modified: new Date (NaN),
    prefered: -1,
    item: []
};
const STORAGE_KEY = "Auth";

/**
 * ส่งออกตัวแปร
*/
export default content;