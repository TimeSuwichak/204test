import http from "#core/http.ts";

import type { Request, Response } from "#core/http.ts";

const content = function ()
{
    http.route ("/account", (router) =>
    {
        router.get ("/:id", content.routeBasic);
    });
}
content.routeBasic = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}

Object.freeze (content);
export default content;
