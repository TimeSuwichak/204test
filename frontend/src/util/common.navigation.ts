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
content.PATH_DOC = "/doc";
content.PATH_PRODUCT = "/product";
content.PATH_PRODUCT_BROWSER = "/product-browser";

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
content.toIndex = function () 
{
    return router (content.PATH_INDEX);
}
content.toAbout = function ()
{
    return router (content.PATH_ABOUT);
}
content.toAuth = function ()
{
    return router (content.PATH_AUTH);
}
content.toDoc = function ()
{
    location.href = content.PATH_DOC;
}
content.toProduct = function (id: number)
{
    return router (content.PATH_PRODUCT + `?id=${String (id)}`);
}
content.toProductBrowser = function ()
{
    return router (content.PATH_PRODUCT_BROWSER);
}
export default content;