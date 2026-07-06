import http from "#core/http.ts";
import event from "#core/event.ts";
import { WebSocket } from "ws";
import { WebSocketServer } from "ws";

interface Client
{
    sendJson: (data: Record<string, unknown>) => void;
    sendBinary: (data: ArrayBuffer) => void;
};

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
    client.on ("error", () =>
    {
        return;
    });
    client.on ("unexpected-response", () =>
    {
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
let insecure: WebSocketServer;
let secure: WebSocketServer;
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

    return Promise.resolve ();
}
content.onConnect = onConnect;
content.onDisconnect = onDisconnect;

Object.freeze (content);
export default content;