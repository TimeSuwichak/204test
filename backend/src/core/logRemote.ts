import logging from "#core/log.ts";
import webSocket from "#core/webSocket.ts";
import type
{
    CallbackData
}
from "#core/log.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("LogRemote");

const receiver = function (data: CallbackData)
{
    webSocket.sendJson ({
        packet: "log-remote",
        time: data.time.getTime (),
        level: data.level,
        tag: data.tag,
        message: data.message.map ((x) =>
        {
            if (typeof x === "string") {
                return { key: 1, value: x };
            }
            if (typeof x === "number") {
                return { key: 2, value: x }
            }
            if (typeof x === "object" && x instanceof Date) {
                return { key: 3, value: x.getTime () }
            }
            if (typeof x === "object" && x instanceof Error) 
            {
                return { 
                    key: 4, 
                    name: x.name,
                    message: x.message,
                    cause: decodeURI (String (x.cause)),
                    stack: decodeURI (String (x.stack)),
                }
            }
            return { key: 0, value: x };
        })
    });
}
const content = function ()
{
    return;
}
content.init = async function ()
{
    logging.addListener (receiver);
    log.info ("Started");
    return Promise.resolve ();
}
content.terminate = async function ()
{
    logging.removeListener (receiver);
    log.info ("Stopped");
    return Promise.resolve ();
}

Object.freeze (content);
export default content;