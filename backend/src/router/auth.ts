import http     from "#core/http.ts";
import control  from "#controller/auth.ts";

const content = () =>
{
    //
    // ไม่มีคุณสมบัติในตอนนี้
    //
    return;
}
content.getRouteChallenge = () =>
{
    const route = http.router ();
    const limiterId = http.useRateLimit ({
        window: 60000 * 10,
        limit: 3,
        skipSuccess: true
    });
    const limiterPwd = http.useRateLimit ({
        window: 60000,
        limit: 3,
        skipSuccess: true
    });
    const validation = control.validateOnlyAuth ();

    route.post ("/challenge", 
        limiterId, control.challenge, validation, 
        limiterPwd, control.challengeEnhanced
    );
    route.post ("/create", 
        limiterId, control.create
    );

    return route;
}
/**
 * ส่งออกตัวแปร
*/
export default content;