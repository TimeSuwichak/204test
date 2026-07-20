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
    const authUser = controlAuth.validateLeastUser ();
    const authManager = controlAuth.validateOnlyManager ();

    router.get ("/", authUser, control.getBasic);
    router.put ("/", authUser, control.putBasic);
    router.post ("/", authManager, control.postBasic);
    router.delete ("/", authManager, control.deleteBasic);

    return router;
}
content.getRouteList = () =>
{
    const router = http.router ();

    router.get ("/", control.getBasicList);

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