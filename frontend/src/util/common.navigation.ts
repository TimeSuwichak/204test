import type { NavigateFunction } from "react-router";

let router: NavigateFunction = function ()
{
    return;
}
const content = function ()
{
    return;
}
content.PATH_INDEX = "/";
content.PATH_ABOUT = "/about";
content.PATH_ADMIN = "/admin";
content.PATH_AUTH = "/auth";
content.PATH_CONSOLE = "/console";
content.PATH_DOC = "/doc";
content.PATH_PRODUCT = "/product";
content.PATH_PRODUCT_BROWSER = "/product-browser";
content.PATH_ORDER = "/order";
content.PATH_SETTINGS = "/settings";

content.init = function (navigator: NavigateFunction)
{
    router = navigator;
    return;
}
content.terminate = function ()
{
    router = function () { return; };
    return;
}
content.toIndex = () =>
{
    return router (content.PATH_INDEX);
}
content.toAbout = () =>
{
    return router (content.PATH_ABOUT);
}
content.toAuth = (option ?: 
{
    redirectSignIn ?: string;
    redirectSignUp ?: string;
    reason ?: number;
    replace ?: boolean;
}) =>
{
    function encodeContext(value: string) 
    {
        const utf8Bytes = new TextEncoder().encode(value);
        const binaryString = String.fromCharCode(...utf8Bytes);

        return btoa(binaryString);
    }

    const param = new URLSearchParams ();
    const context = {
        "RedirectSignedIn": option ? option.redirectSignIn : undefined,
        "RedirectSignedUp": option ? option.redirectSignUp : undefined,
        "Reason": option ? option.reason : undefined,
    }
    param.append ("context", encodeContext (JSON.stringify (context)));

    const paramOut = param.toString ();
    const paramFormatted = paramOut.length !== 0 ? `?${paramOut}` : ``;

    return router (content.PATH_AUTH + paramFormatted, {
        replace: option ? option.replace : false
    });
}
content.toAdmin = () =>
{
    return router (content.PATH_ADMIN);
}
content.toConsole = () =>
{
    return router (content.PATH_CONSOLE);
}
content.toDoc = () =>
{
    location.href = content.PATH_DOC;
}
content.toProduct = (id: number) =>
{
    return router (content.PATH_PRODUCT + `?id=${String (id)}`);
}
content.toProductBrowser = (search ?: string) =>
{
    const param = new URLSearchParams ();

    if (search) {
        param.append ("search", search);
    }
    const paramOut = param.toString ();
    const paramFormatted = paramOut.length !== 0 ? `?${paramOut}` : ``;

    return router (content.PATH_PRODUCT_BROWSER + paramFormatted);
}
content.toOrder = () =>
{
    return router (content.PATH_ORDER);
}
content.toSettings = () =>
{
    return router (content.PATH_SETTINGS);
}
export default content;