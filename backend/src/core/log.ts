/**
 * 
 * ทำหน้าที่บันทึกการทำงานของระบบต่าง ๆ เป็นตัวแทนการบันทึกข้อมูลกิจกรรม
 * ที่เกิดขึ้นเช่น ข้อมูล, คำเตือน, และข้อผิดพลาด
 * 
*/
import dotenv from "#core/env.ts"

interface CallbackData
{
    time: Date;
    tag: string;
    level: number;
    message: Message;
}
type Callback = (data: CallbackData) => void;
type Message = unknown;

const listener: Callback[] = [];
const start = new Date ();

let enableInfo = true;
let enableWarn = true;
let enableError = true;
let enableFatal = true;
let enableVerbose = true;

/**
 * ระบบบันทึกกิจกรรมการทำงานของระบบ
*/
const content = function ()
{
    enableInfo = dotenv.getBoolean ("LogInfo", true);
    enableWarn = dotenv.getBoolean ("LogWarn", true);
    enableError = dotenv.getBoolean ("LogError", true);
    enableFatal = dotenv.getBoolean ("LogFatal", true);
    enableVerbose = dotenv.getBoolean ("LogVerbose", true);

    content.info ("Log", `Started (${start.toLocaleString ()})`);
}
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
 * เวลาเริ่มของระบบบันทึกกิจกรรม
*/
content.start = start;

/**
 * ส่งข้อความไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.log = function (tag: string, level: number, message: Message)
{
    if (level === content.LEVEL_INFO && !enableInfo) return;
    if (level === content.LEVEL_WARN && !enableWarn) return;
    if (level === content.LEVEL_ERROR && !enableError) return;
    if (level === content.LEVEL_FATAL && !enableFatal) return;
    if (level === content.LEVEL_FATAL && !enableVerbose) return;

    listener.forEach ((it) =>
    {
        it ({
            time: new Date (),
            tag: tag,
            level: level,
            message: message
        });
    });
}
/**
 * ส่งข้อความปกติ ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.info = function (tag: string, message: Message)
{
    content.log (tag, content.LEVEL_INFO, message);
}
/**
 * ส่งข้อความเตือน ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.warn = function (tag: string, message: Message)
{
    content.log (tag, content.LEVEL_WARN, message);
}
/**
 * ส่งข้อความผิดพลาด ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.error = function (tag: string, message: Message)
{
    content.log (tag, content.LEVEL_ERROR, message);
}
/**
 * ส่งข้อความร้ายแรง ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.fatal = function (tag: string, message: Message)
{
    content.log (tag, content.LEVEL_FATAL, message);
}
/**
 * ส่งข้อความไปเรื่อย ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.verbose = function (tag: string, message: Message)
{
    content.log (tag, content.LEVEL_VERBOSE, message);
}
/**
 * สร้างตัวบันทึกกิจกรรมระบบในรูปแบบที่มีขอบเขตที่จัดเชนมากขึ้น
 * 
 * @param tag ชื่อแท็กของระบบดังกล่าว
*/
content.scoped = function (tag: string)
{
    return {
        /**
         * ชื่อแท็กของระบบ
        */
        tag: tag,
        /**
         * ส่งข้อความปกติ ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        info: (message: Message) =>
        {
            content.log (tag, content.LEVEL_INFO, message);
        },
        /**
         * ส่งข้อความเตือน ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        warn: (message: Message) =>
        {
            content.log (tag, content.LEVEL_WARN, message);
        },
        /**
         * ส่งข้อความผิดพลาด ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        error: (message: Message) =>
        {
            content.log (tag, content.LEVEL_ERROR, message);
        },
        /**
         * ส่งข้อความร้ายแรง ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        fatal: (message: Message) =>
        {
            content.log (tag, content.LEVEL_FATAL, message);
        },
        /**
         * ส่งข้อความไปเรื่อย ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        verbose: (message: Message) =>
        {
            content.log (tag, content.LEVEL_VERBOSE, message);
        },
    }
}
/**
 * เพิ่มการรับฟังกิจกรรมการเรียกบันทึกการทำงาน
*/
content.addListener = function (value: Callback)
{
    listener.push (value);
}
/**
 * ลบการรับฟังกิจกรรมการเรียกบันทึกการทำงาน
*/
content.removeListener = function (value: Callback)
{
    const index = listener.findIndex ((it) => it === value);
    const invalid = -1;
    const count = 1;

    if (index === invalid) 
    {
        return;
    }
    listener.splice (index, count);
}
/**
 * นำตัวรับฟังกิจกรรมออกทั้งหมด
*/
content.clearListener = function ()
{
    listener.splice (0, listener.length);
}

Object.freeze (content);
export default content;