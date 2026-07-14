import http from "#core/http.ts";
import control from "#controller/auth.ts";
import model from "#model/auth.ts";

const content = function ()
{
    return;
}
content.getController = function ()
{
    return control;
}
content.getModel = function ()
{
    return model;
}
content.getRouter = function ()
{
    const route = http.router ();
    const limiter = http.useRateLimit ({
        window: 60000,
        limit: 3
    });

    route.post ("/sign-in", limiter, control.routeSignIn);
    route.post ("/sign-in-password", limiter, control.validateChallenge, control.routeSignInPwd);
    route.post ("/sign-in-totp", control.routeSignInTotp);
    route.post ("/sign-out", control.routeSignOut);
    
    route.post ("/sign-up", control.routeSignUp);

    route.post ("/deactivate", control.routeDeactivate);
    route.post ("/delete", control.routeDelete);

    return route;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;