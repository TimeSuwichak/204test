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
import objectReader from "#util/common.objectReader.ts";
import common       from "#util/api.common.ts";

import { type ObjectReader } from "#util/common.objectReader.ts";
import { type BasicId as ProductId } from "#util/api.product.ts";
import { type BasicId as OrderId } from "#util/api.order.ts";
import { type BasicId as PromotionId } from "#util/api.promotion";

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
    const result = content.outputGetBasic (reader);

    return result;
}
/**
 * รับข้อมูลรายการตะกร้าสินค้า
*/
content.getCart = async (session: string) =>
{    
    const url = content.NET_URL_CART;
    const reader = await common.getJson (session, url);
    const result = reader.requireArrayRecord ("Item").map ((x) =>
    {
        return content.outputGetCart (objectReader (x));
    });
    return result;
}
content.getOrder = async (session: string) =>
{
    const url = content.NET_URL_ORDER;
    const reader = await common.getJson (session, url);
    const result = reader.requireArrayRecord ("Item").map ((x) =>
    {
        return content.outputGetOrder (objectReader (x));
    });
    return result;
}

/**
 * ปรับเปลี่ยนข้อมูลบัญชีของผู้ใช้ดังกล่าว
 * คำสั่งอาจต้องใช้บัญชีสิทธิ์ขั้นสูงในการปรับตัวแปรบางตัวแปร
*/
content.updateBasic = async (session: string, data: BasicUpdate) =>
{
    const extension = data.id ? `/${String (data.id)}` : ``;
    const endpoint = `${content.NET_URL}${extension}`;
    const form = new FormData ();

    form.append ("Metadata", JSON.stringify ({
        "Name": data.name,
        "Role": data.role,
        "Status": data.status
    }));
    if (data.icon)
    {
        form.append ("Icon", data.icon);
    }
    await common.putForm (session, endpoint, form);
}
/**
 * ปรับเปลี่ยนข้อมูลที่กำลังอยู่ในตะกร้าของบัญชีตนเอง
*/
content.updateCart = async (session: string, data: CartUpdate) =>
{
    const id = data.itemId;
    const url = content.NET_URL_CART + (id ? `/${String (id)}` : "");

    await common.putJson (session, url, {
        "ItemId": data.itemId,
        "Quantity": data.quantity
    });
}
/**
 * เพิ่มบัญชีใหม่ลงในระบบ
*/
content.createBasic = async (session: string, data: BasicCreate) =>
{
    const url = content.NET_URL;
    const form = new FormData ();

    form.append ("Metadata", JSON.stringify ({
        "Name": data.name,
        "Role": data.role,
        "Status": data.status,
    }));

    if (data.icon)
    {
        form.append ("Icon", data.icon);
    }
    const response = await common.postForm (session, url, form);
    const json = await common.toJson (response);
    const result = content.outputPostBasic (json);

    return result;
}
/**
 * เพิ่มสินค้นในตะกร้าลงในบัญชีของตนเอง
*/
content.createCart = async (session: string, data: CartCreate) =>
{
    const url = content.NET_URL_CART;
    const response = await common.postJson (session, url, {
        "ProductId": data.productId,
        "Quantity": data.quantity
    });
    const json = await common.toJson (response);
    const result = content.outputPostCart (json);

    return result;
}
/**
 * สร้างคำสั่งซื้อไปยังระบบ
*/
content.createOrder = async (session: string, data: OrderCreate) =>
{
    const url = content.NET_URL_ORDER;
    const response = await common.postJson (session, url, {
        "ShipName": data.shipName,
        "ShipAddress": data.shipAddress,
        "ShipPhone": data.shipPhone,
        "ShipEmail": data.shipEmail,
        "PaymentType": data.paymentType,
        "PromotionId": data.promotionId,
        "Item": data.item.map ((x) => {
            return {
                "ProductId": x.productId,
                "Quantity": x.quantity
            }
        }),
    });
    const json = await common.toJson (response);
    const result = content.outputPostCart (json);

    return result;
}

/**
 * ลบข้อมูลบัญชีดังกล่าวออกจากระบบ ซึ่งรวมไปถึงข้อมูลการเข้าสู่ระบบเช่นกัน
*/
content.deleteBasic = async (session: string, id: BasicId) =>
{
    const key = String (id);
    const endpoint = `${content.NET_URL}/${key}`;
    await common.delete (session, endpoint);
}
/**
 * ลบไอเท็มดังกล่าวออกจากตะกร้าของบัญชีตนเอง
*/
content.deleteCart = async (session: string, id: CartId) =>
{
    const key = String (id);
    const endpoint = `${content.NET_URL_CART}/${key}`;
    await common.delete (session, endpoint);
}

/**
 * (ฟังก์ชั่นภายใน)
*/
content.outputGetBasic = (reader: ObjectReader) : BasicFetch =>
{
    return {
        id: reader.requireInteger ("Id"),
        icon: reader.requireString ("Icon"),
        role: reader.optionalInteger ("Role") ?? 0,
        name: reader.requireString ("Name"),
        status: reader.requireInteger ("Status"),
    }
}
/**
 * (ฟังก์ชั่นภายใน)
*/
content.outputGetCart = (reader: ObjectReader) : CartFetch =>
{
    return {
        itemId: reader.requireInteger ("ItemId"),
        productId: reader.requireInteger ("ProductId"),
        quantity: reader.requireInteger ("Quantity")
    }
}
/**
 * (ฟังก์ชั่นภายใน)
*/
content.outputGetOrder = (reader: ObjectReader) : OrderFetch =>
{
    const result: OrderFetch =
    {
        orderId: reader.requireInteger ("OrderId"),
        accountId: reader.requireInteger ("AccountId"),
        created: reader.requireDate ("Created"),
        delivered: reader.requireDateOrNull ("Delivered"),
        status: reader.requireInteger ("Status"),
        shipName: reader.requireString ("ShipName"),
        shipAddress: reader.requireString ("ShipAddress"),
        shipPhone: reader.requireString ("ShipPhone"),
        shipEmail: reader.requireString ("ShipEmail"),
        paymentType: reader.requireInteger ("PaymentType"),
        promotionId: reader.requireStringOrNull ("PromotionId"),
        item: reader.requireArrayRecord ("Item").map ((x) =>
        {
            const inner = objectReader (x);
            return {
                productId: inner.requireInteger ("ProductId"),
                quantity: inner.requireInteger ("Quantity"),
            }
        })
    };
    return result;
}
/**
 * (ฟังก์ชั่นภายใน)
*/
content.outputPostBasic = (reader: ObjectReader) : BasicCreateResult =>
{
    return {
        id: reader.requireInteger ("Id"),
        created: reader.requireDate ("Created")
    }
}
/**
 * (ฟังก์ชั่นภายใน)
*/
content.outputPostCart = (reader: ObjectReader) : BasicCreateResult =>
{
    return {
        id: reader.requireInteger ("Id"),
        created: reader.requireDate ("Created")
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
content.NET_PREFIX_CART = "/account-cart";
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์ สำหรับข้อมูลคำสั่งซื้อ
*/
content.NET_PREFIX_ORDER = "/account-order";
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
content.NET_URL_CART = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX_CART}`;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์ สำหรับระบบคำสั่งซื้อ
*/
content.NET_URL_ORDER = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX_ORDER}`;

/**
 * บทบาทบัญชี: ลงชื่อเข้าใช้
*/
content.ROLE_AUTH = 1;
/**
 * บทบาทบัญชี: ผู้ใช้
*/
content.ROLE_USER = 2;
/**
 * บทบาทบัญชี: ผู้ดูแล
*/
content.ROLE_STAFF = 3;
/**
 * บทบาทบัญชี:ผู้ดูแลระบบ
*/
content.ROLE_MANAGER = 4;
/**
 * บทบาทบัญชี:ผู้พัฒนาระบบ
*/
content.ROLE_DEVELOPER = 5;
/**
 * รายการบทบาทบัญชีทั้งหมดในระบบ
*/
content.ROLE_LIST = 
[
    content.ROLE_USER,
    content.ROLE_STAFF,
    content.ROLE_MANAGER,
    content.ROLE_DEVELOPER
];
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
    /**
     * สถานะบัญชี
    */
    status: number;
}
/**
 * ข้อมูลพื้นฐานที่ใช้ในการปรับเปลี่ยนข้อมูลบัญชีผู้ใช้
*/
export interface BasicUpdate
{
    /**
     * รหัสบัญชี
    */
    id ?: BasicId | undefined;
    /**
     * บทบาทของผู้ใช้
    */
    role ?: BasicId | undefined;
    /**
     * ชื่อของผู้ใช้
    */
    name ?: string | undefined;
    /**
     * รูปโปรไฟล์
    */
    icon ?: File | undefined;
    /**
     * สถานะบัญชี
    */
    status ?: number | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface BasicCreate
{
    /**
     * ชื่อผู้ใช้
    */
    name: string;
    /**
     * บทบาทของผู้ใช้
    */
    role: number;
    /**
     * ไอคอน
    */
    icon: File | undefined;
    /**
     * สถานะบัญชี
    */
    status: number;
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

export interface CartFetch
{
    /**
     * รหัสเอกลักษณ์ของตะกร้า
    */
    itemId: CartId;
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * จำนวนของในตะกร้า
    */
    quantity: number;
}
export interface CartUpdate
{
    /**
     * รหัสเอกลักษณ์ของตะกร้า
    */
    itemId: CartId;
    /**
     * จำนวนของในตะกร้า
    */
    quantity ?: number | undefined;
}
export interface CartCreate
{
    /**
     * รหัสเอกลักษณ์ของตะกร้า
    */
    productId: ProductId;
    /**
     * จำนวนของในตะกร้า
    */
    quantity: number;
}

export interface OrderFetch
{
    /**
     * รหัสคำสั่งซื้อ
    */
    readonly orderId: OrderId;
    /**
     * รหัสบัญชี
    */
    readonly accountId: BasicId;
    /**
     * วันที่สร้างคำสั่งซื้อ
    */
    readonly created: Date;
    /**
     * วันที่ได้ลูกค้ารับสินค้า
    */
    readonly delivered: Date | null;
    /**
     * สถานะคำสั่งซื้อ
    */
    readonly status: number;
    /**
     * ชื่อผู้รับ
    */
    readonly shipName: string;
    /**
     * ที่อยู่ผู้รับ
    */
    readonly shipAddress: string;
    /**
     * เบอร์โทรศัพท์ผู้รับ
    */
    readonly shipPhone: string;
    /**
     * อีเมลผู้รับ
    */
    readonly shipEmail: string;
    /**
     * ประเภทชำระเงิน
    */
    readonly paymentType: number;
    /**
     * รหัสโปรโมชั่น
    */
    readonly promotionId: PromotionId | null;
    /**
     * รายการสินค้า
    */
    readonly item: {
        /**
         * รหัสสินค้า
        */
        readonly productId: ProductId;
        /**
         * จำนวนสินค้า
        */
        readonly quantity: number;
    } [];
}
export interface OrderCreate
{
    /**
     * ชื่อผู้รับ
    */
    readonly shipName: string;
    /**
     * ที่อยู่ผู้รับ
    */
    readonly shipAddress: string;
    /**
     * เบอร์โทรศัพท์ผู้รับ
    */
    readonly shipPhone: string;
    /**
     * อีเมลผู้รับ
    */
    readonly shipEmail: string;
    /**
     * ประเภทชำระเงิน
    */
    readonly paymentType: number;
    /**
     * รหัสโปรโมชั่น
    */
    readonly promotionId: PromotionId | null;
    /**
     * รายการสินค้าในคำสั้งซื้อสินค้า
    */
    readonly item: {
        /**
         * รหัสสินค้า
        */
        readonly productId: ProductId;
        /**
         * จำนวนสินค้าที่สั่งซื้อ
        */
        readonly quantity: number;
    }[];
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