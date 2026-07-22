import env                  from "#core/env.ts";
import log                  from "#core/log.ts";
import logConsole           from "#core/log.console.ts";
import logFile              from "#core/log.file.ts";
import logInject            from "#core/log.inject.ts";
import logRemote            from "#core/log.remote.ts";
import http                 from "#core/http.ts";
import webSocket            from "#core/webSocket.ts";
import sql                  from "#core/sql.ts";

import routerAuth           from "#router/auth.ts";
import routerAccount        from "#router/account.ts";
import routerProduct        from "#router/product.ts";
import routerPromotion      from "#router/promotion.ts"
import routerOrder          from "#router/order.ts";
import routerInquiry        from "#router/inquiry.ts";
import routerStorage        from "#router/storage.ts";

import modelAuth            from "#model/auth.ts";
import modelAccount         from "#model/account.ts";
import modelProduct         from "#model/product.ts";
import modelPromotion       from "#model/promotion.ts"
import modelStorage         from "#model/storage.ts";

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
        http.routeTo ("/auth", routerAuth.getRouteChallenge ());
        http.routeTo ("/account", routerAccount.getRoute ());
        http.routeTo ("/account-list", routerAccount.getRouteList ());
        http.routeTo ("/account-cart", routerAccount.getRouteCart ());
        http.routeTo ("/account-contact", routerAccount.getRouteContact ());
        http.routeTo ("/account-favorite", routerAccount.getRouteFavorite ());
        http.routeTo ("/account-order", routerAccount.getRouteOrder ());
        http.routeTo ("/product", routerProduct.getRoute ());
        http.routeTo ("/product-category", routerProduct.getRouteCategory ());
        http.routeTo ("/product-comment", routerProduct.getRouteComment ());
        http.routeTo ("/product-comment-list", routerProduct.getRouteCommentList ());
        http.routeTo ("/product-review", routerProduct.getRouteReview ());
        http.routeTo ("/product-review-list", routerProduct.getRouteReviewList ());
        http.routeTo ("/product-stock", routerProduct.getRouteStock ());
        http.routeTo ("/promotion", routerPromotion.getRoute ());
        http.routeTo ("/inquiry", routerInquiry.getRoute ());
        http.routeTo ("/order", routerOrder.getRoute ());
        http.routeTo ("/storage", routerStorage.getRoute ());
        return;
    });
    await webSocket.init ();

    //
    // Service Subsystem
    //
    await modelAuth.init ();
    await modelAccount.init ();
    await modelProduct.init ();
    await modelPromotion.init ();
    await modelStorage.init ();

    //
    // Debugging Subsystem
    //
    await testMode.setupAccount ();
    await testMode.setupProduct ();
    await testMode.setupPromotion ();

    //
    // Finalize Stage ...
    //
    http.setMode (http.MODE_READY);
}
await content.start ();