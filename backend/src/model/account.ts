import sql                          from "#core/sql.ts";
import error                        from "#core/error.ts";
import objectReader                 from "#core/object.reader.ts";
import { type ObjectReader }        from "#core/object.reader.ts";
import { type BasicId as ProductId } from "#model/product.ts";

/**
 * ส่วนเชื่อมต่อกับฐานข้อมูล
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
 * ดึงข้อมูลบัญชีดังกล่าว
 * 
 * @param key รหัสบัญชีผู้ใช้งาน
*/
content.getBasic = (key: BasicId) : Promise<BasicFetch> =>
{
    const cmd = `SELECT * FROM Account WHERE Id = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length === 0) { 
            throw new error.NotFound (`ไม่พบข้อมูลบัญชี: ${String (key)}`); 
        }
        return content.readBasic (objectReader (x [0]));
    });
}
/**
 * ดึงรายการข้อมูลบัญชีทั้งหมดในระบบ
*/
content.getBasicList = () : Promise<BasicFetch []> =>
{
    return sql.select (`SELECT * FROM Account`).then ((x) =>
    {
        return x.map ((x) =>
        {
            return content.readBasic (objectReader (x));
        });
    });
}
content.getCart = async (key: CartId) 
    : Promise<CartFetch> =>
{
    const cmd = `SELECT * FROM AccountCart WHERE Item = ?`;
    const param = [key];
    const query = await sql.select (cmd, param);

    if (query.length === 0) {
        throw new error.NotFound (`ไม่พบข้อมูลตะกร้า: ${String (key)}`);
    }
    return content.readCart (objectReader (query [0]));
}
content.getCartByAccount = async (key: BasicId) 
    : Promise<CartFetch[]> =>
{
    const cmd = `SELECT * FROM AccountCart WHERE AccountId = ?`;
    const param = [key];
    const query = await sql.select (cmd, param);

    return query.map ((x) =>
    {
        return content.readCart (objectReader (x));
    });
}

/**
 * แก้ไขข้อมูลบัญชีดังกล่าว
 * 
 * @param info ข้อมูลที่ต้องการแก้ไข
 */
content.updateBasic = (info: BasicUpdate) : Promise<void> =>
{
    const cmd = 
    [
        info.name ? "Name" : undefined,
        info.role ? "Role" : undefined,
        info.icon ? "Icon" : undefined,
    ]
    .filter (x => x !== undefined)
    .join (" = ?, ")
    .concat (" = ? ")
    .concat ("WHERE Id = ?");

    const param = 
    [
        info.name,
        info.role,
        info.icon,
        info.id
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE Account SET ${cmd}`, param).then ((x) =>
    {
        if (x === 0) { 
            throw new error.NotFound (`ไม่พบข้อมูลบัญชี: ${String (info.id)}`); 
        }
    });
}
content.updateCart = async (info: CartUpdate)
    : Promise<void> =>
{
    const key = 
    [
        info.quantity ? "Quantity" : undefined,
    ]
    .filter (x => x !== undefined)
    .join (" = ?, ")
    .concat (" = ? ")
    .concat ("WHERE ItemId = ? AND AccountId = ?");

    const value = 
    [
        info.quantity,
        info.itemId,
        info.accountId
    ]
    .filter (x => x !== undefined);

    const result = await sql.update (`UPDATE AccountCart SET ${key}`, value);

    if (result === 0) 
    {
        throw new error.NotFound (`ไม่พบข้อมูลตะกร้า: ${String (info.itemId)}`);
    }
}

/**
 * สร้างบัญชีใหม่ขึ้นมาในระบบ 
 * คำสั่งนี้จะไม่สร้างวิธีลงชื่อเข้าใช้งานระบบคุณจะต้องสร้างมันโดยตนเอง
*/
content.create = async (info: BasicCreate) : Promise<BasicId> =>
{
    const ctx = await sql.transaction ();

    try
    {
        const id = await ctx.insert (`
            INSERT INTO Account (Name, Role, Icon)
            VALUES (?, ?, ?)`,
            [info.name, info.role, info.icon]
        ) as BasicId;
        await ctx.insert (`
            INSERT INTO AccountContact (Id)
            VALUES (?)`,
            [id]
        );
        await ctx.commit ();
        return id;
    }
    catch (e)
    {
        await ctx.rollback ();
        throw e;
    }
    finally
    {
        ctx.release ();
    }
}
content.createCart = (info: CartCreate) 
    : Promise<CartId> =>
{
    return sql.insert (`
        INSERT INTO AccountCart (AccountId, ProductId, Quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + ?`,
        [
            info.accountId, info.productId, info.quantity, info.quantity
        ]
    ) as Promise<CartId>;
}

/**
 * ลบบัญชีดังกล่าวออกจากระบบ 
 * กระบวนการนี้จะไม่สามารถทำงานได้ถ้าข้อมูลที่กล่าวถึงบัญชี
*/
content.delete = (key: BasicId) =>
{
    return sql.delete (`
        DELETE FROM Account 
        WHERE Id = ?`,
        [key]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of account`);
        }
    });
}
content.deleteCart = (itemId: CartId, accountId: BasicId) =>
{
    return sql.delete (`
        DELETE FROM AccountCart 
        WHERE ItemId = ? AND AccountId = ?`,
        [itemId, accountId]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`ไม่พบข้อมูลตะกร้า: ${String (itemId)}`);
        }
    });
}

content.readBasic = (reader: ObjectReader) : BasicFetch =>
{
    return {
        id: reader.requireInteger ("Id"),
        name: reader.requireString ("Name"),
        icon: reader.requireString ("Icon"),
        role: reader.requireInteger ("Role"),
        created: reader.requireDate ("Created"),
        modified: reader.requireDateOrNull ("Modified")
    }
}
content.readCart = (reader: ObjectReader) : CartFetch =>
{
    return {
        itemId: reader.requireInteger ("ItemId"),
        accountId: reader.requireInteger ("AccountId"),
        productId: reader.requireInteger ("ProductId"),
        quantity: reader.requireInteger ("Quantity")
    }
}

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
 * การจำกัดเข้าบัญชี: ไม่มีการจำกัดการเข้าถึงใด ๆ
*/
content.RESTRICTION_NONE = 0;
/**
 * การจำกัดเข้าบัญชี: บัญชีถูกระงับโดยระบบหรือผู้ดูแลระบบ
*/
content.RESTRICTION_SUSPENDED = 1;
/**
 * รากยารการจำกัดวิธีการเข้าถึงบัญชี
*/
content.RESTRICTION_LIST = 
[
    content.RESTRICTION_NONE,
    content.RESTRICTION_SUSPENDED
];

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface BasicFetch
{
    /**
     * รหัสบัญชี
    */
    readonly id: BasicId;
    /**
     * ชื่อผู้ใช้
    */
    readonly name: string;
    /**
     * ไอคอนของผู้ใช้
    */
    readonly icon: string;
    /**
     * บทบาทของผู้ใช้
    */
    readonly role: number;
    /**
     * วันที่สร้างบัญชี
    */
    readonly created: Date;
    /**
     * วันที่ปรับเปลี่ยนข้อมูลบัญชี
    */
    readonly modified: Date | null; 
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface BasicUpdate
{
    id: BasicId;
    /**
     * ชื่อผู้ใช้
    */
    name ?: string | undefined;
    /**
     * บทบาทของผู้ใช้
    */
    role ?: number | undefined;
    /**
     * รูปบัญชี
    */
    icon ?: string | undefined;
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
    icon: string;
}

export interface CartFetch
{
    itemId: CartId;
    accountId: BasicId;
    productId: ProductId;
    quantity: number;
}
export interface CartUpdate
{
    itemId: CartId;
    accountId: BasicId;
    quantity ?: number | undefined;
}
export interface CartCreate
{
    accountId: BasicId;
    productId: ProductId;
    quantity: number;
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
