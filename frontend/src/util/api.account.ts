/**
 * 
 * ทำหน้าที่เป็นตัวกลางในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับข้อมูลบัญชีผู้ใช้ ข้อมูลบัญชีผู้ใช้ที่จัดการโดยโมดูลนี้
 * จะรวมไปถึงข้อมูลพื้นฐาน, ข้อมูลติดต่อ, และอื่น ๆ ที่เกี่ยวข้องกับบัญชีผู้ใช้
 * 
 * สำหรับการดำเนินการที่เกี่ยวข้องกับการเข้าสู่ระบบ
 * และการลงทะเบียนผู้ใช้โปรดดูที่โมดูล: api.auth.ts
 * 
*/
import error        from "#util/common.error.ts";
import objectReader from "#util/common.objectReader.ts";
import common       from "#util/api.common.ts";

import { type ObjectReader } from "#util/common.objectReader.ts";
import { type BasicId as ProductId } from "#util/api.product";

/**
 * โมดูลหลักที่ใช้ในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับข้อมูลบัญชีผู้ใช้
*/
const content = () => 
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
};

/**
 * รับข้อมูลพื้นฐานเกี่ยวบัญชีผู้ใช้
*/
content.getBasic = async (session: string, id ?: BasicId) 
    : Promise<BasicFetch> =>
{
    const url = content.NET_URL + (id ? `/${String (id)}` : "");
    const reader = await common.getJson (session, url);
    const result = content.readBasic (reader);

    return result;
}
content.getCartList = async (session: string) =>
{    
    const url = content.NET_URL_CART;
    const reader = await common.getJson (session, url);
    const result = reader.requireArrayRecord ("Item").map ((x) =>
    {
        return content.readCart (objectReader (x));
    });
    return result;
}

/**
 * ปรับเปลี่ยนข้อมูลบัญชีของผู้ใช้ดังกล่าว
 * คำสั่งอาจต้องใช้บัญชีสิทธิ์ขั้นสูงในการปรับตัวแปรบางตัวแปร
*/
content.setBasic = async (session: string, data: BasicUpdate) =>
{
    const extension = data.id ? `/${String (data.id)}` : ``;
    const endpoint = `${content.NET_URL}/account${extension}`;

    await common.postJson (session, endpoint, {
        "Name": data.name,
        "Role": data.role,
    });
}
/**
 * สร้างอัพโหลดไอคอนให้กับบัญชี
*/
content.setBasicIcon = async (session: string, data: Blob, id ?: number) =>
{
    id = id ?? 0;

    const form = new FormData ();

    form.append ("Source", data);

    const endpoint = `${content.NET_URL}/account/${String (id)}/icon`;
    const option: RequestInit = 
    {
        method: "PUT",
        mode: "cors",
        referrerPolicy: "strict-origin",
        cache: "default",
        headers:
        [
            ["Authorization", `Bearer ${session}`],
        ],
        body: form,
        signal: AbortSignal.timeout (content.NET_TIMEOUT)
    }
    const response = await fetch (endpoint, option).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });

    switch (response.status)
    {
        case 200: break;
        case 400: throw new error.BadData ();
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default:
            throw new error.Unknown ();
    }
}

/**
 * ลบข้อมูลบัญชีดังกล่าวออกจากระบบ ซึ่งรวมไปถึงข้อมูลการเข้าสู่ระบบเช่นกัน
*/
content.delete = async (session: string, id: BasicId) =>
{
    const key = String (id);
    const endpoint = `${content.NET_URL}/account/${key}`;
    await common.delete (session, endpoint);
}
content.readBasic = (reader: ObjectReader) : BasicFetch =>
{
    return {
        id: reader.requireInteger ("Id"),
        icon: reader.requireString ("Icon"),
        role: reader.optionalInteger ("Role") ?? 0,
        name: reader.requireString ("Name"),
    }
}
content.readCart = (reader: ObjectReader) : CartFetch =>
{
    return {
        itemId: reader.requireInteger ("ItemId"),
        productId: reader.requireInteger ("ProductId"),
        quantity: reader.requireInteger ("Quantity")
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
content.NET_PREFIX = "/account";
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์ สำหรับระบบตะกร้า
*/
content.NET_PREFIX = "/account-cart";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 10000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์ สำหรับระบบตะกร้า
*/
content.NET_URL_CART = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;
/**
 * บทบาทบัญชี: ผู้ใช้
*/
content.ROLE_USER = 1;
/**
 * บทบาทบัญชี: ผู้ดูแล
*/
content.ROLE_STAFF = 2;
/**
 * บทบาทบัญชี:ผู้ดูแลระบบ
*/
content.ROLE_MANAGER = 3;
/**
 * บทบาทบัญชี:ผู้พัฒนาระบบ
*/
content.ROLE_DEVELOPER = 4;

/**
 * เก็บรวบรวมข้อมูลพื้นฐานเกี่ยวกับบัญชีผู้ใช้
*/
export interface BasicFetch
{
    /**
     * รหัสบัญชี
    */
    id: BasicId;
    /**
     * ไอคอน
    */
    icon: string;
    /**
     * บทบาทของผู้ใช้
    */
    role: number;
    /**
     * ชื่อผู้ใช้
    */
    name: string;
}
/**
 * ข้อมูลพื้นฐานที่ใช้ในการปรับเปลี่ยนข้อมูลบัญชีผู้ใช้
*/
export interface BasicUpdate
{
    /**
     * รหัสบัญชี
    */
    id ?: BasicId;
    /**
     * บทบาทของผู้ใช้
    */
    role ?: BasicId | undefined;
    /**
     * ชื่อของผู้ใช้
    */
    name ?: string | undefined;
}

export interface CartFetch
{
    itemId: CartId;
    productId: ProductId;
    quantity: number;
}
export interface CartUpdate
{
    itemId: CartId;
    accountId: BasicId;
    quantity ?: number | undefined;
}
export interface CartCreate
{
    accountId: BasicId;
    productId: ProductId;
    quantity: number;
}

/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type BasicId = number;
/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type CartId = number;
/**
 * ส่งออกตัวแปร
*/
export default content;