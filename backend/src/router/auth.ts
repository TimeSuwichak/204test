import http from "#core/http.ts";
import logging from "#core/log.ts";
import control from "#controller/auth.ts";

const log = logging.scoped ("Auth");
const content = function ()
{
    return;
}
content.init = function ()
{
    http.route ("/auth", (router) =>
    {
        router.get ("/sign-in", http.useRateLimit ({
            window: 60000,
            limit: 3
        }),
        control.routeSignIn);
        
        router.post ("/sign-in-mfa", control.routeSignInMfa);
        router.post ("/sign-out", control.routeSignOut);
        router.post ("/sign-up", control.routeSignUp);

        router.post ("/deactivate", control.routeDeactivate);
        router.post ("/delete", control.routeDelete);
    });
    log.info ("Started");
}

Object.freeze (content);
export default content;