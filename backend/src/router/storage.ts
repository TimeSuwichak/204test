import http from "#core/http.ts";
import control from "#controller/storage.ts"

const content = () =>
{
    return;
}
content.getRoute = () =>
{
    const router = http.router ();

    // router.get ("/:id", control.getInfo);
    router.get ("/:id", control.getStream);
   
    return router;
}
/**
 * ส่งออกตัวแปร
*/
export default content;