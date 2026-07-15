import sql from "#core/sql.ts";

export type AccountId = number;
export type AccountRole = number;

export interface CreateAccount
{
    name: string;
    role: number;
}

const content = function ()
{
    return;
}
/**
 * บทบาทบัญชี: ผู้ใช้
*/
content.ROLE_USER = 1;
/**
 * บทบาทบัญชี: ผู้ดูแล
*/
content.ROLE_STAFF = 2;
/**
 * บทบาทบัญชี:ผู้ดูแลระบบ
*/
content.ROLE_MANAGER = 3;
/**
 * บทบาทบัญชี:ผู้พัฒนาระบบ
*/
content.ROLE_DEVELOPER = 4;
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
content.terminate = async () =>
{
    return Promise.resolve ();
}
content.getRole = () =>
{
    return [
        content.ROLE_USER,
        content.ROLE_STAFF,
        content.ROLE_MANAGER,
        content.ROLE_DEVELOPER
    ];
}
content.getBasic = () =>
{
    return;
}
content.getContact = () =>
{
    return;
}
content.putBasic = () =>
{
    return;
}
content.putContact = () =>
{
    return;
}
content.create = async (info: CreateAccount) : Promise<AccountId> =>
{
    const ctx = await sql.transaction ();

    try
    {
        const id = await ctx.insert (`
            INSERT INTO User (Name, Role)
            VALUES (?, ?)`,
            [info.name, info.role]
        ) as AccountId;
        await ctx.insert (`
            INSERT INTO UserContact (Id)
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
content.delete = () =>
{
    return;
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;