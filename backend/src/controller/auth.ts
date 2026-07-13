import http         from "#core/http.ts";
import logging      from "#core/log.ts"
import error        from "#core/error.ts";
import objReader    from "#core/objectReader.ts";
import objWriter    from "#core/objectWriter.ts";
import model        from "#model/auth.ts";
import
{ 
    type Request, 
    type Response 
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
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = function ()
{
    return;
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = function ()
{
    return;
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

        result.requireInteger ("id", x.link);
        result.requireString ("session", x.session);
        result.requireDate ("sessionIssued", x.sessionIssued);
        result.requireDate ("sessionExpire", x.sessionExpire);
        result.requireInteger ("restriction", x.restriction);

        response.status (http.STATUS_OK);
        response.set ("content-type", "application/json");
        response.end (result.toJson ());
    })
    .catch ((e) =>
    {
        switch (Number (e))
        {
            case error.NOT_FOUND:
                response.status (http.STATUS_NOT_FOUND);
                response.end ();
                break;
            case error.CONFLICT:
                response.status (http.STATUS_CONFLICT);
                response.end ();
                break;
        }
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

    model.signIn (input).catch ((e) =>
    {
        switch (Number (e))
        {
            case error.NOT_FOUND:
                response.status (http.STATUS_NOT_FOUND);
                response.end ();
                break;
            case error.CONFLICT:
                response.status (http.STATUS_CONFLICT);
                response.end ();
                break;
        }
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
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
