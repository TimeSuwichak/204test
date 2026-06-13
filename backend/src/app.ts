import env          from "#core/env.ts";
import log          from "#core/log.ts";
import logConsole   from "#core/logConsole.ts";
import http         from "#core/http.ts";
import sql          from "#core/sql.ts";

env ();
log ();
logConsole ();
http ();
sql ();

const start = Date.now ();

http.get ("/uptime", (request, response) =>
{
    return response.json ({
        value: Date.now () - start
    });
});

await http.finalize ();