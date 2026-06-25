import http from "#core/http.ts";
import control from "#controller/auth.ts";

const content = function ()
{
    http.route ("/auth", (router) =>
    {
        router.post ("/sign-in", control.routeSignIn);
        router.post ("/sign-in-mfa", control.routeSignInMfa);
        router.post ("/sign-out", control.routeSignOut);
        router.post ("/sign-up", control.routeSignUp);

        router.post ("/deactivate", control.routeDeactivate);
        router.post ("/delete", control.routeDelete);
    });
}

Object.freeze (content);
export default content;