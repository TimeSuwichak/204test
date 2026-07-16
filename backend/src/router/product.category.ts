import http from "#core/http.ts";
import control from "#controller/product.category.ts";
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
    const authManager = controlAuth.validateOnlyManager ();

    router.get ("/:id", control.get);
    router.put ("/:id", authManager, control.put);
    router.post ("/", authManager, control.post);
    router.delete ("/:id", authManager, control.delete);

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