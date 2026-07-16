import sql          from "#core/sql.ts";
import error        from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import
{
    type DataId as DataProductId
}
from "#model/product.ts";
import
{
    type DataId as DataAccountId
}
from "#model/account.ts"

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
    commentId: DataId;
    /**
     * รหัสสินค้า
    */
    productId: DataProductId;
    /**
     * รหัสบัญชีของผู้เขียน
    */
    author: DataAccountId;
    /**
     * หัวเรื่อง
    */
    title: string;
    /**
     * ข้อความ
    */
    text: string;
    /**
     * คะแนน
    */
    rating: number;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface DataUpdate
{
    /**
     * รหัสเอกลักษณ์
    */
    commentId: DataId;
    /**
     * หัวเรื่อง
    */
    title ?: string | undefined;
    /**
     * ข้อความ
    */
    text ?: string | undefined;
    /**
     * คะแนน
    */
    rating ?: number | undefined;
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
     * รหัสบัญชีของผู้เขียน
    */
    author: DataAccountId;
    /**
     * หัวเรื่อง
    */
    title: string;
    /**
     * ข้อความ
    */
    text: string;
    /**
     * คะแนน
    */
    rating: number;
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
 * ดึงข้อมูลความคิดเห็นของสินค้า
 * 
 * @param key รหัสความคิดเห็นสินค้า
*/
content.get = (key: DataId) =>
{
    const cmd = `SELECT * FROM ProductComment WHERE CommentId = ?`;
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
            commentId: reader.requireInteger ("CommentId") ,
            productId: reader.requireInteger ("ProductId"),
            author: reader.requireInteger ("Author"),
            title: reader.requireString ("Title"),
            text: reader.requireString ("Text"),
            rating: reader.requireInteger ("Rating"),
        };
        return result;
    });
}
/**
 * แก้ไขข้อมูลความคิดเห็นของสินค้า
 * 
 * @param info ข้อมูลที่ต้องการแก้ไข
 */
content.update = (info: DataUpdate) =>
{
    const key = [
        info.title ? "Title" : undefined,
        info.text ? "Text" : undefined,
        info.rating ? "Rating" : undefined
    ]
    .filter (x => x !== undefined)
    .join (" = ?, ")
    .concat (" = ? ")
    .concat ("WHERE CategoryId = ?");

    const value = [
        info.title,
        info.title,
        info.text,
        info.rating,
        info.commentId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductComment SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product comment`);
        }
    });
}
/**
 * สร้างข้อมูลความคิดเห็นของสินค้า
 * 
 * @param info ข้อมูลความคิดเห็นของสินค้า
*/
content.create = (info: DataCreate) =>
{
    return sql.insert (`
        INSERT INTO ProductComment (ProductId, Author, Title, Text, Rating)
        VALUES (?, ?, ?, ?, ?)`,
        [
            info.productId,
            info.author,
            info.title,
            info.text,
            info.rating
        ]
    ) as Promise<DataId>;
}
/**
 * ลบข้อมูลความคิดเห็นของสินค้า
 * 
 * @param key รหัสความคิดเห็นสินค้า
*/
content.delete = (key: DataId) =>
{
    return sql.delete (`
        DELETE FROM ProductComment 
        WHERE CommentId = ?`,
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