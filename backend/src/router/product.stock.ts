import http from "#core/http.ts";
import control from "#controller/product.stock.ts";
import controlAuth from "#controller/auth.ts";

const content = function ()
{
    return;
}
content.getController = function ()
{
    return control;
}
content.getRouter = function ()
{
    const router = http.router ();
    const authStaff = controlAuth.validateLeastStaff ();

    router.get ("/:id", authStaff, control.get);
    router.put ("/:id", authStaff, control.put);

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