import http from "#core/http.ts";
import control from "#controller/product.comment.ts";
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
    const auth = controlAuth.validateLeastUser ();

    router.get ("/:id", control.get);
    router.put ("/:id", auth, control.put);
    router.post ("/", auth, control.post);
    router.delete ("/:id", auth, control.delete);

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