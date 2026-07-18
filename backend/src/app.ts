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
import routerAuthSignIn     from "#router/auth.signin.ts";
import routerAccount        from "#router/account.ts";
import routerProdCategory   from "#router/product.category.ts";
import routerProdComment    from "#router/product.comment.ts";
import routerProdReview     from "#router/product.review.ts";
import routerProdStock      from "#router/product.stock.ts";
import routerProd           from "#router/product.ts";

import modelAuth            from "#model/auth.ts";
import modelAccount         from "#model/account.ts";
import modelProduct         from "#model/product.ts";

import testMode             from "./appTest.ts";

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
        http.routeTo ("/auth", routerAuthSignIn.getRouter ());
        http.routeTo ("/account", routerAccount.getRouter ());
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

    //
    // Debugging Subsystem
    //
    await testMode.setupAccount ();
    await testMode.setupProduct ();

    //
    // Finalize Stage ...
    //
    http.setMode (http.MODE_READY);
}
await content.start ();