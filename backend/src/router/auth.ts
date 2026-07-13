import http from "#core/http.ts";
import control from "#controller/auth.ts";

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
    const route = http.router ();
    const limiter = http.useRateLimit ({
        window: 1000,
        limit: 3
    });

    route.post ("/sign-in", limiter, control.routeSignIn);
    route.post ("/sign-in-password", limiter, control.routeSignInPwd);
    route.post ("/sign-in-totp", control.routeSignInTotp);
    route.post ("/sign-out", control.routeSignOut);
    
    route.post ("/sign-up", control.routeSignUp);

    route.post ("/deactivate", control.routeDeactivate);
    route.post ("/delete", control.routeDelete);

    return route;
}

Object.freeze (content);
export default content;