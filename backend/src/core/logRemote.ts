import logging from "#core/log.ts";
import webSocket from "#core/webSocket.ts";

const content = function ()
{
    return;
}
content.init = async function ()
{
    logging.addListener ((data) =>
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
    });
    return Promise.resolve ();
}

Object.freeze (content);
export default content;