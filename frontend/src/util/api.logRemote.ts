import event from "#util/api.event.ts";

export interface CallbackMessage
{
    time: Date;
    level: number;
    tag: string;
    message: CallbackMessageData []; 
};
export interface CallbackMessageData
{
    key: number;
    value: number | string;

    name: string | undefined;
    message: string | undefined;
    cause: string | undefined;
    stack: string | undefined;
};
const content = function ()
{
    return;
}
let server: WebSocket | undefined;
const onMessage = event<CallbackMessage> ();
/**
 * ระดับการบันทึกรูปแบบปกติ ใช้สำหรับข้อความที่เป็นประโยชน์
*/
content.LEVEL_INFO = 1;
/**
 * ระดับการบันทึกรูปแบบคำเตือน ใช้สำหรับการแจ้งเตือนการทำงานระบบ
*/
content.LEVEL_WARN = 2;
/**
 * ระดับการบันทึกรูปแบบข้อผิดพลาด 
 * ใช้สำหรับการแจ้งเตือนข้อผิดพลาดของระบบในระดับที่ไม่สามารถเลี่ยงได้
*/
content.LEVEL_ERROR = 3;
/**
 * ระดับการบันทึกรูปแบบร้ายแรง
 * ใช้สำหรับการแจ้งเตือนระดับที่ไม่สามารถทำงานต่อได้
*/
content.LEVEL_FATAL = 4;
/**
 * ระดับการบันทึกรูปแบบไปเรื่อย ๆ
 * ใช้สำหรับข้อความที่แสดงค่อยข้างบ่อย (เช่น สำหรับการทดสอบค่าตัวแปร)
*/
content.LEVEL_VERBOSE = 5;
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = async function ()
{
    const url = `ws://${location.hostname}:51000`;
    const client = new WebSocket (url);

    server = client;
    client.onopen = () =>
    {
        console.log ("[LogRemote]", "Connected");
    };
    client.onclose = (event) =>
    {
        console.log (
            "[LogRemote]", 
            `Disconnected (code: ${String (event.code)})`
        );
    };
    client.onmessage = (event: MessageEvent) =>
    {
        if (typeof event.data !== "string") {
            return;
        }
        const json = JSON.parse (event.data) as Record<string, unknown>;
        const packet = json.packet as string;
        const time = json.time as number;
        const level = json.level as number;
        const tag = json.tag as string;
        const message = json.message as CallbackMessageData [];
        
        if (packet !== "log-remote") 
        {
            return
        }
        onMessage.emit ({
            time: new Date (time),
            level: level,
            tag: tag,
            message: message
        });
    };
    return Promise.resolve ();
}
/**
 * ปิดการเชื่อมต่อ
*/
content.close = async function ()
{
    if (server)
    {
        //
        // Normal closure: standard graceful shutdown
        //
        server.close (1000);
    }
    return Promise.resolve ();
}
content.onMessage = onMessage;

Object.freeze (content);
export default content;