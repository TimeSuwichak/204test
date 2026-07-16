import sql          from "#core/sql.ts";
import error        from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import
{
    type DataId as DataProductId
}
from "#model/product.ts"

export interface DataFetch
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
export interface DataUpdate
{
    /**
     * รหัสสินค้า
    */
    productId: DataProductId;
    /**
     * จำนวนสินค้า
    */
    quantity ?: number | undefined;
}
/**
 * ส่วนเชื่อมต่อกับฐานข้อมูล
*/
const content = () =>
{
    return;
}
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = () =>
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
 * ดึงข้อมูลสต็อกของสินค้า
 * 
 * @param key รหัสสต็อกสินค้า
*/
content.get = (key: DataProductId) =>
{
    const cmd = `SELECT * FROM ProductStock WHERE ProductId = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }

        const reader = objectReader (x.at (0));
        const result: DataFetch =
        {
            productId: reader.requireInteger ("ProductId"),
            quantity: reader.requireInteger ("Quantity"),
        };
        return result;
    });
}
/**
 * อัพเดทข้อมูลสต็อกสินค้า
 * 
 * @param info ข้อมูลสต็อกของสินค้า
*/
content.update = (info: DataUpdate) =>
{
    const key = [
        info.quantity ? "Quantity" : undefined,
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE CategoryId = ?");

    const value = [
        info.quantity,
        info.productId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductStock SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product stock`);
        }
    });
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;