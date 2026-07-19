import error    from "#util/common.error.ts";
import auth     from "#util/api.auth.ts";
import common   from "#util/api.common.ts";

import { type Challenge } from "#util/api.auth.ts";

/**
 * โมดูลหลักที่ใช้ในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับระบบเชื่อมต่อกับ Facebook
*/
const content = () => 
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
};
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = () =>
{
    const key = import.meta.env.F_API_KEY_FACEBOOK as string;
    const element = document.createElement ("script");

    Object.defineProperty (window, "fbAsyncInit", 
    {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function ()
        {
            FB?.init({
                appId: key,
                xfbml: true,
                version: 'v25.0'
            });
        }
    });

    element.async = true;
    element.defer = true;
    element.crossOrigin = "anonymous";
    element.src = "https://connect.facebook.net/en_US/sdk.js";

    document.head.appendChild (element);
    script = element;
}
/**
 * ยุติการทำงานของระบบ
 */
content.terminate = () =>
{
    script.remove ();
    script = HTMLScriptElement.prototype;
}
/**
 * ทำการลงชื่อเข้าใช้งานระบบด้วยระบบ Facebook
*/
content.login = async () : Promise<SessionFacebook> =>
{
    if (!FB) 
    {
        throw new error.NotAvailable ();
    }
    interface DataLogin
    {
        userId: string;
        accessToken: string;
    }
    interface DataFetch
    {
        name: string;
        email: string | undefined;
        icon: string;
    }

    const onLogin = ((
        resolve: (x: DataLogin) => void, 
        reject: (x: unknown) => void) =>
    {
        try
        {
            FB.login ((response) =>
            {
                if (response.status === "not_authorized")
                {
                    reject (new error.NotAuthorized ());
                    return;
                }
                if (response.status === "unknown")
                {
                    reject (new error.Cancelled ());
                    return;  
                }
                resolve ({
                    userId: response.authResponse.userID,
                    accessToken: response.authResponse.accessToken
                });
            });
        }
        catch (e: unknown)
        {
            throw new error.Unknown (e);
        }
    });
    const onFetch = ((
        resolve: (x: DataFetch) => void, 
        reject: (x: unknown) => void
    ) =>
    {
        try
        {
            const endpoint = "/me";
            const method = "get";
            const fields = "id,name,email,picture";

            FB.api (endpoint, method, { fields: fields }, (response) =>
            {
                if (response.error)
                {
                    reject (new error.NotAvailable (response));
                    return;
                }
                const pic =  response.picture as Record<string, unknown>;
                const picData = pic.data as Record<string, unknown>;
                const picURL = picData.url as string;

                resolve ({
                    name: response .name as string,
                    email: response .email as string,
                    icon: picURL
                });
            })
        }
        catch (e: unknown)
        {
            throw new error.Unknown (e);
        }
    });

    const first = await new Promise (onLogin);
    const second = await new Promise (onFetch);
    const response = await common.postJson ("", `${auth.NET_URL}/challenge`, 
    {
        "Type": auth.STEP_CONNECT_FACEBOOK,
        "Id": Number (first.userId),
        "Access": first.accessToken,
        "Name": second.name,
        "Email" : second.email ?? "",
        "Icon": second.icon
    });
    const reader = await common.toJson (response);
    const result1 = auth.readSession (reader);
    const result2 = auth.readChallenge (reader);

    return {
        ... result1,
        ... result2,
        fbId: Number (first.userId),
        fbAccess: first.accessToken,
        fbName: second.name,
        fbEmail: second.email ?? "",
        fbIcon: second.icon,
    }
}

export interface SessionFacebook extends Challenge
{
    fbId: number;
    fbAccess: string;
    fbName: string;
    fbEmail: string;
    fbIcon: string;
}

/**
 * สคริปแทรกสำหรับระบบ Facebook
*/
let script: HTMLScriptElement;
/**
 * ส่งออกตัวแปร
*/
export default content;

declare const FB: undefined |
{
    /**
     * The method FB.init() is used to initialize and setup the SDK. 
     * 
     * If you have followed our SDK quickstart guide, you won't need to re-use this method, but you may want to customize the parameters used.
     * 
     * All other SDK methods must be called after this one,
     * because they won't exist until you do.
    */
    init: (param: {
        /**
         * Your application ID. If you don’t have one find it in 
         * the App dashboard or go there to create a new app. 
         * 
         * Defaults to null.
        */
        appId ?: string;
        /**
         * Determines which versions of the Graph API and any API dialogs 
         * or plugins are invoked when using the .api() and .ui() functions. 
         * 
         * Valid values are determined by currently available versions, 
         * such as 'v2.0'. This is a required parameter.
        */
        version ?: string; 
        /**
         * Determines whether a cookie is created for the session or not. 
         * If enabled, it can be accessed by server-side code. 
         * 
         * Defaults to false.
        */
        cookie ?: boolean;
        /**
         * Determines whether a long-lived access token for the session can be 
         * saved in localStorage. 
         * 
         * This enables maintaining a user’s logged in status when 3rd party 
         * cookies are blocked from being sent to Facebook domains. 
         * 
         * Defaults to true.
        */
        localStorage ?: boolean;
        /**
         * Determines whether the current login status of the user is freshly 
         * retrieved on every page load. 
         * 
         * If this is disabled, that status will have to be manually retrieved 
         * using .getLoginStatus(). 
         * 
         * Defaults to false.
        */
        status ?: boolean;
        /**
         * Determines whether XFBML tags used by social plugins are parsed, 
         * and therefore whether the plugins are rendered or not. 
         * 
         * Defaults to false.
        */
        xfbml ?: boolean;
        /**
         * Frictionless Requests are available to games on Facebook.com 
         * or on mobile web using the JavaScript SDK. 
         * 
         * This parameter determines whether they are enabled. 
         * Defaults to false.
        */
        frictionlessRequests ?: boolean;
    }) => void;

    login: (cb: (response: {
        status: "connected" | "not_authorized" | "unknown"
        authResponse:
        {
            accessToken: string;
            expiresIn: number;
            reauthorize_required_in: number;
            userID: string;
        }

    }) => void) => void;

    api: (
        endpoint: string, 
        method: "get" | "post" | "delete" ,
        params: Record<string, unknown>,
        cb: (response: Record<string, unknown>) => void) 
    => void;

};