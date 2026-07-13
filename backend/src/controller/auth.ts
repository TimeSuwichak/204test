import http         from "#core/http.ts";
import logging      from "#core/log.ts"
import error        from "#core/error.ts";
import objReader    from "#core/objectReader.ts";
import objWriter    from "#core/objectWriter.ts";
import model        from "#model/auth.ts";
import
{ 
    type Request, 
    type Response,
    type NextFunction
} 
from "#core/http.ts";
/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("Auth");
/**
 * ระบบประมวลคำสั่งยืนยันตัวตนจากเครือข่าย
*/
const content = function ()
{
    return;
}
content.validate = function ()
{
    return function (
        request: Request,
        response: Response,
        next: NextFunction
    )
    {
        void request;
        void response;
        void next;
    }
}
content.validateChallenge = function ()
{
    return function (
        request: Request,
        response: Response,
        next: NextFunction
    )
    {
        void request;
        void response;
        void next;

        if (!request.headers.authorization)
        {
            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        const header = request.headers.authorization;
        const map = header.split (" ");

        if (map.length != 2)
        {
            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        const key = String (map [0]);
        const value = String (map [1]);

        if (key !== "Bearer")
        {
            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        void model.jwtVerify (value).then (() =>
        {
            next ();
        })
        .catch ((e: unknown) =>
        {
            log.error ("Session validation failed");
            log.error ("------------------------");
            log.error (e);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        })
    }
}
/**
 * เส้นทางเริ่มต้นการลงชื่อเข้าใช้งาน
*/
content.routeSignIn = function (request: Request, response: Response)
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let input: string;
    const key = "value";

    try
    {
        input = objReader (request.body).requireString (key);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    model.signIn (input).then ((x) =>
    {
        const result = objWriter ();

        result.requireInteger ("id", x.authLink);
        result.requireString ("session", x.session);
        result.requireDate ("sessionIssued", x.sessionIssued);
        result.requireDate ("sessionExpire", x.sessionExpire);
        result.requireInteger ("restriction", x.restriction);

        response.status (http.STATUS_OK);
        response.set ("content-type", "application/json");
        response.end (result.toJson ());
    })
    .catch ((e: unknown) =>
    {
        if (e instanceof error.NotFound)
        {
            response.status (http.STATUS_NOT_FOUND);
            response.end ();
            return;
        }
        if (e instanceof error.Conflict)
        {
            response.status (http.STATUS_CONFLICT);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    })
    
}
/**
 * เส้นทางต่อเนื่องการลงชื่อเข้าใช้งาน ดำเนินการต่อโดยการป้อนรหัสผ่าน
 * คำสั่งนี้ต้องใช้รหัสยืนยันตัวตนที่ถูกต้อง
*/
content.routeSignInPwd = function (request: Request, response: Response)
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST)
        response.end ();
        return;
    }
    let input: string;
    const key = "value";

    try
    {
        input = objReader (request.body).requireString (key);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    model.signIn (input).catch ((e: unknown) =>
    {
        if (e instanceof error.NotFound)
        {
            response.status (http.STATUS_NOT_FOUND);
            response.end ();
            return;
        }
        if (e instanceof error.Conflict)
        {
            response.status (http.STATUS_CONFLICT);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;;
    });
}
content.routeSignInTotp = function (request: Request, response: Response)
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
