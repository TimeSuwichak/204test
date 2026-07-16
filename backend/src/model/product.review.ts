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
    reviewId: DataId;
    /**
     * รหัสสินค้า
    */
    productId: DataProductId;
    /**
     * รหัส MIME
    */
    mime: string;
    /**
     * ลิงค์ที่อยู่ของทรัพยากร
    */
    link: string;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface DataUpdate
{
    /**
     * รหัสเอกลักษณ์
    */
    reviewId: DataId;
    /**
     * รหัส MIME
    */
    mime ?: string;
    /**
     * ลิงค์ที่อยู่ของทรัพยากร
    */
    link ?: string;
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
     * รหัส MIME
    */
    mime: string;
    /**
     * ลิงค์ที่อยู่ของทรัพยากร
    */
    link: string;
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
 * ดึงข้อมูลรีวิวของสินค้า
 * 
 * @param key รหัสความหมวดหมู่สินค้า
*/
content.get = (key: DataId) =>
{
    const cmd = `SELECT * FROM ProductReview WHERE ReviewId = ?`;
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
            reviewId: reader.requireInteger ("ReviewId") ,
            productId: reader.requireInteger ("ProductId"),
            mime: reader.requireString ("Mime"),
            link: reader.requireString ("Link")
        };
        return result;
    });
}
/**
 * อัพเดทข้อมูลการรีวิวสินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.update = (info: DataUpdate) =>
{
    const key = [
        info.mime ? "Mime" : undefined,
        info.link ? "Link" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE CategoryId = ?");

    const value = [
        info.mime,
        info.link,
        info.reviewId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductReview SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product review`);
        }
    });
}
/**
 * สร้างข้อมูลการรีวิวของสินค้า
 * 
 * @param info ข้อมูลความคิดเห็นของสินค้า
*/
content.create = (info: DataCreate) =>
{
    return sql.insert (`
        INSERT INTO ProductReview (ProductId, Mime, Link)
        VALUES (?, ?, ?)`,
        [
            info.productId,
            info.mime,
            info.link
        ]
    ) as Promise<DataId>;
}
/**
 * ลบข้อมูลการรีวิวของสินค้า
 * 
 * @key รหัสหมวดหมู่
*/
content.delete = (key: DataId) =>
{
    return sql.delete (`
        DELETE FROM ProductReview 
        WHERE ProductReview = ?`,
        [key]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product review`);
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