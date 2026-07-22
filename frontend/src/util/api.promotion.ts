import objectReader from "#util/common.objectReader.ts";
import common       from "#util/api.common.ts";
import { type ObjectReader } from "#util/common.objectReader.ts";

const content = () => 
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
};
/**
 * ทำการดึงข้อมูลพื้นฐานของโปรโมชันดังกล่าวที่ระบุด้วยรหัสสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param key รหัสสินค้าที่ถูกต้อง
*/
content.getBasic = async (session: string, key: BasicId)
    : Promise<BasicFetch> =>
{
    const id = String (key);
    const endpoint = `${content.NET_URL}/${id}`;
    const data = await common.getJson (session, endpoint);
    const result = content.readBasic (data);

    return result;
}
/**
 * ทำการดึงรายการข้อมูลพื้นฐานของโปรโมชันทั้งหมดที่มีอยู่
 * 
 * @param session ชุดรหัสยืนยันตัวตน
*/
content.getBasicList = async (session: string)
    : Promise<BasicFetch[]> =>
{
    const endpoint = content.NET_URL;
    const data = await common.getJson (session, endpoint);
    const result = content.readBasicList (data);

    return result;
}

/**
 * ปรับเปลี่ยนข้อมูลที่มีอยู่ในฐานข้อมูลของโปรโมชันดังกล่าว
*/
content.updateBasic = async (session: string, data: BasicUpdate) =>
{
    const id = data.id;
    const url = content.NET_URL + (id ? `/${String (id)}` : "");

    await common.putJson (session, url, {
        "Expire": data.expire,
        "Type": data.type,
        "Discount": data.discount,
        "MinPrice": data.minPrice,
        "MaxDiscount": data.maxDiscount
    });
}
content.createBasic = async (session: string, data: BasicCreate) =>
{
    const response = await common.postJson (session, content.NET_URL, {
        "Id": data.id,
        "Expire": data.expire,
        "Type": data.type,
        "Discount": data.discount,
        "MinPrice": data.minPrice,
        "MaxDiscount": data.maxDiscount
    });
    const json = await common.toJson (response);
    const result: BasicCreateResult =
    {
        id: json.requireInteger ("Id"),
        created: json.requireDate ("Created")
    };
    return result;
}

content.readBasic = (reader: ObjectReader) =>
{
    const result: BasicFetch =
    {
        id: reader.requireString ("Id"),
        created: reader.requireDate ("Created"),
        expire: reader.requireDate ("Expire"),
        type: reader.requireInteger ("Type"),
        discount: reader.requireInteger ("Discount"),
        minPrice: reader.requireFloat ("MinPrice"),
        maxDiscount: reader.requireFloat ("MaxDiscount"),
        used: reader.requireBoolean ("Used"),
    };
    return result;
}
content.readBasicList = (reader: ObjectReader) =>
{
    const result: BasicFetch[] = reader.requireArrayRecord ("List")
    .map (item => content.readBasic (objectReader.create (item)));
    return result;
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
content.NET_PREFIX = "/promotion";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 10000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface BasicFetch
{
    id: BasicId;
    created: Date;
    expire: Date;
    type: number;
    discount: number;
    minPrice: number;
    maxDiscount: number;
    used: boolean;
}

/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface BasicUpdate
{
    id: BasicId;
    expire ?: Date | undefined;
    type ?: number | undefined;
    discount ?: number | undefined;
    minPrice ?: number | undefined;
    maxDiscount ?: number | undefined;
}

/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface BasicCreate
{
    id: BasicId;
    expire: Date;
    type: number;
    discount: number;
    minPrice: number;
    maxDiscount: number;
}
export interface BasicCreateResult
{
    /**
     * รหัสบัญชี
    */
    id: number;
    /**
     * เวลาที่สร้างบัญชี (อาจคลาดเคลื่อน)
    */
    created: Date;
}

/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type BasicId = string;

export default content;