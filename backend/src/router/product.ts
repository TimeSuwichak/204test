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
    const auth = controlAuth.validate ({});
    const authStaff = controlAuth.validate ({});
    const authManager = controlAuth.validate ({});

    router.get ("/:id", control.getProduct);
    router.get ("/:id/preview/:pid", control.getProductPreview);
    router.get ("/:id/comment/:cid", control.getProductComment);

    router.put ("/:id", authManager, control.putProduct);
    router.put ("/:id/preview/:pid", auth, control.putProductPreview);
    router.put ("/:id/comment/:cid", auth, control.putProductComment);

    router.post ("/", authManager, control.postProduct);
    router.post ("/:id/preview", authStaff, control.postProductPreview);
    router.post ("/:id/comment", authStaff, control.postProductComment);

    router.delete ("/:id", authManager, control.deleteProduct);
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