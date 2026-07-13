import logging from "#util/common.log.ts";

export interface PacketStructure
{
    time: Date;
    level: number;
    tag: string;
    message: PacketMessage []; 
};
export interface PacketMessage
{
    key: number;
    value: unknown;

    name: string | undefined;
    message: string | undefined;
    cause: string | undefined;
    stack: string | undefined;
};
const content = function ()
{
    return;
}
let running = false;
let server: WebSocket | undefined;
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = function ()
{
    const url = `ws://${location.hostname}:51000`;
    const client = new WebSocket (url);

    server = client;
    running = true;

    client.onopen = () =>
    {
        return;
    };
    client.onclose = () =>
    {
        if (running) 
        {
            this.init ();
            return;
        }
        return;
    };
    client.onmessage = (event: MessageEvent) =>
    {
        if (typeof event.data !== "string") {
            return;
        }
        const json = JSON.parse (event.data) as Record<string, unknown>;
        const packet = json.packet as string;
        const level = json.level as number;
        const tag = json.tag as string;
        const message = json.message as PacketMessage [];
        
        if (packet !== "log-remote") 
        {
            return
        }

        const conversion = message.map ((x) =>
        {
            switch (x.key)
            {
                case 0: return x.value;
                case 1: return x.value;
                case 2: return x.value;
                case 3: return new Date (x.value as number);
                case 4: return x.stack;
            }
        });
        // console.log (tag, level, ... conversion);
        logging.scoped (tag).log (level, ... conversion);
    };
}
/**
 * ปิดการเชื่อมต่อ
*/
content.terminate = function ()
{
    running = false;

    if (server)
    {
        //
        // Normal closure: standard graceful shutdown
        //
        server.close (1000);
    }
}

Object.freeze (content);
export default content;