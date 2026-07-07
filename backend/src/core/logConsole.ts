/**
 * 
 * ทำหน้าที่ส่งข้อมูลที่ได้จากบันทึกไปยังหน้าต่างแสดงผล (Console)
 * ระบบนี้พร้อมแสดงสีข้อความเพิ่มอำนวนความสะดวกในการมองเห็น
 * 
*/
import util from "node:util"
import process from "node:process";
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
content.init = async function ()
{
    logging.addListener ((value) =>
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
            case logging.LEVEL_ERROR:
            case logging.LEVEL_FATAL:
                process.stderr.write (fout);
                break;
            default:
                process.stdout.write (fout);
                break;
        }

        // console.log (`${ftime} ${ftag} ${fmessage}`);
    });
    console.clear ();
    log.info (`Started (${new Date ().toLocaleString ()})`);

    return Promise.resolve ();
}
content.formatTime = function (data: string)
{
    return util.styleText ("gray", data);
}
/**
 * จัดรูปแบบแท็กให้อ่านเข้าใจง่ายมากขึ้น
*/
content.formatTag = function (data: string) : string
{
    return util.styleText ("cyan", data);    
}
/**
 * แปลงข้อมูลให้เป็นรูปแบบข้อความที่อ่านได้ง่ายขึ้น
*/
content.formatMessage = function (level: number, data: unknown [])
{
    const color = 
        level === logging.LEVEL_INFO ? "white" :
        level === logging.LEVEL_WARN ? "yellow" :
        level === logging.LEVEL_ERROR ? "red" :
        level === logging.LEVEL_FATAL ? "magenta" :
        level === logging.LEVEL_VERBOSE ? "green" : "gray";

    const result = data.map ((x) =>
    {
        if (typeof x === "string") { 
            return x; 
        }
        if (typeof x === "number" || typeof x === "boolean") { 
            return util.styleText ("magenta", String (x)); 
        }
        if (typeof x === "object" && x instanceof Date) {
            return util.styleText ("cyan", x.toLocaleString ()); 
        }
        if (typeof x === "object" && x instanceof Error) {
            return util.styleText ("red", decodeURI (String (x.stack))); 
        }
        return JSON.stringify (data, null, 4);
    }).join (" ");

    return util.styleText (color, result);
}

Object.freeze (content);
export default content;