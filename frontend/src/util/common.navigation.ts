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
content.PATH_AUTH = "/auth";
content.PATH_CONSOLE = "/console";
content.PATH_DOC = "/doc";
content.PATH_PRODUCT = "/product";
content.PATH_PRODUCT_BROWSER = "/product-browser";
content.PATH_ORDER = "/order";
content.PATH_SETTINGS = "/settings";
content.PATH_CART = "/cart";

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
content.toAuth = () =>
{
    return router (content.PATH_AUTH);
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
content.toCart = () =>
{
    return router (content.PATH_CART);
}
export default content;