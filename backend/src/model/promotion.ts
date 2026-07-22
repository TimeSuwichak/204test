import sql              from "#core/sql.ts";
import error            from "#core/error.ts";
import objectReader     from "#core/object.reader.ts";

import { type InputCommand } from "#core/sql.ts";

/**
 * ระบบจัดการข้อมูลโปรโมชั่น
*/
const content = () =>
{
    return;
}

content.init = () =>
{
    return Promise.resolve ();
}

content.terminate = () =>
{
    return;
}

/**
 * ดึงข้อมูลโปรโมชั่นตามรหัส
 * 
 * @param key รหัสโปรโมชั่น
*/
content.getBasic = async (key: BasicId) =>
{
    const cmd = `SELECT * FROM Promotion WHERE Id = ?`;
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
        return content.readBasic (x [0]);
    });
}

/**
 * ดึงข้อมูลรายการโปรโมชั่นทั้งหมด
*/
content.getBasicList = async () =>
{
    const cmd: InputCommand = `SELECT * FROM Promotion ORDER BY Id DESC`;
    const query = await sql.select (cmd, []);

    const item: BasicFetch [] = query.map ((x) =>
    {
        return content.readBasic (x);
    }); 
    return item;
}

/**
 * อัปเดตข้อมูลโปรโมชั่น
 * 
 * @param info ข้อมูลโปรโมชั่นที่ต้องการแก้ไข
*/
content.updateBasic = (info: BasicUpdate) =>
{
    const key = [
        (info.expire !== undefined) ? "Expire = ?" : undefined,
        (info.type !== undefined) ? "Type = ?" : undefined,
        (info.discount !== undefined) ? "Discount = ?" : undefined,
        (info.minPrice !== undefined) ? "MinPrice = ?" : undefined,
        (info.maxDiscount !== undefined) ? "MaxDiscount = ?" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat (" ")
    .concat ("WHERE Id = ?");

    const value = [
        info.expire ? new Date (info.expire) : undefined,
        info.type,
        info.discount,
        info.minPrice,
        info.maxDiscount,
        info.id
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE Promotion SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of promotion`);
        }
    });
}

/**
 * สร้างโปรโมชั่นใหม่
 * 
 * @param info ข้อมูลที่ใช้สร้างโปรโมชั่น
*/
content.create = (info: BasicCreate) =>
{
    return sql.insert (`
        INSERT INTO Promotion (Id,Expire, Type, Discount, MinPrice, MaxDiscount)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            info.id,
            new Date (info.expire),
            info.type,
            info.discount,
            info.minPrice,
            info.maxDiscount
        ]
    ) as Promise<BasicId>;
}

/**
 * ลบข้อมูลโปรโมชั่น
 * 
 * @param key รหัสโปรโมชั่น
*/
content.delete = (key: BasicId) =>
{
    return sql.delete (`
        DELETE FROM Promotion 
        WHERE Id = ?`,
        [key]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of promotion`);
        }
    });
}

content.readBasic = (column: Record<string, unknown>) =>
{
    const reader = objectReader (column);
    const result: BasicFetch =
    {
        id: reader.requireString ("Id"),
        created: reader.requireDate ("Created"),
        expire: reader.requireDate ("Expire"),
        type: reader.requireInteger ("Type"),
        discount: reader.requireInteger ("Discount"),
        minPrice: reader.requireFloat ("MinPrice"),
        maxDiscount: reader.requireFloat ("MaxDiscount")
    };
    return result;
}

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface BasicFetch
{
    id: BasicId;
    created: Date;
    expire: Date;
    type: number;
    discount: number;
    minPrice: number;
    maxDiscount: number;
}

/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface BasicUpdate
{
    id: BasicId;
    expire ?: Date | undefined;
    type ?: number | undefined;
    discount ?: number | undefined;
    minPrice ?: number | undefined;
    maxDiscount ?: number | undefined;
}

/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface BasicCreate
{
    id: BasicId;
    expire: Date;
    type: number;
    discount: number;
    minPrice: number;
    maxDiscount: number;
}

/**
 * รหัสประจำตัวโปรโมชั่น (PRIMARY KEY)
*/
export type BasicId = string;

export default content;