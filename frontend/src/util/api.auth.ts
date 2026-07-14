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
import error    from "#util/common.error.ts";

/**
 * คลังเก็บข้อมูลการลงชื่อเข้าใช้
*/
interface Storage
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
interface StorageEntry
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
        const dItem     = data.requireArrayObject ("Item").map ((x) =>
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
 * เริ่มต้นดำเนินการลงชื่อเข้าใช้งานด้วยรหัสประจำตัว
*/
content.signIn = async (input: string) =>
{
    const endpoint = `${content.NET_URL}/sign-in`;
    const init: RequestInit =
    {
        method: "POST",
        mode: "cors",
        referrerPolicy: "strict-origin",
        headers: 
        [ 
            ["Content-Type", "application/json"]
        ],
        cache: "default",
        body: JSON.stringify (
        {
            "Value": input
        }),
        signal: AbortSignal.abort (content.NET_TIMEOUT)
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });

    switch (response.status)
    {
        case 200: break;
        case 401: throw new error.NotAuthorized ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    const data = await response.json ()
        .then ((x) => reader (x))
        .catch ((e: unknown) =>
    {
        throw new error.BadFormat (e);
    });

    try
    {
        return {
            session: data.requireString ("session"),
            sessionIssued: data.requireDate ("sessionIssued"),
            sessionExpire: data.requireDate ("sessionExpire")
        };
    }
    catch (e: unknown)
    {
        return new error.BadData (e);
    }
}

content.signInPwd = async function (session: string, input: string)
{
    void session;
    void input;

    return Promise.resolve ();
}
content.signInVerifyTotp = async function (session: string, input: string)
{
    void session;
    void input;

    return Promise.resolve ();
}
content.signInFinish = async function (session: string)
{
    void session;

    return Promise.resolve ();
}

content.signUp = async function (id: string, pwd: string, email: string)
{
    void id;
    void pwd;
    void email;

    return Promise.resolve ();
}
content.signUpVerifyEmail = async function (session: string, code: string)
{
    void session;
    void code;

    return Promise.resolve ();
}
content.signUpFinish = async function ()
{
    return Promise.resolve ();
}
content.signOut = async function (session: string)
{
    void session;
    
    return Promise.resolve ();
}

content.checkCompliantId = function (input: string)
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
content.checkCompliantPwd = function (input: string)
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
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;