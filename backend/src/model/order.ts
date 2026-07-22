import error from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import sql from "#core/sql.ts";

import { type InputCommand, type InputValue } from "#core/sql.ts";

import { type ObjectReader } from "#core/object.reader.ts";
import { type BasicId as AccountId } from "#model/account.ts";
import { type BasicId as ProductId } from "#model/product.ts";
import { type BasicId as PromotionId } from "#model/promotion.ts";

/**
 * ระบบจัดการคำสั่งซื้อสินค้า
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
    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ
 */
content.terminate = () =>
{
    return;
}
/**
 * ทำการดึงข้อมูลคำสั่งซื้อสินค้าจากรหัสที่ได้ทำการระบุไว้
 * 
 * @param key รหัสคำสั่งซื้อสินค้า
*/
content.get = async (key: BasicId) 
    : Promise<BasicFetch> =>
{
    const query = await Promise.all ([
        sql.select (
        "SELECT * FROM OrderList WHERE OrderId = ?", 
        [key]),
        sql.select (
        "SELECT * FROM OrderItem WHERE OrderId = ?", 
        [key]),
    ]);
    const queryList = query[0];
    const queryItem = query[1];    
    
    if (queryList.length == 0) {
        throw new error.NotFound ("No entry of order");
    }

    return content.readBasic (
        objectReader (queryList [0]), queryItem.map ((x) =>
    {
        return objectReader (x);
    }));
}
/**
 * ทำการดึงข้อมูลรายการคำสั่งซื้อสินค้า
*/
content.getList = async () 
    : Promise<BasicFetch[]> =>
{
    const queryList = await sql.select ("SELECT * FROM OrderList");

    if (queryList.length === 0) {
        return [];
    }

    return await Promise.all (queryList.map ((x) =>
    {
        const id = objectReader(x).requireInteger("OrderId");

        return sql.select (
            "SELECT * FROM OrderItem WHERE OrderId = ?", [id]
        )
        .then ((y) =>
        {
            return content.readBasic (objectReader (x), y.map ((z) =>
            {
                return objectReader (z);
            }));
        });
    }))
}
/**
 * ทำการดึงข้อมูลรายการคำสั่งซื้อสินค้า
*/
content.getListByAccount = async (key: AccountId) 
    : Promise<BasicFetch[]> =>
{
    const queryList = await sql.select (
        "SELECT * FROM OrderList WHERE AccountId = ?", [key]
    );

    if (queryList.length === 0) {
        return [];
    }

    return await Promise.all (queryList.map ((x) =>
    {
        const id = objectReader(x).requireInteger("OrderId");
        return sql.select (
            "SELECT * FROM OrderItem WHERE OrderId = ?", [id]
        )
        .then ((y) =>
        {
            return content.readBasic (objectReader (x), y.map ((z) =>
            {
                return objectReader (z);
            }));
        });
    }))
}
/**
 * เปลี่ยนแปลงข้อมูลคำสั่งซื้อสินค้า 
 * คำสั่งนี้ใช้ได้ OrderList
 * 
 * @key info ข้อมูลประกอบการเปลี่ยนแปลง
*/
content.update = async (info: BasicUpdate): Promise<void> => 
{
    const fields: InputCommand [] = [];
    const values: InputValue = [];

    if (info.delivered !== undefined) {
        fields.push("`Delivered` = ?");
        values.push(info.delivered);
    }

    if (info.status !== undefined) {
        fields.push("`Status` = ?");
        values.push(info.status);
    }

    if (fields.length === 0) {
        return;
    }

    values.push(info.orderId);

    await sql.update (
        `UPDATE \`OrderList\` SET ${fields.join(", ")} WHERE \`OrderId\` = ?`,
        values
    );
};
/***
 * สร้างคำสั่งซื้อสินค้า
*/
content.create = async (info: BasicCreate): Promise<BasicId> => {
    const transaction = await sql.transaction();

    try {
        //
        // วนลูปเช็กและลดสินค้า
        //
        for (const item of info.item) {
            //
            // ดึงจำนวนสต็อกปัจจุบันของสินค้า
            //
            const stockRows = await transaction.select(
                `SELECT Quantity FROM ProductStock WHERE ProductId = ?`,
                [item.productId]
            );

            if (stockRows.length === 0) {
                throw new error.NotFound(`ไม่พบสินค้า ID ${String (item.productId)} ในระบบสต็อก`);
            }

            const reader = objectReader(stockRows[0]);
            const currentQuantity = reader.requireInteger("Quantity");
            //
            // เช็กจำนวนสินค้า
            //
            if (currentQuantity < item.quantity) {
                throw new error.BadData(
                    `สินค้า ID ${String (item.productId)} มีจำนวนไม่พอ (คงเหลือ: ${String (currentQuantity)}, ต้องการ: ${String (item.quantity)})`
                );
            }
            //
            // ลดสต็อก
            //
            const newQuantity = currentQuantity - item.quantity;
            await transaction.update(
                `UPDATE ProductStock SET Quantity = ? WHERE ProductId = ?`,
                [newQuantity, item.productId]
            );
        }
        //
        // บันทึกข้อมูลคำสั่งซื้อ
        //
        const orderId = (await transaction.insert(
            `INSERT INTO OrderList (AccountId, Created, Delivered, 
            Status, ShipName, ShipAddress, ShipPhone, ShipEmail, PaymentType, PromotionId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                info.accountId, info.created, info.delivered, info.status,
                info.shipName, info.shipAddress, info.shipPhone, info.shipEmail,
                info.paymentType, info.promotionId
            ]
        )) as BasicId;
        //
        // บันทึกรายการสินค้าในคำสั่งซื้อ
        //
        for (const item of info.item) {
            await transaction.insert(
                `INSERT INTO OrderItem (OrderId, ProductId, Quantity)
                 VALUES (?, ?, ?)`,
                [orderId, item.productId, item.quantity]
            );
        }
        //
        // ยืนยันลงฐานข้อมูล
        //
        await transaction.commit();
        return orderId;
    } catch (e) {
        //
        // ถ้ารายการล้มเหลว หรือของไม่พอ คืนค่าสต็อก และคำสั่งซื้อ
        //
        await transaction.rollback();
        throw e;
    } finally {
        transaction.release();
    }
};
/**
 * ลบคำสั่งซื้อสินค้า
*/
content.delete = async (key: BasicId) :
    Promise<void> =>
{
    const transaction = await sql.transaction ();

    try
    {
        await transaction.delete (
            "DELETE FROM OrderItem WHERE OrderId = ?",
            [key]
        );
        await transaction.delete (
            "DELETE FROM OrderList WHERE OrderId = ?",
            [key]
        );
        await transaction.commit ();
    }
    catch (e: unknown)
    {
        await transaction.rollback ();
        throw new error.NotAvailable (e);
    }
    finally
    {
        transaction.release ();
    }
}
content.readBasic = (root: ObjectReader, item: ObjectReader []) : BasicFetch =>
{
    return {
        orderId: root.requireInteger ("OrderId"),
        accountId: root.requireInteger ("AccountId"),
        created: root.requireDate ("Created"),
        delivered: root.requireDateOrNull ("Delivered"),
        status: root.requireInteger ("Status"),
        shipName: root.requireString ("ShipName"),
        shipAddress: root.requireString ("ShipAddress"),
        shipPhone: root.requireString ("ShipPhone"),
        shipEmail: root.requireString ("ShipEmail"),
        paymentType: root.requireInteger ("PaymentType"),
        promotionId: root.requireStringOrNull ("PromotionId"),
        item: item.map ((x) =>
        {
            return {
                productId: x.requireInteger ("ProductId"),
                quantity: x.requireInteger ("Quantity"),
            }
        })
    }
}

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูล
*/
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
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูล
*/
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
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูล
*/
export interface BasicCreate
{
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
     * รายการสินค้าในคำสั้งซื้อสินค้า
    */
    readonly item: {
        /**
         * รหัสสินค้า
        */
        productId: ProductId;
        /**
         * จำนวนสินค้าที่สั่งซื้อ
        */
        quantity: number;
    } [];
}
/**
 * รหัสของชุดรหัสข้อมูล
*/
export type BasicId = number;
/**
 * ส่งออกตัวแปร
*/
export default content;