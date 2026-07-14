import env          from "#core/env.ts";
import log          from "#core/log.ts";
import logConsole   from "#core/logConsole.ts";
import logFile      from "#core/logFile.ts";
import logInject    from "#core/logInject.ts";
import logRemote    from "#core/logRemote.ts";
import http         from "#core/http.ts";
import webSocket    from "#core/webSocket.ts";
import sql          from "#core/sql.ts";

import routerAuth   from "#router/auth.ts";
import routerProduct from "#router/product.ts";

import modelAuth    from "#model/auth.ts";

let shutdownRequested = false;
const shutdown = function ()
{
    if (shutdownRequested) {
        return;
    }
    shutdownRequested = true;
    process.off ("beforeExit", shutdown);
    process.off ("SIGINT", shutdown);
    process.off ("SIGTERM", shutdown);

    log.warn ("Main", "Shutdown request initiated");
    
    const callback = async function ()
    {
        log.info ("Main", "Stopping ...");
        await sql.terminate ();
        await webSocket.terminate ();
        await http.terminate ();
        await logRemote.terminate ();
        await logFile.terminate ();
        env.terminate ();
        log.info ("Main", "Stopped");

    };
    void callback ();
}
process.on ("beforeExit", shutdown);
process.on ("SIGINT", shutdown);
process.on ("SIGTERM", shutdown);

await env.init ();
await log.init ();
await logConsole.init ();
await logFile.init ();
await logInject.init ();
await logRemote.init ();
await sql.init ();
await http.init (() =>
{
    http.routeTo ("/auth", routerAuth.getRouter ());
    http.routeTo ("/product", routerProduct.getRouter ());
    return;
});
await webSocket.init ();

await modelAuth.init ();