import http from "#core/http.ts";
import event from "#core/event.ts";
import logging from "#core/log.ts";
import { WebSocket } from "ws";
import { WebSocketServer } from "ws";

interface Client
{
    sendJson: (data: Record<string, unknown>) => void;
    sendBinary: (data: ArrayBuffer) => void;
    terminate: () => void;
    close: () => void;
};
/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("WebSocket");
/**
 * 
 * ทำหน้าที่ในการประมวลผลข้อมูลจากโปรโตคอล WebSocket
 * และอำนวนความสะดวกในการใช้งานให้กับระบบอื่น ๆ ต่อไป
 * 
*/
const content = function ()
{
    return;
}
const connect = function (client: WebSocket)
{
    const instance: Client =
    {
        sendJson (data) 
        {
            client.send (JSON.stringify (data));
        },
        sendBinary (data) 
        {
            client.send (data);
        },
        terminate ()
        {
            client.terminate ();
        },
        close () 
        {
            //
            // Normal closure: standard graceful shutdown
            //
            client.close (1000);
        },
    };

    client.on ("open", () =>
    {
        onConnect.emit (instance);
    });
    client.on ("close", () =>
    {
        onDisconnect.emit (instance);
        return;
    });
    client.on ("message", () =>
    {
        return;
    });
    client.on ("error", (error: unknown) =>
    {
        log.error ("Unhandled exception:");
        log.error (error);
        return;
    });
    client.on ("unexpected-response", (req) =>
    {
        const socket = req.socket;
        const address = socket ? socket.remoteAddress : "(unknown address)";

        log.warn (`${String (address)} closed: protocol violation`);
        //
        // Protocol Violation: invalid frame, bad data format.
        //
        client.close (1002);
        return;
    });
    return;
}
const onConnect = event<Client> ();
const onDisconnect = event<Client> ();
let insecure: WebSocketServer | undefined;
let secure: WebSocketServer | undefined;
/**
 * เริ่มต้นการทำงานของระบบ WebSocket
*/
content.init = async function ()
{
    insecure = new WebSocketServer ({
        allowSynchronousEvents: false,
        server: http.http,

    });
    secure = new WebSocketServer ({
        allowSynchronousEvents: false,
        server: http.https,
    });
    insecure.on ("connection", connect);
    secure.on ("connection", connect);
    log.info ("Started");
    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ WebSocket
*/
content.terminate = async function ()
{
    await new Promise ((resolve) =>
    {
        if (!insecure) 
        {
            resolve (undefined);
            return;
        }
        insecure.close ((error ?: Error) =>
        {
            if (error) 
            {
                log.warn ("Closed connection (with error): unencrypted");
                log.warn (error);
            }
            else
            {
                log.info ("Closed connection: unencrypted");
            }
            resolve (undefined);
        });
    });
    await new Promise ((resolve) =>
    {
        if (!secure) 
        {
            resolve (undefined);
            return;
        }
        secure.close ((error ?: Error) =>
        {
            if (error) 
            {
                log.warn ("Closed connection (with error): encrypted");
                log.warn (error);
            }
            else
            {
                log.info ("Closed connection: encrypted");
            }
            resolve (undefined);
        });
    });
    insecure = undefined;
    secure = undefined;
    log.info ("Stopped");

    return Promise.resolve ();
}
content.sendJson = function (data: Record<string, unknown>)
{
    if (insecure)
    {
        insecure.clients.forEach ((v) =>
        {
            v.send (JSON.stringify (data));
        });
    }
    if (secure)
    {
        secure.clients.forEach ((v) =>
        {
            v.send (JSON.stringify (data));
        });
    }
}
content.sendBinary = function (data: ArrayBuffer)
{
    if (insecure)
    {
        insecure.clients.forEach ((v) =>
        {
            v.send (data);
        });
    }
    if (secure)
    {
        secure.clients.forEach ((v) =>
        {
            v.send (data);
        });
    }
}
content.onConnect = onConnect;
content.onDisconnect = onDisconnect;

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;