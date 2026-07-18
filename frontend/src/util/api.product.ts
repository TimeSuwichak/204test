import error from "#util/common.error.ts";
import objectReader from "#util/common.objectReader.ts";

/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type MainId = number;
/**
 * รหัสของชุดรหัสข้อมูลสำหรับหมวดหมู่ (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type CategoryId = number;
/**
 * รหัสของชุดรหัสข้อมูลสำหรับความคิดเห็น (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type CommentId = number;
/**
 * รหัสของชุดรหัสข้อมูลสำหรับตัวอย่าง (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type ReviewId = number;

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลพื้นฐานจากระบบฐานข้อมูล
*/
export interface FetchBasic
{
    /**
     * รหัสสินค้า
    */
    id: MainId;
    /**
     * ชื่อสินค้า
    */
    name: string;
    /**
     * ข้อความอธิบาย
    */
    description: string;
    /**
     * ราคา
    */
    price: number;
    /**
     * สกุลเงิน
    */
    priceCode: number;
    /**
     * แพลตฟอร์ม
    */
    platform: number;
    /**
     * รูปปกเกม
    */
    artwork: string;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลพื้นฐานในฐานข้อมูล
*/
export interface UpdateBasic
{
    /**
     * รหัสสินค้า
    */
    id: MainId;
    /**
     * ชื่อสินค้า
    */
    name ?: string | undefined;
    /**
     * ข้อความอธิบาย
    */
    description ?: string | undefined;
    /**
     * ราคา
    */
    price ?: number | undefined;
    /**
     * สกุลเงิน
    */
    priceCode ?: number | undefined;
    /**
     * แพลตฟอร์ม
    */
    platform ?: number | undefined;
    /**
     * รูปปกเกม
    */
    artwork ?: string | undefined;
}

const content = () => 
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
};
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
content.NET_PREFIX = "/product";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 30000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;
/**
 * ไม่มีแพลตฟอร์ม
*/
content.PLATFORM_NONE = 0;
/**
 * แพลตฟอร์ม: Windows
 */
content.PLATFORM_WINDOWS = 1;
/**
 * แพลตฟอร์ม: Android
 */
content.PLATFORM_ANDROID = 2;
/**
 * แพลตฟอร์ม: Linux
 */
content.PLATFORM_LINUX = 3;
/**
 * แพลตฟอร์ม: MacOS
 */
content.PLATFORM_MACOS = 4;
/**
 * แพลตฟอร์ม: iOS
 */
content.PLATFORM_IOS = 5;
/**
 * แพลตฟอร์ม: PlayStation 1
 */
content.PLATFORM_PLAYSTATION_1 = 6;
/**
 * แพลตฟอร์ม: PlayStation 2
 */
content.PLATFORM_PLAYSTATION_2 = 7;
/**
 * แพลตฟอร์ม: PlayStation 3
 */
content.PLATFORM_PLAYSTATION_3 = 8;
/**
 * แพลตฟอร์ม: PlayStation 4
 */
content.PLATFORM_PLAYSTATION_4 = 9;
/**
 * แพลตฟอร์ม: PlayStation 5
 */
content.PLATFORM_PLAYSTATION_5 = 10;
/**
 * แพลตฟอร์ม: XBOX
 */
content.PLATFORM_XBOX = 11;
/**
 * แพลตฟอร์ม: XBOX 360
 */
content.PLATFORM_XBOX_360 = 12;
/**
 * แพลตฟอร์ม: XBOX One
 */
content.PLATFORM_XBOX_ONE = 13;
/**
 * แพลตฟอร์ม: XBOX One S
 */
content.PLATFORM_XBOX_ONE_S = 14;
/**
 * แพลตฟอร์ม: XBOX One X
 */
content.PLATFORM_XBOX_ONE_X = 15;
/**
 * แพลตฟอร์ม: XBOX Series X
 */
content.PLATFORM_XBOX_SERIES_X = 16;
/**
 * แพลตฟอร์ม: XBOX Series S
 */
content.PLATFORM_XBOX_SERIES_S = 17;

/**
 * ทำการดึงข้อมูลพื้นฐานของสินค้าดังกล่าวที่ระบุด้วยรหัสสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param key รหัสสินค้าที่ถูกต้อง
*/
content.getBasic = async (session: string, key: MainId)
    : Promise<FetchBasic> =>
{
    const id = String (key);
    const endpoint = `${content.NET_URL}/product/${id}`;
    const init: RequestInit =
    {
        method: "GET",
        mode: "cors",
        referrerPolicy: "strict-origin",
        cache: "default",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        headers: 
        [ 
            ["Accept", "application/json"],
            ["Authorization", (session.length > 0) ? `Bearer ${session}` : ``]
        ],
        body: undefined
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 401: throw new error.NotAuthorized ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    const json = await response.json ().catch ((x: unknown) => {
        throw new error.BadFormat (x);
    }) as Record<string, unknown>;

    return content.getBasicByData (json);
}
/**
 * ทำการดึงรายการข้อมูลพื้นฐานของสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
*/
content.getBasicByList = async (session: string)
    : Promise<FetchBasic[]> =>
{
    const endpoint = `${content.NET_URL}/product`;
    const init: RequestInit =
    {
        method: "GET",
        mode: "cors",
        referrerPolicy: "strict-origin",
        cache: "default",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        headers: 
        [ 
            ["Accept", "application/json"],
            ["Authorization", (session.length > 0) ? `Bearer ${session}` : ``]
        ],
        body: undefined
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 401: throw new error.NotAuthorized ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    const json = await response.json ().catch ((x: unknown) => {
        throw new error.BadFormat (x);
    }) as Record<string, unknown>[];

    return json.map (x => content.getBasicByData (x));
}
content.getBasicByData = (data: Record<string, unknown>) 
    : FetchBasic =>
{
    const reader = objectReader (data);
    return {
        id: reader.requireInteger ("Id"),
        name: reader.requireString ("Name"),
        description: reader.requireString ("Description"),
        artwork: reader.requireString ("Artwork"),
        price: reader.requireFloat ("Price"),
        priceCode: reader.requireInteger ("PriceCode"),
        platform: reader.requireInteger ("Platform")
    };
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;