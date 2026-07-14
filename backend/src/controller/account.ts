import http from "#core/http.ts";
import 
{ 
    type Request, 
    type Response 
} 
from "#core/http.ts";

const content = function ()
{
    return;
}

content.init = function ()
{
    return;
}
content.terminate = function ()
{
    return;
}

content.getBasic = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.getIcon = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.getContact = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}

content.putBasic = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.putIcon = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.putContact = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;