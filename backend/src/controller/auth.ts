import http from "#core/http.ts";

import type { Request, Response } from "#core/http.ts";

const content = function ()
{
    return;
}

content.routeSignIn = function (request: Request, response: Response)
{
    try
    {
        if (!request.body)
        {
            response.status (http.STATUS_BAD_REQUEST)
            response.end ();
            return;
        }
        const inBody = request.body as Record<string, unknown>;
        const inId = String (inBody ["identifier"]);
        const inPwd = String (inBody ["password"]);

        if (inId.length < 4 || inPwd.length < 8)
        {
            response.status (http.STATUS_BAD_REQUEST)
            response.end ();
            return;
        }

        if (inId === "admin" && inPwd === "password")
        {
            response.status (http.STATUS_OK);
            response.end ({
                nameId: inId,
                nameDisplay: inId,
                session: "",
                sessionExpire: 0
            });
            return;
        }
        response.status (http.STATUS_NOT_FOUND);
        response.end ();
    }
    catch
    {
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    }
}
content.routeSignInMfa = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}
content.routeSignOut = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}

content.routeSignUp = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}

content.routeResume = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.routeRenewal = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.routeDeactivate = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.routeDelete = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
Object.freeze (content);
export default content;
