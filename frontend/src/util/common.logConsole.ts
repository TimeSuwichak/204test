/**
 * 
 * ทำหน้าที่ส่งข้อมูลที่ได้จากบันทึกไปยังหน้าต่างแสดงผล (Console)
 * ระบบนี้พร้อมแสดงสีข้อความเพิ่มอำนวนความสะดวกในการมองเห็น
 * 
*/
import logging from "#util/common.log.ts"
import type { CallbackData } from "#util/common.log.ts";

const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;
/**
 * ตัวรับฟังข้อมูลกิจกรรม
*/
const receiver = function (value: CallbackData)
{
    const timeStart = logging.start.getTime ();
    const timeLog = value.time.getTime ();
    const time = ((timeLog - timeStart) / 1000).toFixed (3);
    
    const ftime = content.formatTime (time);
    const ftag = content.formatTag (value.tag);
    const fmessage = content.formatMessage (value.level, value.message);
    const fout = `${ftime} ${ftag} ${fmessage}\n`;

    switch (value.level)
    {
        case logging.LEVEL_INFO: originalLog (fout); return;
        case logging.LEVEL_WARN: originalWarn (fout); return;
        case logging.LEVEL_ERROR: originalError (fout); return;
        case logging.LEVEL_FATAL: originalError (fout); return;
    }
}
/**
 * ระบบส่งข้อมูลกิจกรรมไปยังหน่วยแสดงผล (Console)
*/
const content = function Stub () { return; }
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = function ()
{
    logging.addListener (receiver);
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = function ()
{
    logging.removeListener (receiver);
}
content.formatTime = function (data: string)
{
    return data;
}
/**
 * จัดรูปแบบแท็กให้อ่านเข้าใจง่ายมากขึ้น
*/
content.formatTag = function (data: string) : string
{
    return data;
}
/**
 * แปลงข้อมูลให้เป็นรูปแบบข้อความที่อ่านได้ง่ายขึ้น
*/
content.formatMessage = function (level: number, data: unknown [])
{
    const result = data.map ((x) =>
    {
        if (typeof x === "string") { 
            return x; 
        }
        if (typeof x === "number" || typeof x === "boolean") { 
            return String (x); 
        }
        if (typeof x === "object" && x instanceof Date) {
            return x.toLocaleString (); 
        }
        if (typeof x === "object" && x instanceof Error) {
            return decodeURI (String (x.stack)); 
        }
        return JSON.stringify (data, null, 4);
    }).join (" ");

    return result;
}

Object.freeze (content);
export default content;