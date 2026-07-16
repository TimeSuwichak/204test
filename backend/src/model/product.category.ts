import sql          from "#core/sql.ts";
import error        from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import
{
    type DataId as DataProductId
}
from "#model/product.ts";

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
     * รหัสเอกลักษณ์
    */
    categoryId: DataId;
    /**
     * รหัสสินค้า
    */
    productId: DataProductId;
    /**
     * รหัสหมวดหมู่
    */
    value: number;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface DataUpdate
{
    /**
     * รหัสเอกลักษณ์
    */
    categoryId: DataId;
    /**
     * รหัสหมวดหมู่
    */
    value ?: number | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface DataCreate
{
    /**
     * รหัสสินค้า
    */
    productId: DataProductId;
    /**
     * รหัสหมวดหมู่
    */
    value: number;
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
 * ดึงข้อมูลหมวดหมู่ของสินค้า
 * 
 * @param key รหัสความหมวดหมู่สินค้า
*/
content.get = (key: DataId) =>
{
    const cmd = `SELECT * FROM ProductCategory WHERE CategoryId = ?`;
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
            categoryId: reader.requireInteger ("CategoryId") ,
            productId: reader.requireInteger ("ProductId"),
            value: reader.requireInteger ("Value")
        };
        return result;
    });
}
/**
 * อัพเดทหมวดหมู่สินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.update = (info: DataUpdate) =>
{
    const key = [
        info.value ? "Value" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE CategoryId = ?");

    const value = [
        info.value,
        info.categoryId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductCategory SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product category`);
        }
    });
}
/**
 * สร้างข้อมูลหมวดหมู่ของสินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.create = (info: DataCreate) =>
{
    return sql.insert (`
        INSERT INTO ProductCategory (ProductId, Value)
        VALUES (?, ?)`,
        [info.productId, info.value]
    ) as Promise<DataId>;
}
/**
 * ลบข้อมูลหมวดหมู่ของสินค้า
 * 
 * @key รหัสหมวดหมู่
*/
content.delete = (key: DataId) =>
{
    return sql.delete (`
        DELETE FROM ProductCategory 
        WHERE CategoryId = ?`,
        [key]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product category`);
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