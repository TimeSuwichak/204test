import common from "#util/api.common.ts";
import objectReader from "#util/common.objectReader.ts";
import { type BasicId as AccountId } from "#util/api.account.ts";
import { type BasicId as ProductId } from "#util/api.product.ts";
import { type BasicId as PromotionId } from "#util/api.promotion";
import type { ObjectReader } from "#util/common.objectReader.ts";

const content = () =>
{
    return;
}

content.getBasic = async (session: string, id: BasicId) : Promise<BasicFetch> =>
{
    const url = content.NET_URL + (id ? `/${String (id)}` : "");
    const reader = await common.getJson (session, url);
    const result =content.outputGetOrder (objectReader (reader));

    return result;
}
content.getBasicList = async (session: string) : Promise<BasicFetch []> =>
{
    const url = content.NET_URL;
    const reader = await common.getJson (session, url);
    const result = reader.requireArrayRecord ("Item").map ((x) =>
    {
        return content.outputGetOrder (objectReader (x));
    });
    return result;
}
content.updateBasic = async (session: string, data: BasicUpdate) =>
{
    const id = data.orderId;
    const url = content.NET_URL + (id ? `/${String (id)}` : "");

    await common.putJson (session, url, {
        "Delivered": data.delivered,
        "Status": data.status
    });
}

/**
 * (ฟังก์ชั่นภายใน)
*/
content.outputGetOrder = (reader: ObjectReader) : BasicFetch =>
{
    const result: BasicFetch =
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
content.NET_PREFIX = "/order";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 10000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;

export interface BasicFetch
{
    /**
     * รหัสคำสั่งซื้อ
    */
    readonly orderId: BasicId;
    /**
     * รหัสบัญชี
    */
    readonly accountId: AccountId;
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
        productId: ProductId;
        /**
         * จำนวนสินค้า
        */
        quantity: number;
    } [];
}
export interface BasicUpdate
{
    /**
     * รหัสคำสั่งซื้อ
    */
    orderId: number;
    /**
     * วันที่ได้ลูกค้ารับสินค้า
    */
    delivered ?: Date | null;
    /**
     * สถานะคำสั่งซื้อ
    */
    status ?: number;
}

/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type BasicId = number;
/**
 * ส่งออกตัวแปร
*/
export default content;