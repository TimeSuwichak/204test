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
    /**
     * ราคาของสินค้า
    */
    price: number;
    /**
     * สกุลเงินของราคาสินค้า
    */
    priceCode: number;
    /**
     * แพลตฟอร์ม
    */
    platform: number;
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
    /**
     * แพลตฟอร์ม
    */
    platform ?: number | undefined;
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
    /**
     * แพลตฟอร์ม
    */
    platform: number;
}

/**
 * ระบบจัดการข้อมูลสินค้า
*/
const content = function ()
{
    return;
}

content.PLATFORM_NONE = 0;
content.PLATFORM_WINDOWS = 1;
content.PLATFORM_ANDROID = 2;
content.PLATFORM_LINUX = 3;
content.PLATFORM_MACOS = 4;
content.PLATFORM_IOS = 5;
content.PLATFORM_PLAYSTATION_1 = 6;
content.PLATFORM_PLAYSTATION_2 = 7;
content.PLATFORM_PLAYSTATION_3 = 8;
content.PLATFORM_PLAYSTATION_4 = 9;
content.PLATFORM_PLAYSTATION_5 = 10;
content.PLATFORM_XBOX = 11;
content.PLATFORM_XBOX_360 = 12;
content.PLATFORM_XBOX_ONE = 13;
content.PLATFORM_XBOX_ONE_S = 14;
content.PLATFORM_XBOX_ONE_X = 15;
content.PLATFORM_XBOX_SERIES_X = 16;
content.PLATFORM_XBOX_SERIES_S = 17;

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
    const cmd = `SELECT * FROM Product WHERE Id = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }
        if (!x [0]) {
            throw new error.BadData ();
        }
        return content.getByData (x [0]);
    });
}
/**
 * ดึงข้อมูลพื้นฐานของสินค้าด้วยชื่อสินค้า
 * (ข้อมูลอาจมีหลายค่า)
 * 
 * @param key ชื่อสินค้า
*/
content.getByName = (key: string) =>
{
    const cmd = `SELECT * FROM Product WHERE Name = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        return x.map ((x) =>
        {
            return content.getByData (x);
        })
    });
}
/**
 * ดึงข้อมูลพื้นฐานของสินค้าด้วยคำอธิบายสินค้า
 * (ข้อมูลอาจมีหลายค่า)
 * 
 * @param key คำอธิบาย
*/
content.getByDescription = (key: string) =>
{
    const cmd = `SELECT * FROM Product WHERE Description = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        return x.map ((x) =>
        {
            return content.getByData (x);
        })
    });
}
content.getByData = (column: Record<string, unknown>) =>
{
    const reader = objectReader (column);
    const result: DataFetch =
    {
        id: reader.requireInteger ("Id"),
        name: reader.requireString ("Name"),
        description: reader.requireString ("Description"),
        price: reader.requireFloat ("Price"),
        priceCode: reader.requireInteger ("PriceCode"),
        platform: reader.requireInteger ("Platform")
    };
    return result;
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
        info.priceCode ? "PriceCode" : undefined,
        info.platform ? "Platform" : undefined
    ]
    .filter (x => x !== undefined)
    .join (" = ?, ")
    .concat (" = ? ")
    .concat ("WHERE Id = ?");

    const value = [
        info.name,
        info.description,
        info.price,
        info.priceCode,
        info.platform,
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
            INSERT INTO Product (Name, Description, Price, PriceCode, Platform) 
            VALUES (?, ?, ?, ?, ?)`,
            [
                info.name, 
                info.description, 
                info.price, 
                info.priceCode, 
                info.platform
            ]
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