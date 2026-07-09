/**
 * 
 * ทำหน้าที่บันทึกการทำงานของระบบต่าง ๆ เป็นตัวแทนการบันทึกข้อมูลกิจกรรม
 * ที่เกิดขึ้นเช่น ข้อมูล, คำเตือน, และข้อผิดพลาด
 * 
*/
export interface CallbackData
{
    /**
     * เวลาที่ประทับไว้ในบันทึก
    */
    readonly time: Date;
    /**
     * ชื่อแท็กของระบบ
    */
    readonly tag: string;
    /**
     * ระดับการบันทึกกิจกรรม
    */
    readonly level: number;
    /**
     * ข้อมูลที่อยู่ในบันทึก
    */
    readonly message: CallbackMessage;
}
export type Callback = (data: CallbackData) => void;
export type CallbackMessage = unknown [];

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
    return;
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
 * เริ่มต้นการทำงานของระบบ
*/
content.init = function ()
{
    const isDev = import.meta.env.DEV;

    enableInfo = isDev;
    enableWarn = isDev;
    enableError = isDev;
    enableFatal = isDev;
    enableVerbose = isDev;

    listener.length = 0;
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = function ()
{
    listener.length = 0;
}
/**
 * ส่งข้อความไปยังตัวบันทึกกิจกรรมของระบบ
 * 
 * @param tag ชื่อแท็กระบบ
 * @param level ระดับการบันทึก
 * @param message ข้อมูลบันทึก
*/
content.log = function 
(
    tag: string, 
    level: number, 
    ... message: unknown[])
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
    return;
}
/**
 * ส่งข้อความปกติ ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.info = function (tag: string, ... message: CallbackMessage)
{
    content.log (tag, content.LEVEL_INFO, ... message);
}
/**
 * ส่งข้อความเตือน ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.warn = function (tag: string, ... message: CallbackMessage)
{
    content.log (tag, content.LEVEL_WARN, ... message);
}
/**
 * ส่งข้อความผิดพลาด ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.error = function (tag: string, ... message: CallbackMessage)
{
    content.log (tag, content.LEVEL_ERROR, ... message);
}
/**
 * ส่งข้อความร้ายแรง ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.fatal = function (tag: string, ... message: CallbackMessage)
{
    content.log (tag, content.LEVEL_FATAL, ... message);
}
/**
 * ส่งข้อความไปเรื่อย ไปยังตัวบันทึกกิจกรรมของระบบ
*/
content.verbose = function (tag: string, ... message: CallbackMessage)
{
    content.log (tag, content.LEVEL_VERBOSE, ... message);
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
         * ส่งข้อความ ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        log: (level: number, ... message: CallbackMessage) =>
        {
            content.log (tag, level, ... message);
        },
        /**
         * ส่งข้อความปกติ ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        info: (... message: CallbackMessage) =>
        {
            content.log (tag, content.LEVEL_INFO, ... message);
        },
        /**
         * ส่งข้อความเตือน ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        warn: (... message: CallbackMessage) =>
        {
            content.log (tag, content.LEVEL_WARN, ... message);
        },
        /**
         * ส่งข้อความผิดพลาด ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        error: (... message: CallbackMessage) =>
        {
            content.log (tag, content.LEVEL_ERROR, ... message);
        },
        /**
         * ส่งข้อความร้ายแรง ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        fatal: (... message: CallbackMessage) =>
        {
            content.log (tag, content.LEVEL_FATAL, ... message);
        },
        /**
         * ส่งข้อความไปเรื่อย ไปยังตัวบันทึกกิจกรรมของระบบ
        */
        verbose: (message: CallbackMessage) =>
        {
            content.log (tag, content.LEVEL_VERBOSE, ... message);
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