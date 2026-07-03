/**
 * 
 * ทำหน้าที่ส่งข้อมูลที่ได้จากบันทึกไปยังหน้าต่างแสดงผล (Console)
 * ระบบนี้พร้อมแสดงสีข้อความเพิ่มอำนวนความสะดวกในการมองเห็น
 * 
*/
import util     from "node:util"
import logging  from "#core/log.ts"

const log = logging.scoped ("LogConsole");

/**
 * ระบบส่งข้อมูลกิจกรรมไปยังหน่วยแสดงผล (Console)
*/
const content = function ()
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

        const time = ((value.time.getTime () - logging.start.getTime ()) / 1000).toFixed (3);
        const tag = value.tag;
        const message = formatMessage (value.message);

            JSON.stringify (value.message, null, 4);

        const formatted = `${util.styleText ("gray", time)} ${util.styleText ("cyan", `[${tag}]`)} ${util.styleText (level, message)}`;

        console.log (formatted);
    });
    console.clear ();
    log.info (`Started (${new Date ().toLocaleString ()})`);
}

function formatMessage (data: unknown)
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