import sql          from "#core/sql.ts";
import error        from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
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
     * รหัสสินค้า
    */
    id: DataId;
    /**
     * ชื่อสินค้า
    */
    name: string;
    /**
     * คำอธิบายสินค้า
    */
    description: string;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface DataUpdate
{
    /**
     * รหัสสินค้า
    */
    id: DataId;
    /**
     * ชื่อสินค้า
    */
    name ?: string | undefined;
    /**
     * คำอธิบายสินค้า
    */
    description ?: string | undefined;
    /**
     * ราคา
    */
    price ?: number | undefined;
    /**
     * รหัสสกุลเงิน
    */
    priceCode ?: number | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface DataCreate
{
    /**
     * ชื่อสินค้า
    */
    name: string;
    /**
     * คำอธิบายสินค้า
    */
    description: string;
    /**
     * ราคา
    */
    price: number;
    /**
     * รหัสสกุลเงิน
    */
    priceCode: number;
}

/**
 * ระบบจัดการข้อมูลสินค้า
*/
const content = function ()
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
 * ดึงข้อมูลพื้นฐานของสินค้า
 * 
 * @param key รหัสสินค้า
*/
content.get = async (key: DataId) =>
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
            id: reader.requireInteger ("Id"),
            name: reader.requireString ("Name"),
            description: reader.requireString ("Description"),
        };
        return result;
    });
}
/**
 * แก้ไขข้อมูลพื้นฐานของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param info ข้อมูลที่ต้องการแก้ไข
*/
content.update = async (info: DataUpdate) : Promise<number> =>
{
    const key = [
        info.name ? "Name" : undefined,
        info.description ? "Description" : undefined,
        info.price ? "Price" : undefined,
        info.priceCode ? "PriceCode" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE Id = ?");

    const value = [
        info.name,
        info.description,
        info.price,
        info.priceCode,
        info.id
    ]
    .filter (x => x !== undefined);

    return await sql.update (`UPDATE Product SET ${key}`, value);
}
/**
 * สร้างข้อมูลสินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.create = async (info: DataCreate) : Promise<DataId> =>
{
    const transaction = await sql.transaction ();

    try
    {
        const id = await transaction.insert (`
            INSERT INTO Product (Name, Description, Price, PriceCode) 
            VALUES (?, ?, ?, ?)`,
            [info.name, info.description, info.price, info.priceCode]
        ) as DataId;

        await transaction.insert (`
            INSERT INTO ProductStock (ProductId, Quantity)
            VALUES (?, ?)`,
            [id, 0]
        );

        await transaction.commit ();
        return id;
    }
    catch (e)
    {
        await transaction.rollback ();
        throw e;
    }
    finally
    {
        transaction.release ();
    }
}
/**
 * ลบข้อมูลพื้นฐานของสินค้า
 * 
 * @param id รหัสสินค้า
 */
content.delete = async (id: DataId) : Promise<void> =>
{
    const transaction = await sql.transaction ();
    
    try
    {
        await transaction.delete (`
            DELETE FROM ProductCategory 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM ProductReview 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM ProductComment 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM ProductStock 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM Product 
            WHERE Id = ?`,
            [id]
        );

        await transaction.commit ();
    }
    catch (e)
    {
        await transaction.rollback ();
        throw e;
    }
    finally
    {
        transaction.release ();
    }
};

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;