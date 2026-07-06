/**
 * 
 * ทำหน้าที่ส่งข้อมูลที่ได้จากบันทึกไปยังหน้าต่างแสดงผล (Console)
 * ระบบนี้พร้อมแสดงสีข้อความเพิ่มอำนวนความสะดวกในการมองเห็น
 * 
*/
import util from "node:util"
import logging from "#core/log.ts"

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("LogConsole");
/**
 * ระบบส่งข้อมูลกิจกรรมไปยังหน่วยแสดงผล (Console)
*/
const content = function Stub () { return; }
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = function ()
{
    logging.addListener ((value) =>
    {
        const level = 
            value.level === logging.LEVEL_INFO ? "white" :
            value.level === logging.LEVEL_WARN ? "yellow" :
            value.level === logging.LEVEL_ERROR ? "red" :
            value.level === logging.LEVEL_FATAL ? "magenta" :
            value.level === logging.LEVEL_VERBOSE ? "green" :
            "gray";

        const timeStart = logging.start.getTime ();
        const timeLog = value.time.getTime ();
        const time = ((timeLog - timeStart) / 1000).toFixed (3);
        
        const tag = value.tag;
        const message = content.formatMessage (value.message);

        const fTime = util.styleText ("gray", time);
        const fTag = util.styleText ("cyan", tag);
        const fMessage = util.styleText (level, message);
        const fOut = `${fTime} ${fTag} ${fMessage}`;

        console.log (fOut);
    });
    console.clear ();
    log.info (`Started (${new Date ().toLocaleString ()})`);
}
/**
 * แปลงข้อมูลให้เป็นรูปแบบข้อความที่อ่านได้ง่ายขึ้น
*/
content.formatMessage = function (data: unknown)
{
    if (typeof data === "string")
    {
        return data;
    }
    if (typeof data === "number" || typeof data === "boolean")
    {
        return String (data);
    }
    if (data instanceof Date)
    {
        return data.toLocaleString ();
    }
    if (data instanceof Error)
    {
        return String (data.stack) + "\n";
    }
    return JSON.stringify (data, null, 4);
}

Object.freeze (content);
export default content;