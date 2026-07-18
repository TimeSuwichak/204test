import error from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import sql from "#core/sql.ts";

import { type DataId as DataAccountId } from "./account.ts";
import { type DataId as DataProductId } from "#model/product.ts";

/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/

export type DataId = number;
/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface DataFetch
{
    /**
     * รหัสคำสั่งซื้อ
    */
    readonly orderId: DataId;
    /**
     * รหัสบัญชี
    */
    readonly accountId: DataAccountId;
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
     * รายการสินค้า
    */
    readonly item: DataFetchItem [];
}
export interface DataFetchItem
{
    /**
     * รหัสสินค้า
    */
    productId: DataProductId;
    /**
     * จำนวนสินค้า
    */
    quantity: number;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface DataUpdate
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
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface DataCreate
{
    /**
     * รหัสบัญชี
    */
    readonly accountId: DataAccountId;
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
     * รายการสินค้าในคำสั้งซื้อสินค้า
    */
    readonly item: DataCreateItem [];
}
/**
 * รายการสินค้าที่มีในคำสั่งซื้อดังกล่าว
*/
export interface DataCreateItem
{
    /**
     * รหัสสินค้า
    */
    productId: DataProductId;
    /**
     * จำนวนสินค้าที่สั่งซื้อ
    */
    quantity: number;
}

/**
 * ระบบจัดการคำสั่งซื้อสินค้า
*/
const content = () =>
{
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
content.get = async (key: DataId) 
    : Promise<DataFetch> =>
{
    const transaction = await sql.transaction ();
    let query;

    try
    {
        query = await Promise.all ([
            transaction.select (
            "SELECT * FROM OrderList WHERE OrderId = ?", 
            [key]),
            transaction.select (
            "SELECT * FROM OrderItem WHERE OrderId = ?", 
            [key]),
        ]);
        await transaction.commit ();
    }
    catch (e: unknown)
    {
        await transaction.rollback ();

        throw new error.NotAvailable (
            "Unexpected error during SQL transaction", { cause: e }
        );
    }
    finally
    {
        transaction.release ();
    }

    let orderId: DataId;
    let accountId: DataAccountId;
    let created: Date;
    let delivered: Date | null;
    let status: number;
    const item: DataFetchItem [] = [];

    try
    {
        const reader = objectReader (query[0].at (0));

        orderId = reader.requireInteger ("OrderId");
        accountId = reader.requireInteger ("AccountId");
        created = reader.requireDate ("Created");
        delivered = reader.requireDateOrNull ("Delivered");
        status = reader.requireInteger ("Status");
    }
    catch (e: unknown)
    {
        throw new error.BadData (
            "Unexpected SQL table layout (section 1)", { cause: e })
    }
    try
    {
        for (const entry of query[1])
        {
            const reader = objectReader (entry);
            const content: DataFetchItem =
            {
                productId: reader.requireInteger ("ProductId"),
                quantity: reader.requireInteger ("Quantity")
            };
            item.push (content);
        }
    }
    catch (e: unknown)
    {
        throw new error.BadData (
            "Unexpected SQL table layout (section 2)", { cause: e })
    }

    return {
        orderId: orderId,
        accountId: accountId,
        created: created,
        delivered: delivered,
        status: status,
        item: item
    };
}
/**
 * เปลี่ยนแปลงข้อมูลคำสั่งซื้อสินค้า 
 * คำสั่งนี้ใช้ได้แค่กับคำสั่งซื้อสินค้า (OrderList) เท่านั้น
 * 
 * @key info ข้อมูลประกอบการเปลี่ยนแปลง
*/
content.update = async (info: DataUpdate) :
    Promise<void> =>
{
    const key = [
        info.delivered ? "Delivered" : undefined,
        info.status ? "Status" : undefined
    ]
    .filter (x => x !== undefined)
    .join (" = ?, ")
    .concat (" = ? ")
    .concat ("WHERE Id = ?");

    const value = [
        info.delivered,
        info.status,
        info.orderId
    ]
    .filter (x => x !== undefined);

    await sql.update (`UPDATE Product SET ${key}`, value);
    return;
}
/***
 * สร้างคำสั่งซื้อสินค้า
*/
content.create = async (info: DataCreate) :
    Promise<DataId> =>
{
    const transaction = await sql.transaction ();

    try
    {
        const orderId = await transaction.insert (`
            INSERT INTO OrderList (AccountId, Created, Delivered Status)
            VALUES (?, ?, ?, ?)`,
            [info.accountId, info.created, info.delivered, info.status]
        );
        const itemCmd = info.item.map (() =>
        {
            return `(?, ?, ?)`;
        });
        const itemValue = info.item.flatMap ((x) =>
        {
            return [x.productId, x.quantity];
        });

        await transaction.insert (`
            INSERT INTO OrderItem (OrderId, ProductId, Quantity)
            VALUES ${itemCmd.join (", ")};`, itemValue);

        await transaction.commit ();
        return orderId as DataProductId;
    }
    catch (e: unknown)
    {
        await transaction.rollback ();
        throw new error.NotAvailable (
            "Unexpected error during SQL transaction", { cause: e}
        );
    }
    finally
    {
        transaction.release ();
    }
}
/**
 * ลบคำสั่งซื้อสินค้าถ้าเป็นไปได้
*/
content.delete = async (key: DataId) :
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
        throw new error.NotAvailable (
            "Unexpected error during SQL transaction", { cause: e}
        );
    }
    finally
    {
        transaction.release ();
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