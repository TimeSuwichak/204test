import http     from "#core/http.ts";
import control  from "#controller/account.ts";
import controlAuth from "#controller/auth.ts";
import modelAct from "#model/account.ts";

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
content.getRoute = () =>
{
    const router = http.router ();
    const authUser = controlAuth.validate ({
        allowedRole: [
            modelAct.ROLE_USER,
            modelAct.ROLE_MANAGER
        ],
        allowedRestriction: 0,
    });
    const authManager = controlAuth.validateOnlyManager ();

    router.get ("/", authUser, control.getBasic);
    router.put ("/", authUser, control.putBasic);

    router.get ("/:id", control.getBasic);
    router.put ("/:id", authUser, control.putBasic);
    router.post ("/", authManager, control.postBasic);
    router.delete ("/:id", authManager, control.deleteBasic);

    return router;
}
content.getRouteList = () =>
{
    const router = http.router ();

    router.get ("/");

    return router;
}
content.getRouteCart = () =>
{
    const router = http.router ();
    const authUser = controlAuth.validateLeastUser ();

    router.get ("/", authUser, control.getCart);
    router.put ("/:id", authUser, control.putCart);
    router.post ("/", authUser, control.postCart);
    router.delete ("/:id", authUser, control.deleteCart);

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