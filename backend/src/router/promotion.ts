import http from "#core/http.ts";
import control from "#controller/promotion.ts";
import controlAuth from "#controller/auth.ts";

const content = () =>
{
    return;
}

content.getRoute = () =>
{
    const router = http.router ();
    const authManager = controlAuth.validateOnlyManager ();

    router.get ("/", control.getBasicList);
    router.get ("/:id", control.getBasic);
    router.put ("/:id", authManager, control.putBasic);
    router.post ("/", authManager, control.postBasic);
    router.delete ("/:id", authManager, control.deleteBasic);

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