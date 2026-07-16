import env          from "#core/env.ts";
import log          from "#core/log.ts";
import logConsole   from "#core/log.console.ts";
import logFile      from "#core/log.file.ts";
import logInject    from "#core/log.inject.ts";
import logRemote    from "#core/log.remote.ts";
import http         from "#core/http.ts";
import webSocket    from "#core/webSocket.ts";
import sql          from "#core/sql.ts";

import routerAuth           from "#router/auth.ts";
import routerProdCategory   from "#router/product.category.ts";
import routerProdComment    from "#router/product.comment.ts";
import routerProdReview     from "#router/product.review.ts";
import routerProdStock      from "#router/product.stock.ts";
import routerProd           from "#router/product.ts";

import modelAuth        from "#model/auth.ts";
import modelAccount     from "#model/account.ts";
import modelProduct     from "#model/product.ts";

const content = () =>
{
    return;
}
content.start = async () =>
{
    //
    // Core Subsystem
    //
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
        http.routeTo ("/product-category", routerProdCategory.getRouter ());
        http.routeTo ("/product-comment", routerProdComment.getRouter ());
        http.routeTo ("/product-review", routerProdReview.getRouter ());
        http.routeTo ("/product-stock", routerProdStock.getRouter ());
        http.routeTo ("/product", routerProd.getRouter ());
        return;
    });
    await webSocket.init ();
    //
    // Service Subsystem
    //
    await modelAuth.init ();
    await modelAccount.init ();
    await modelProduct.init ();
}
content.seed = async () =>
{
    try
    {
        await modelAuth.create ("Admin", "12345678",
        await modelAccount.create ({ 
            name: "Administrator", 
            role: modelAccount.ROLE_MANAGER 
        }));
    }
    catch (e: unknown) 
    {
        log.warn ("Seeding", e);
    }

    try
    {
        await modelAuth.create ("Staff", "12345678",
        await modelAccount.create ({ 
            name: "Administrator", 
            role: modelAccount.ROLE_STAFF 
        }));
    }
    catch (e: unknown) 
    {
        log.warn ("Seeding", e);
    }

    try
    {
        await modelAuth.create ("ItsJeremie", "12345678",
        await modelAccount.create ({ 
            name: "ItsJeremie", 
            role: modelAccount.ROLE_USER 
        }));
    }
    catch (e: unknown) 
    {
        log.warn ("Seeding", e);
    }
    const sessionAdmin = await modelAuth.createSession ({
        id: 1,
        restriction: 0,
        role: modelAccount.ROLE_MANAGER,
    });
    const sessionStaff = await modelAuth.createSession ({
        id: 2,
        restriction: 0,
        role: modelAccount.ROLE_STAFF,
    });
    const sessionUser = await modelAuth.createSession ({
        id: 3,
        restriction: 0,
        role: modelAccount.ROLE_STAFF,
    });

    log.verbose ("--- Session ---");
    log.verbose ("Seeding", `Admin: ${sessionAdmin.session}`);
    log.verbose ("Seeding", `Staff: ${sessionStaff.session}`);
    log.verbose ("Seeding", `User: ${sessionUser.session}`);
    log.verbose ("---------------");

    return;
}
await content.start ();
await content.seed ();