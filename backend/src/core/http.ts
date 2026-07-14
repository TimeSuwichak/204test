/**
 * 
 * ทำหน้าที่ในการประมวลผลข้อมูลจากโปรโตคอล HTTP
 * และอำนวนความสะดวกในการใช้งานให้กับระบบอื่น ๆ ต่อไป
 * 
*/
import http         from "node:http";
import https        from "node:https";
import net          from "node:net";
import rateLimit    from "express-rate-limit";
import helmet       from "helmet";
import cors         from "cors";
import compression  from "compression";
import dotenv       from "#core/env.ts";
import logging      from "#core/log.ts";
import express, 
{ 
    type Request as ExpReq, 
    type RequestHandler as ExpReqHandler,
    type Response as ExpRes,
    type NextFunction as ExpNext,
    type Router as ExpRouter
} 
from "express";

/**
 * การเชื่อมต่อตัวกลางระหว่างระบบอื่น ๆ เช่น HTTP และ HTTPS
*/
const netMiddleware = express ();
/**
 * ตัวประมวลเส้นทาง
*/
const netRouter = express.Router ({
    caseSensitive: true,
    strict: true,
    mergeParams: false,
});
/**
 *  การเชื่อมต่อหลักของระบบ HTTP
*/
const netHttp = http.createServer (netMiddleware);
/**
 *  การเชื่อมต่อหลักของระบบ HTTPS
*/
const netHttps = https.createServer (netMiddleware);
/**
 * ระบบบันทึกกิจกรรมการทำงาน
*/
const log = logging.scoped ("Http");

/**
 * ระบบจัดการเชื่อมต่อผ่านโปรโตคอล HTTP/HTTPS
*/
const content = function ()
{
    return;
}
content.http = netHttp;
content.https = netHttps;
/**
 * ติดตั้งตัวจำกัดการใช้งาน สิ่งนี้ช่วยเรื่องการทำ DDoS
*/
const useRateLimit = function ()
{
    return rateLimit ({
        legacyHeaders: false,
        windowMs: 10000,
        limit: 100,
        handler: (request: express.Request, response: express.Response) =>
        {
            response.status (429);
            response.end ();
        },        
    });
}
/**
 * ติดตั้งตัวป้องกันข้อมูล สิ่งจะนำข้อมูลบางส่วนออกจากส่วนหัว HTTP เพื่อความปลอดภัย
*/
const useHelment = function ()
{
    return helmet ({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        originAgentCluster: false,
        referrerPolicy: false,
        xContentTypeOptions: false,
        xDnsPrefetchControl: false,
        xDownloadOptions: false,
        xFrameOptions: false,
        xPermittedCrossDomainPolicies: false,
        xXssProtection: false,

        hidePoweredBy: true,
    });
}
/**
 * ติดตั้งตัวระบุว่าใครบางสามารถใช้ระบบนี้ได้บ้าง
*/
const useCors = function ()
{
    return cors ({
        methods: ["GET", "PUT", "POST", "DELETE"],
        origin: "*"
    });
}
/**
 * ติดตั้งตัวบีบอัดข้อมูล เพื่อลดขนาดของข้อมูล
*/
const useCompression = function ()
{
    return compression ();
}

/**
 * ระบุว่าไคลเอนต์ควรดำเนินการต่อ
*/
content.STATUS_CONTINUE = 100;
/**
 * ระบุเซิร์ฟเวอร์กำลังสลับโปรโตคอล
 * เช่น HTTP -> WebSocket
*/
content.STATUS_SWITCHING_PROTOCOL = 101;
/**
 * ระบุเซิร์ฟเวอร์กำลังประมวลผลข้อมูล
*/
content.STATUS_PROCESSING = 102;
/**
 * ระบุว่าข้อมูลที่ส่งกลับมีเนื้อหาเพิ่มเติมที่สามารถใช้ได้ ขณะที่เซิร์ฟเวอร์กำลังประมวลผลข้อมูล
*/
content.STATUS_EARLY_HINTS = 103;


/**
 * สถานะทุกอย่างเรียบร้อยดี ไม่มีข้อผิดพลาดใด ๆ
*/
content.STATUS_OK = 200;
/**
 * ระบุว่าเนื้อหานั้นถูกสร้างขี้นแล้ว
*/
content.STATUS_CREATED = 201;
/**
 * ระบุว่าเนื้อาหานั้นเซิร์ฟเวอร์ได้รับแล้ว แต่ยังไม่ประมวลผลใด ๆ
*/
content.STATUS_ACCEPTED = 202;
/**
 * ระบุว่าคำขอนั้นสำเร็จแต่มีการเปลี่ยนแปลงข้อมูลจากต้นฉบับ
*/
content.STATUS_NON_AUTHORITATIVE_INFO = 203;
/**
 * ระบุว่าเนื้อหาที่ส่งกลับไม่ข้อมูลใด ๆ
*/
content.STATUS_NO_CONTENT = 204;
/**
 * ระบุคำขอร้องนั้นสำเร็จ และเซิร์ฟเวอร์ต้องการให้ผู้ใช้เริ่มการแสดงผลใหม่
*/
content.STATUS_RESET_CONTENT = 205;
/**
 * ระบุว่าเนื้อหาที่ส่งกลับมีเพียงบางส่วน ของเนื้อหาทั้งหมด
*/
content.STATUS_PARTIAL_CONTENT = 206;
/**
 * ระบุสถานะการตอบกลับสามารถตีความได้หลายรูปแบบ
*/
content.STATUS_MULTI_STATUS = 207;
/**
 * ระบุว่ารายงานนั้นได้อยู่ในระบบเรียบร้อยแล้วและไม่จำเป็นต้องสร้างใหม่ซ้ำ
 * ค่าสถานะนี้ใช้กับบริบท WebDAV (Web Distributed Authoring and Versioning)
*/
content.STATUS_ALREADY_REPORTED = 208;
/**
 * ระบุว่าเซิร์ฟเวอร์ได้ประมวลผลข้อมูล (หนึ่งหรือมากกว่า) เรียบร้อยแล้ว
 * และข้อมูลที่ส่งกลับเป็นข้อมูลเปรียบเทียบ (delta) แทนข้อมูลทั้งหมด
*/
content.STATUS_IM_USED = 209;

/**
 * ระบุว่าการร้องขอดังกล่าวมีตัวเลือกที่หลากหลาย
 * ซึ่งอาจจำเป็นต้องให้ผู้ร้องขอเลือกอย่างใด อย่างหนึ่งก่อนที่ระบบจะทำงานต่อ
*/
content.STATUS_MULTIPLE_CHOICE = 300;
/**
 * ระบุว่าข้อมูลที่ต้องการร้องขอได้ถูกย้ายไปยังตำแหน่งอื่นแบบถาวรเรียบร้อยแล้ว
 * ทำให้ผู้ร้องขอจำเป็นต้องใช้ตำแหน่งที่ถูกต้องเพื่อเข้าถึงข้อมูล
*/
content.STATUS_MOVED_PERMANENTLY = 301;
/**
 * ระบุว่าข้อมูลที่ต้องการร้องขอได้ถูกย้ายไปยังตำแหน่งอื่นแบบชั่วคราว
 * ทำให้ผู้ร้องขอจำเป็นต้องใช้ตำแหน่งที่ถูกต้องเพื่อเข้าถึงข้อมูล
*/
content.STATUS_FOUND = 302;
/**
 * ระบุให้ร้องขอข้อมูลทำการมองหาตัวเลือกอื่นในการเข้าถึงข้อมูลแทน
*/
content.STATUS_SEE_OTHER = 303;
/**
 * ระบุข้อมูลดังกล่าวไม่มีการเปลี่ยนแปลง และไม่จำเป็นต้องส่งข้อมูลใหม่
*/
content.STATUS_NOT_MODIFIED = 304;
/**
 * ระบุให้ผู้ร้องขอสำหรับต้องใช้ระบบ Proxy เพื่อทำการเข้าถึงข้อมูล
*/
content.STATUS_USE_PROXY = 305;
/**
 * ระบุว่าเซิร์ฟเวอร์กำลังทำการเปลี่ยนไปใช้งานระบบ Proxy
*/
content.STATUS_SWITCH_PROXY = 306;
/**
 * ระบุว่าข้อมูลดังกล่าวถูกย้ายไปยังตำแหน่งอื่นชั่วคราว (ในขณะตำแหน่งอาจยังสามารถใช้งานได้)
 * ผู้ร้องขออาจจำเป็นต้องใช้ตำแหน่งใหม่เพื่อเข้าถึง
*/
content.STATUS_TEMPORARY_REDIRECT = 307;
/**
 * ระบุว่าข้อมูลดังกล่าวถูกย้ายไปยังตำแหน่งอื่นถาวร (ในขณะตำแหน่งอาจยังสามารถใช้งานได้)
 * ผู้ร้องขออาจจำเป็นต้องใช้ตำแหน่งใหม่เพื่อเข้าถึง
*/
content.STATUS_PERMANENT_REDIRECT = 308;

/**
 * ระบุว่าเซิร์ฟเวอร์จะไม่ประมวลข้อมูลที่ได้รับ
 * เนื่องจากเซิร์ฟเวอร์มองว่าข้อมูลที่ได้รับมีข้อผิดพลาดบางอย่าง
 * เช่น โครงสร้างข้อมูลไม่ถูกต้อง
*/
content.STATUS_BAD_REQUEST = 400;
/**
 * ระบุว่าเซิร์ฟเวอร์จะไม่ประมวลผลข้อมูลที่ได้รับ
 * เนื่องจากเซิร์ฟเวอร์ไม่สามารถระบุตัวตนของผู้ที่ร้องขอได้ว่าสามารถเชื่อถือได้
*/
content.STATUS_UNAUTHORIZED = 401;
/**
 * ระบุว่าเซิร์ฟเวอร์จะไม่ประมวลผลข้อมูลที่ได้รับ
 * เนื่องจากเซิร์ฟเวอร์มองว่าผู้ร้องขอยังไม่ได้ดำเนินการทางธุรกรรม
*/ 
content.STATUS_PAYMENT_REQUIRED = 402;
/**
 * ระบุว่าเซิร์ฟเวอร์จะไม่ประมวลผลข้อมูลที่ได้รับ
 * เนื่องจากเซิร์ฟเวอร์มองว่าผู้ร้องขอไม่มีสิทธิ์เพียงพอสำหรับการเข้าถึง/จัดการ
*/
content.STATUS_FORBIDDEN = 403;
/**
 * ระบุว่าเซิร์ฟเวอร์ไม่สามารถประมวลผลข้อมูลที่ได้รับ
 * เนื่องจากข้อมูลนั้นอาจไม่มีอยู่ในระบบ
*/
content.STATUS_NOT_FOUND = 404;
/**
 * ระบุว่าเซิร์ฟเวอร์จะไม่ประมวลผลข้อมูลที่ได้รับ
 * เนื่องจากเซิร์ฟเวอร์มองว่าผู้ร้องขอใช้วิธีการเข้าถึงข้อมูลที่ไม่ถูกต้อง
*/
content.STATUS_METHOD_NOT_ALLOWED = 405;
/**
 * ระบุว่าเซิร์ฟเวอร์ไม่สามารถส่งข้อมูลตอบกลับ จากชุดเงื่อนไขที่ระบุไว้ได้
*/
content.STATUS_NOT_ACCEPTABLE = 406;
/**
 * ระบุว่าเซิร์ฟเวอร์ไม่สามารถประมวลข้อมูลที่ได้รับ
 * เนื่องจากเซิร์ฟเวอร์มองว่าผู้ร้องขอจำเป็นต้องใช้ระบบ Proxy ในการเข้าถึง
*/
content.STATUS_PROXY_AUTHENTICATION_REQUIRED = 407;
/**
 * ระบุว่าเซิร์ฟเวอร์ต้องการปิดการเชื่อมต่อที่ไม่มีการเคลื่อนไว
*/
content.STATUS_REQUEST_TIMEOUT = 408;
/**
 * ระบุว่าเซิร์ฟเวอร์ไม่สามารถประมวลข้อมูลที่ได้รับ
 * เนื่องจากข้อมูลที่ได้รับขัดแย้งกันกับข้อมูลที่อยู่ในระบบ
*/
content.STATUS_CONFLICT = 409;
/**
 * ระบุว่าข้อมูลที่อยู่ในระบบเซิร์ฟเวอร์ไม่สามารถเข้าถึงได้อีกต่อไป
*/
content.STATUS_GONE = 410;
/**
 * ระบุว่าเซิร์ฟเวอร์ไม่สามารถประมวลได้
 * เนื่องจากผู้ร้องขอจำเป็นต้องระบุค่าขนาดของข้อมูลก่อน
*/
content.STATUS_LENGTH_REQUIRED = 411;
content.STATUS_PRECONDITION_FAILED = 412;
content.STATUS_CONTENT_TOO_LARGE = 413;
content.STATUS_URI_TOO_LONG = 414;
content.STATUS_UNSUPPORTED_MEDIA_TYPE = 415;
content.STATUS_RANGE_NOT_SATISFIABLE = 416;
content.STATUS_EXPECTATION_FAILED = 417;
content.STATUS_IM_A_TEAPOT = 418;
content.STATUS_MISDIRECTED_REQUEST = 421;
content.STATUS_UNPROCESSABLE_CONTENT = 422;
content.STATUS_LOCKED = 423;
content.STATUS_FAILED_DEPENDENCY = 424;
content.STATUS_TOO_EARLY = 425;
content.STATUS_UPGRADE_REQUIRED = 426;
content.STATUS_PRECONDITION_REQUIRED = 428;
/**
 * ระบุว่าเซิร์ฟเวอร์จะไม่ประมวลข้อมูลดังกล่าว
 * เนื่องจากผู้ร้องขอทำการเรียกคำร้องมากเกินไป
*/
content.STATUS_TOO_MANY_REQUEST = 429;
content.STATUS_REQUEST_HEADER_FIELD_TOO_LARGE = 431;
content.STATUS_UNAVAILABLE_FOR_LEGAL_REASON = 451;

content.STATUS_INTERNAL_SERVER_ERROR = 500;
content.STATUS_NOT_IMPLEMENTED = 501;
content.STATUS_BAD_GATEWAY = 502;
content.STATUS_SERVICE_UNAVAILABLE = 503;
content.STATUS_GATEWAY_TIMEOUT = 504;
content.STATUS_HTTP_VERSION_NOT_SUPPORTED = 505;
content.STATUS_VARIANT_ALSO_NEGOTIATE = 506;
content.STATUS_INSUFFICIENT_STORAGE = 507;
content.STATUS_LOOP_DETECTED = 508;
content.STATUS_NOT_EXTENDED = 510;
content.STATUS_NETWORK_AUTH_REQUIRED = 511;

/**
 * เริ่มต้นการทำงานของระบบ HTTP/HTTPS
*/
content.init = async function (cb: () => void)
{
    netMiddleware.use (useHelment ());
    netMiddleware.use (useCors ());
    netMiddleware.use (useRateLimit ());
    netMiddleware.use (useCompression ());
    netMiddleware.use (express.json ({
        strict: true,
        inflate: true,
    }))
    netMiddleware.use (netRouter);

    const useInsecured = dotenv.getBoolean ("B_HTTP_INSECURE_ENABLED", true);
    const useSecured = dotenv.getBoolean ("B_HTTP_SECURE_ENABLED", false);

    const portInsecured = dotenv.getInteger ("B_HTTP_INSECURE_PORT", 51000);
    const portSecured = dotenv.getInteger ("B_HTTP_SECURE_PORT", 51001);

    const serverName = dotenv.getString ("B_HTTP_SERVER", "");

    if (serverName.length > 0)
    {
        log.info ("Name:", serverName);
    }
    try
    {
        cb ();
    }
    catch (error)
    {
        log.error ("Error occurred during callback initialization");
        log.error ("---------------------------------------------");
        log.error (error);
    }
    netMiddleware.use ((request: express.Request, response: express.Response) =>
    {
        void request;
        void response;
    
        const path = request.path;
        const method = request.method;
        const socket = request.socket;
        const addr = (typeof socket.remoteAddress !==  "undefined") ? 
            socket.remoteAddress : "(unknown address)";

        log.warn (`${addr} initiated unhandled endpoint: ${method} ${path}`);

        request.socket.destroy ();

        // response.status (content.STATUS_NOT_FOUND);
        // response.end ();
    });
    netMiddleware.use ((
        error: Error, 
        request: express.Request, 
        response: express.Response,
        next: express.NextFunction
    ) =>
    {
        void error;
        void request;
        void response;
        void next;

        const path = request.path;
        const method = request.method;
        const socket = request.socket;
        const addr = (typeof socket.remoteAddress !==  "undefined") ? 
            socket.remoteAddress : "(unknown address)";

        log.error (`${addr} initiated unhandled exception: ${method} ${path}`);
        log.error (error);

        response.status (content.STATUS_INTERNAL_SERVER_ERROR);
        response.end ();
    });

    await new Promise ((resolve, reject) =>
    {
        if (!useInsecured) 
        {
            resolve (undefined);
            return;
        }
        try
        {
            netHttp.listen (portInsecured, "0.0.0.0", 128, () =>
            {
                const info = netHttp.address () as net.AddressInfo;
                const addr = info.address;
                const port = String (info.port);
                
                log.info (`Established connection (HTTP): ${addr}:${port}`);
                resolve (undefined);
                return;
            });
        }
        catch (error: unknown)
        {
            log.error (error);
            reject (new Error ("Establishment failure (HTTP)", 
            { 
                cause: error 
            }));
            return;
        }
    });
    await new Promise ((resolve, reject) =>
    {
        if (!useSecured) 
        {
            resolve (undefined);
            return;
        }
        try
        {
            netHttps.listen (portSecured, "0.0.0.0", 128, () =>
            {
                const info = netHttps.address () as net.AddressInfo;
                const addr = info.address;
                const port = String (info.port);
                
                log.info (`Established connection (HTTPS): ${addr}:${port}`);
                resolve (undefined);
                return;
            });
        }
        catch (error: unknown)
        {
            log.error (error);
            reject (new Error ("Establishment failure (HTTPS)", 
            { 
                cause: error 
            }));
            return;
        }
    });
    log.info ("Started");
}
/**
 * ยุติการทำงานของระบบ HTTP/HTTPS
*/
content.terminate = async function ()
{
    await new Promise ((resolve) =>
    {
        if (!netHttp.listening) 
        {
            resolve (undefined);
            return;
        }
        netHttp.close ((error ?: Error) =>
        {
            if (error) 
            {
                log.warn ("Closed connection (with error): HTTP");
                log.warn (error);
            }
            else
            {
                log.info ("Closed connection: HTTP");
            }
            netHttp.closeAllConnections ();
            resolve (undefined);
        });
    });
    await new Promise ((resolve) =>
    {
        if (!netHttps.listening) 
        {
            resolve (undefined);
            return;
        }
        netHttps.close ((error ?: Error) =>
        {
            if (error) 
            {
                log.warn ("Closed connection (with error): HTTPS");
                log.warn (error);
            }
            else
            {
                log.info ("Closed connection: HTTPS");
            }
            netHttps.closeAllConnections ();
            resolve (undefined);
        });
    });
    log.info ("Stopped");
}
/**
 * สร้างการเชื่อมต่อเส้นทางย่อยจากตำแหน่งที่กำหนดไว้
*/
content.route = function (router: ExpRouter)
{
    netMiddleware.use (router);
}
/**
 * สร้างการเชื่อมต่อเส้นทางย่อยจากตำแหน่งที่กำหนดไว้
*/
content.routeTo = function (path: string, router: ExpRouter)
{
    netMiddleware.use (path, router);
}
/**
 * สร้างการเชื่อมต่อเส้นทางย่อยจากตำแหน่งที่กำหนดไว้
*/
content.router = function ()
{
    const router = express.Router ({
        caseSensitive: true,
        strict: true,
        mergeParams: false
    });
    return router;
}
/**
 * สร้างการเชื่อมต่อรูปแบบการดึงข้อมูล (GET) จากตำแหน่งที่กำหนดไว้
*/
content.get = function (path: string, routeHandler: RequestHandler)
{
    return netRouter.get (path, routeHandler);
}
/**
 * สร้างการเชื่อมต่อรูปแบบการสร้างข้อมูล (POST) จากตำแหน่งที่กำหนดไว้
*/
content.post = function (path: string, routeHandler: RequestHandler)
{
    return netRouter.post (path, routeHandler);
}
/**
 * สร้างการเชื่อมต่อรูปแบบการแก้ไขข้อมูล (PUT) จากตำแหน่งที่กำหนดไว้
*/
content.put = function (path: string, routeHandler: RequestHandler)
{
    return netRouter.put (path, routeHandler);
}
/**
 * สร้างการเชื่อมต่อรูปแบบการแก้ไขข้อมูล (เพียงบางส่วน) (PATCH) จากตำแหน่งที่กำหนดไว้
*/
content.patch = function (path: string, routeHandler: RequestHandler)
{
    return netRouter.patch (path, routeHandler);
}
/**
 * สร้างการเชื่อมต่อรูปแบบการลบข้อมูล (DELETE) จากตำแหน่งที่กำหนดไว้
*/
content.delete = function (path: string, routeHandler: RequestHandler)
{
    return netRouter.delete (path, routeHandler);
}
content.useRateLimit = function ({ window = 10000, limit = 100 })
{
    return rateLimit ({
        legacyHeaders: false,
        windowMs: window,
        limit: limit,
        
        skipFailedRequests: false,

        handler: (request: express.Request, response: express.Response) =>
        {
            response.status (429);
            response.end ();
        },        
    });
}

export type Request = ExpReq;
export type RequestHandler = ExpReqHandler;
export type Response = ExpRes;
export type NextFunction = ExpNext;

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;