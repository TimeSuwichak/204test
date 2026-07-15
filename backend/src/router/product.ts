import http from "#core/http.ts";
import control from "#controller/product.ts"
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
    const authStaff = controlAuth.validateOnlyStaff ();
    const authManager = controlAuth.validateOnlyManager ();
    const authStaffOrManager = controlAuth.validateLeastStaff ();

    router.get ("/:id", control.get);
    router.get ("/:id/preview/:pid", control.getPreview);
    router.get ("/:id/comment/:cid", control.getComment);
    router.get ("/:id/stock", authStaffOrManager, control.getStock);

    router.put ("/:id", authManager, control.putProduct);
    router.put ("/:id/preview/:pid", auth, control.putPreview);
    router.put ("/:id/comment/:cid", auth, control.putComment);
    router.put ("/:id/stock", authStaffOrManager, control.putStock);

    router.post ("/", authManager, control.post);
    router.post ("/:id/preview", authStaff, control.postReview);
    router.post ("/:id/comment", authStaff, control.postComment);

    router.delete ("/:id", authManager, 
        control.deleteProduct);
    router.delete ("/:id/preview/:pid", authStaff, 
        control.deleteProductPreview);
    router.delete ("/:id/comment/:cid", authStaff, 
        control.deleteProductComment);

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