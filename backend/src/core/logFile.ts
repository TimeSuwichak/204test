/**
 * 
 * ทำหน้าที่ส่งข้อมูลที่ได้จากบันทึกไปยังไฟล์บันทึก (File)
 * 
*/
import env from "#core/env.ts";
import fs from "node:fs";
import fsa from "node:fs/promises";
import path from "node:path";
import logging from "#core/log.ts"

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("LogFile");
/**
 * จำนวนบันทึกสูงสุด
*/
const backlog = 4;
/**
 * ทำหน้าที่ส่งข้อมูลที่ได้จากบันทึกไปยังไฟล์บันทึก (File)
*/
const content = function () { return; }
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = async function ()
{
    const folder = path.resolve (env.getString ("LogPath", "./data/log"));
    const file = path.join (folder, "latest.log");

    //
    // สร้างแฟ้ม
    //
    await fsa.mkdir (folder, { recursive: true });
    
    //
    // นำไฟล์ล่าสุดออก
    //
    await fsa.stat (file).then (async (x) =>
    {
        if (x.isFile () == false)
        {
            // ไฟล์อาจจะยังไม่ได้ถูกสร้าง
            return;
        }
        const time = x.birthtime;
        const year = time.getFullYear ().toString ();
        const month = time.getMonth ().toString ().padStart (2, "0");
        const day = time.getDate ().toString ().padStart (2, "0");

        const hour = time.getHours ().toString ().padStart (2, "0");
        const minute = time.getMinutes ().toString ().padStart (2, "0");
        const second = time.getSeconds ().toString ().padStart (2, "0");


        const newDate = `${year}-${month}-${day}`;
        const newTime = `${hour}.${minute}.${second}`;
        const newPath = path.join (folder, `${newDate} ${newTime}.log`);

        //
        // เปลี่ยนชื่อไฟล์ "latest.log" เป็น "(วันที่) (เวลา).log"
        //
        await fsa.rename (file, newPath);
    })
    .catch ((error) =>
    {
        // (ไม่สนใจ)
        log.warn ("An error down below will be ignored:");
        log.warn ("-------------------------");
        log.warn (error);
        return;
    });

    //
    // สร้างไฟล์ latest.log
    //
    try
    {

        const stream = fs.createWriteStream (file, 
        {
            autoClose: true,
            encoding: "utf8",
        });
        logging.addListener ((value) =>
        {
            const level = 
                value.level === logging.LEVEL_INFO ? "I" :
                value.level === logging.LEVEL_WARN ? "W" :
                value.level === logging.LEVEL_ERROR ? "E" :
                value.level === logging.LEVEL_FATAL ? "F" :
                value.level === logging.LEVEL_VERBOSE ? "V" :
            "gray";

            const timeStart = logging.start.getTime ();
            const timeLog = value.time.getTime ();
            const time = ((timeLog - timeStart) / 1000).toFixed (3);
            
            const tag = value.tag;
            const message = content.formatMessage (value.message);
            const out = `${level} ${time} [${tag}] ${message}`;
    
            stream.write (out);
            stream.write ("\n");
        });
        log.info ("Backlog: " + backlog);
        log.info ("Started");
    }
    catch (error)
    {
        log.warn ("Cannot create a new log file");
        log.warn ("NOTE: the process will continue without file logging");
        log.warn ("-------------------------");
        log.warn (error);
    }

    //
    // ลบไฟล์เก่าที่สุด
    //
    const logRead = await fsa.readdir (folder).then ((x) => x.map ((x) =>
    {
        const location = path.join (folder, x);

        return {
            location: location,
            stat: fs.statSync (location)
        }
    }))
    const logSort = logRead.sort ((a, b) =>
    {
        return (a.stat.birthtimeMs > b.stat.birthtimeMs) ? -1 : 1;
    });
    if (logSort.length >= backlog)
    {
        for (let index = backlog; index < logSort.length; index ++)
        {
            const value = logSort[index];

            if (value)
            {
                fsa.rm (value.location);
                log.info (`Cleared log-file: ${value.location}`);
            }
        }
    }
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