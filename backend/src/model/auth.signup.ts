import bcrypt       from "bcrypt";
import sql          from "#core/sql.ts";
import error        from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import { type DataId as DataAuthId } from "#model/auth.ts";
import { type DataIdFb as DataAuthIdFb } from "#model/auth.ts";
import { type DataId as DataAccountId } from "#model/account.ts"

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลการลงชื่อเข้าใช้จากฐานข้อมูล
*/
export interface DataFetch
{
    id: DataAuthId;
    password: string;
    link: DataAccountId;
}
/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลการลงชื่อเข้าใช้จากฐานข้อมูล
*/
export interface DataFetchFb
{
    id: DataAuthIdFb;
    link: DataAccountId;
}
/**
 * ระบบจัดการวิธีการสร้างบัญชีใหม่
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
 * รับข้อมูลการลงชื่อเข้าใช้งานระบบ
*/
content.get = async (id: DataAuthId) =>
{
    const cmd = "SELECT Id, Password, Link FROM Auth WHERE Id = ?";
    const param = [id];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length === 0)
        {
            throw new error.NotFound ();
        }
        if (x.length !== 1)
        {
            throw new error.Conflict ();
        }
        const reader = objectReader (x.at (0));
        const result: DataFetch =
        {
            id: reader.requireString ("Id"),
            password: reader.requireString ("Password"),
            link: reader.requireInteger ("Link"),
        };
        return result;
    });
}
/**
 * รับข้อมูลการลงชื่อเข้าใช้งานระบบด้วย Facebook
*/
content.getFacebook = async (id: DataAuthIdFb) =>
{
    const cmd = "SELECT Id, Link FROM AuthFacebook WHERE Id = ?";
    const param = [id];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length === 0)
        {
            throw new error.NotFound ();
        }
        if (x.length !== 1)
        {
            throw new error.Conflict ();
        }
        const reader = objectReader (x.at (0));
        const result: DataFetchFb =
        {
            id: reader.requireInteger ("Id"),
            link: reader.requireInteger ("Link"),
        };
        return result;
    });
}
/**
 * สร้างวิธีการลงชื่อเข้าใช้งานระบบด้วย: รหัสประจำตัวและรหัสผ่าน
*/
content.create = async (id: DataAuthId, pwd: string, link: DataAccountId) =>
{
    const hashPwd = await bcrypt.hash (pwd, 16);

    const cmd = "INSERT INTO Auth (Id, Password, Link) VALUES (?, ?, ?)";
    const param = [id, hashPwd, link];

    await sql.insert (cmd, param);
    return id;
}
/**
 * สร้างวิธีการลงชื่อเข้าใช้งานระบบด้วย: Facebook
*/
content.createFacebook = async (id: DataAuthIdFb, link: DataAccountId) =>
{
    const cmd = "INSERT INTO AuthFacebook (Id, Link) VALUES (?, ?)";
    const param = [id, link];

    await sql.insert (cmd, param);
    return id;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;