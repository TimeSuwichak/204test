import sql from "#core/sql.ts";

const content = function ()
{
    return;
}
content.signIn = async function (username: string, password: string)
{
    const sqlCmd = "SELECT * FROM identifier WHERE username = ? AND password = ?";
    const sqlParam = [username, password];
    const sqlResult = await sql.select (sqlCmd, sqlParam);

    if (sqlResult.length == 0)
    {
        return;
    }
}

Object.freeze (content);
export default content;