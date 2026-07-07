import env          from "#core/env.ts";
import log          from "#core/log.ts";
import logConsole   from "#core/logConsole.ts";
import logFile      from "#core/logFile.ts";
import logInject    from "#core/logInject.ts";
import http         from "#core/http.ts";
import webSocket    from "#core/webSocket.ts";
import sql          from "#core/sql.ts";

await env.init ();
await log.init ();
await logConsole.init ();
await logFile.init ();
await logInject.init ();
await http.init ();
await webSocket.init ();
sql ();

const start = Date.now ();

http.get ("/uptime", (request, response) =>
{
    throw new Error ("I am a problem");
    return response.json ({
        value: Date.now () - start
    });
});