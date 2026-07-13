import jwt          from "jsonwebtoken";
import error        from "#core/error.ts";
import sql          from "#core/sql.ts";
import objreader    from "#core/objectReader.ts";
import
{
    type Jwt
}
from "jsonwebtoken"


interface SignInChallenge
{
    id: string;
    link: number;
    session: string;
    sessionIssued: Date;
    sessionExpire: Date;
    restriction: number;
}

const content = function ()
{
    return;
}
content.init = async function ()
{
    return Promise.resolve ();
}
content.terminate = async function ()
{
    return Promise.resolve ();
}
content.jwtSecret = "WebProject";
content.jwtSign = async function (data: object, exp: number) : Promise<string>
{
    return new Promise ((resolve, reject) =>
    {
        jwt.sign (data, content.jwtSecret,
        {
            allowInsecureKeySizes: false,
            allowInvalidAsymmetricKeyTypes: false,
            expiresIn: exp
        },
        (err, encoded) =>
        {
            if (err || !encoded)
            {
                reject (error.NOT_AVAILABLE);
                return;
            }
            resolve (encoded);
        });
    });
}
content.jwtVerify = async function (input: string) : Promise<Jwt>
{
    return new Promise ((resolve, reject) =>
    {
        jwt.verify (input, content.jwtSecret, {
            allowInvalidAsymmetricKeyTypes: false,
            complete: true,
            ignoreNotBefore: true,
            ignoreExpiration: true,
        },
        (err, decoded) =>
        {
            if (err || !decoded)
            {
                reject (error.NOT_AVAILABLE);
                return;
            }
            resolve (decoded);
        });
    });
}
content.signIn = async function (identifier: string) : Promise<SignInChallenge>
{
    const cmd = `SELECT link FROM auth WHERE id = ?`;
    const param = [identifier];
    const result = await sql.select (cmd, param);

    if (result.length == 0) {
        throw error.NOT_FOUND;
    }
    if (result.length >= 2) {
        throw error.CONFLICT;
    }
    const session = await content.jwtSign ({}, 300000);
    const sessionIssued = new Date (Date.now ());
    const sessionExpire = new Date (Date.now () + 300000);
    const reader = objreader (result.at (0));
    const output: SignInChallenge =
    {
        id: identifier,
        link: reader.requireInteger ("link"),
        session: session,
        sessionIssued: sessionIssued,
        sessionExpire: sessionExpire,
        restriction: 0,
    };
    return output;
}
content.getLink = async function (username: string, password: string)
{
    const cmd = 
        "SELECT link FROM identifier WHERE username = ? AND password = ?";
    const param = [username, password];
    const result = await sql.select (cmd, param);

    if (result.length == 0)
    {
        return;
    }
}


Object.freeze (content);
export default content;