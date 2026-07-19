import objectReader from "#util/common.objectReader.ts";
import common       from "#util/api.common.ts";
import { type BasicId as AccountId } from "#util/api.account";
import { type ObjectReader } from "#util/common.objectReader.ts";

const content = () => 
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
};
/**
 * ทำการดึงข้อมูลพื้นฐานของสินค้าดังกล่าวที่ระบุด้วยรหัสสินค้า
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
 * ทำการดึงรายการข้อมูลพื้นฐานของสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
*/
content.getBasicList = async (session: string, option ?: BasicFetchOption)
    : Promise<BasicFetch[]> =>
{
    const param = new URLSearchParams ();

    if (option?.search) {
        param.append ("search", option.search);
    }
    const paramOut = param.toString ();
    const paramOut2 = paramOut.length > 0 ? `?${paramOut}` : ``;

    const endpoint = content.NET_URL + paramOut2;
    const data = await common.getJson (session, endpoint);
    const result = content.readBasicList (data);

    return result;
}
/**
 * ทำการดึงข้อมูลความคิดเห็นพื้นฐานของสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param key รหัสความคิดเห็นที่ถูกต้อง
*/
content.getComment = async (session: string, key: CommentId) 
    : Promise<CommentFetch> =>
{
    const id = String (key);
    const endpoint = `${content.NET_URL_COMMENT}/${id}`;
    const data = await common.getJson (session, endpoint);
    const result = content.readComment (data);

    return result;
}

/**
 * ทำการเปลี่ยนข้อมูลพื้นฐานของสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param data ชุดข้อมูลประกอบการเปลี่ยนแปลง
*/
content.updateBasic = async (session: string, data: BasicUpdate) 
    : Promise<void> =>
{
    const id = String (data.id);
    const endpoint = `${content.NET_URL_COMMENT}/${id}`;

    await common.putJson (session, endpoint, {
        "Name": data.name,
        "Description": data.description,
        "Price": data.price,
        "PriceCode": data.priceCode,
    });
}
/**
 * ทำการสร้างข้อมูลพื้นฐานของสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param data ชุดข้อมูลประกอบการสร้าง
*/
content.createBasic = async (session: string, data: BasicCreate) :
    Promise<BasicCreateResult> =>
{
    const endpoint = content.NET_URL;
    const form = new FormData ();

    form.append ("Metadata", JSON.stringify ({
        "Name": data.name,
        "Description": data.description,
        "Price": data.price,
        "PriceCode": data.priceCode,
    }));
    form.append ("Cover", data.cover);

    const response = await common.postForm (session, endpoint, form);
    const reader = await common.toJson (response);
    const result = content.readCreateResult (reader);

    return result;
}
/**
 * ทำการลบข้อมูลพื้นฐานของสินค้า
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param key รหัสสินค้า
*/
content.deleteBasic = async (session: string, key: BasicId) 
    : Promise<void> =>
{
    const id = String (key);
    const endpoint = `${content.NET_URL_COMMENT}/${id}`;

    await common.delete (session, endpoint);
}
content.readBasic = (reader: ObjectReader) : BasicFetch =>
{
    return {
        id: reader.requireInteger ("Id"),
        name: reader.requireString ("Name"),
        description: reader.requireString ("Description"),
        price: reader.requireFloat ("Price"),
        priceCode: reader.requireInteger ("PriceCode"),
        platform: reader.requireInteger ("Platform"),
        cover: reader.requireString ("Cover"),
    };
}
content.readBasicList = (reader: ObjectReader) : BasicFetch [] =>
{
    return reader.requireArrayRecord ("Item").map ((x) =>
    {
        return content.readBasic (objectReader (x));
    });
}
content.readComment = (reader: ObjectReader) : CommentFetch =>
{
    return {
        commentId: reader.requireInteger ("CommentId"),
        productId: reader.requireInteger ("ProductId"),
        author: reader.requireInteger ("Author"),
        title: reader.requireString ("Title"),
        text: reader.requireString ("Text"),
    };
}
content.readCreateResult = (reader: ObjectReader) : BasicCreateResult =>
{
    return {
        id: reader.requireInteger ("Id"),
        created: reader.requireDate ("Created") 
    };
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
content.NET_PREFIX = "/product";
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์ สำหรับระบบแยกหมวดหมู่
*/
content.NET_PREFIX_CATEGORY = "/product-category";
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์ สำหรับระบบความคิดเห็น
*/
content.NET_PREFIX_COMMENT = "/product-comment";
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์ สำหรับระบบตัวอย่าง
*/
content.NET_PREFIX_REVIEW = "/product-review";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 30000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์ สำหรับระบบแยกหมวดหมู่
*/
content.NET_URL_CATEGORY = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX_CATEGORY}`;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์ สำหรับระบบความคิดเห็น
*/
content.NET_URL_COMMENT = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX_COMMENT}`;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์ สำหรับระบบตัวอย่าง
*/
content.NET_URL_COMMENT = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX_REVIEW}`;
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
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type BasicId = number;
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
export interface BasicFetch
{
    /**
     * รหัสสินค้า
    */
    id: BasicId;
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
    cover: string;
}
export interface BasicFetchOption
{
    search ?: string | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลพื้นฐานในฐานข้อมูล
*/
export interface BasicUpdate
{
    /**
     * รหัสสินค้า
    */
    id: BasicId;
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
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลพื้นฐานในฐานข้อมูล
*/
export interface BasicCreate
{
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
     * ปกสินค้า
    */
    cover: Blob | File;
}
/**
 * โครงสร้างประกอบที่ได้รับหลังจากสร้างสินค้าแล้ว
*/
export interface BasicCreateResult
{
    /**
     * รหัสสินค้า
    */
    id: number;
    /**
     * วันที่สร้าง
    */
    created: Date;
}

export interface CategoryFetch
{
    /**
     * รหัสเอกลักษณ์
    */
    categoryId: CategoryId;
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัสหมวดหมู่
    */
    value: number;
}
export interface CategoryUpdate
{
    /**
     * รหัสเอกลักษณ์
    */
    categoryId: CategoryId;
    /**
     * รหัสหมวดหมู่
    */
    value ?: number | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface CategoryCreate
{
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัสหมวดหมู่
    */
    value: number;
}

/**
 * โครงสร้างข้อมูลเมื่อทำการดึงข้อมูลความคิดเห็น
*/
export interface CommentFetch
{
    /**
     * รหัสความคิดเห็น
    */
    commentId: CommentId;
    /**
     * รหัสสินค้าที่เกี่ยวข้อง
    */
    productId: BasicId;
    /**
     * รหัสบัญชีของผู้เขียน
    */
    author: AccountId;
    /**
     * หัวเรื่อง
    */
    title: string;
    /**
     * ข้อความ
    */
    text: string;
}
export interface CommentUpdate
{
    /**
     * รหัสสินค้าที่เกี่ยวข้อง
    */
    productId: BasicId;
    /**
     * หัวเรื่อง
    */
    title: string;
    /**
     * ข้อความ
    */
    text: string;
}
export interface CommentCreate
{
    /**
     * รหัสสินค้าที่เกี่ยวข้อง
    */
    productId: BasicId;
    /**
     * หัวเรื่อง
    */
    title: string;
    /**
     * ข้อความ
    */
    text: string;
}

/**
 * ส่งออกตัวแปร
*/
export default content;