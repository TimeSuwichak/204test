import config from "#util/api.config.ts";
import reader from "#util/common.objectReader.ts";

const content = function ()
{
    return;
}

content.ERROR_UNKNOWN = 0;
content.ERROR_NETWORK = 1;
content.ERROR_JSON = 2;
content.ERROR_JSON_DATA = 3;
content.ERROR_NOT_AUTHORIZED = 4;
content.ERROR_NOT_AVAILABLE = 5;
content.ERROR_NOT_FOUND = 6;
content.ERROR_TOO_MANY_REQUEST = 7;

content.signIn = async function (input: string)
{
    let response: Response;
    let json: Record<string, unknown>;

    try
    {
        response = await config.postJson (config.AUTH_URL, "/sign-in", 
        {
            "value": input
        });
    }
    catch
    {
        return content.ERROR_NETWORK;
    }

    switch (response.status)
    {
        case 200: break;
        case 401: throw content.ERROR_NOT_AUTHORIZED;
        case 404: throw content.ERROR_NOT_FOUND;
        case 429: throw content.ERROR_TOO_MANY_REQUEST;
        case 500: throw content.ERROR_NOT_AVAILABLE;
        case 503: throw content.ERROR_NOT_AVAILABLE;
        default: throw content.ERROR_UNKNOWN;
    }

    try
    {
        json = await response.json ();
    }
    catch
    {
        return content.ERROR_JSON;
    }

    try
    {
        const data = reader (json);
        const result = {

        };
        return data;
    }
    catch
    {
        return content.ERROR_JSON_DATA;
    }

}
content.signInPwd = async function (session: string, input: string)
{
    void session;
    void input;

    return Promise.resolve ();
}
content.signInVerifyTotp = async function (session: string, input: string)
{
    void session;
    void input;

    return Promise.resolve ();
}
content.signInFinish = async function (session: string)
{
    void session;

    return Promise.resolve ();
}

content.signUp = async function (id: string, pwd: string, email: string)
{
    void id;
    void pwd;
    void email;

    return Promise.resolve ();
}
content.signUpVerifyEmail = async function (session: string, code: string)
{
    void session;
    void code;

    return Promise.resolve ();
}
content.signUpFinish = async function ()
{
    return Promise.resolve ();
}
content.signOut = async function (session: string)
{
    void session;
    
    return Promise.resolve ();
}

content.checkCompliantId = function (input: string)
{
    const lengthEmpty = input.length != 0;
    const lengthMin = input.length >= 2;
    const lengthMax = input.length <= 32;
    const all = lengthMin && lengthMax;

    return {
        lengthEmpty,
        lengthMin,
        lengthMax,
        all
    }
}
content.checkCompliantPwd = function (input: string)
{
    const lengthEmpty = input.length != 0;
    const lengthMin = input.length >= 8;
    const lengthMax = input.length <= 32;
    const all = lengthMin && lengthMax;

    return {
        lengthEmpty,
        lengthMin,
        lengthMax,
        all
    }
}
export default content;