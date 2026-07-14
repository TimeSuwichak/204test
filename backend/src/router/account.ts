import http     from "#core/http.ts";
import control  from "#controller/account.ts";

/**
 *  
*/
const content = () =>
{
    return;
}
/**
 * 
*/
content.getController = () =>
{
    return control;
}
/**
 * 
*/
content.getRouter = () =>
{
    const router = http.router ();

    router.get ("/:id", control.getBasic);
    router.get ("/:id/icon", control.getIcon);
    router.get ("/:id/contact", control.getContact);

    router.put ("/:id", control.putBasic);
    router.put ("/:id/icon", control.putIcon);
    router.put ("/:id/contact", control.putContact);

    return router;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;