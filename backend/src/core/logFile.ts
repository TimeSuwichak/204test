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

import type
{
    CallbackData
}
from "#core/log.ts"

let stream: fs.WriteStream | undefined;
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
const receiver = function (data: CallbackData)
{
    if (!stream)
    {
        return;
    }
    const level = 
        data.level === logging.LEVEL_INFO ? "I" :
        data.level === logging.LEVEL_WARN ? "W" :
        data.level === logging.LEVEL_ERROR ? "E" :
        data.level === logging.LEVEL_FATAL ? "F" :
        data.level === logging.LEVEL_VERBOSE ? "V" :
    "gray";

    const timeStart = logging.start.getTime ();
    const timeLog = data.time.getTime ();
    const time = ((timeLog - timeStart) / 1000).toFixed (3);
    
    const tag = data.tag;
    const message = content.formatMessage (data.message);
    const out = `${level} ${time} [${tag}] ${message}`;

    stream.write (out);
    stream.write ("\n");
}
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
        if (!x.isFile ())
        {
            //
            // ไฟล์อาจจะยังไม่ได้ถูกสร้าง
            //
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
    .catch ((error: unknown) =>
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

        stream = fs.createWriteStream (file, 
        {
            autoClose: true,
            encoding: "utf8",
        });
        logging.addListener (receiver);
        log.info (`Backlog: ${String (backlog)}`);
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
    for (let index = backlog; index < logSort.length; index ++)
    {
        const value = logSort[index] as 
        {
            location: string;
            stat: fs.Stats;
        };
        const location = value.location;
        
        await fsa.rm (location).then (() =>
        {
            log.info (`Cleared log-file: ${location}`);
        })
        .catch ((error: unknown) =>
        {
            log.warn (`Cannot delete the old log file: ${location}`);
            log.warn (error);
        });
    }
    log.info ("Started");
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = async function ()
{
    logging.removeListener (receiver);

    if (stream)
    {
        
        stream.end ();
        stream.close ();

        log.info (`Saved ${String (stream.bytesWritten)} bytes`);
        stream = undefined;

    }
    log.info ("Stopped");
    return Promise.resolve ();
}
/**
 * แปลงข้อมูลให้เป็นรูปแบบข้อความที่อ่านได้ง่ายขึ้น
*/
content.formatMessage = function (data: unknown [])
{
    return data.map ((x) =>
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
}

Object.freeze (content);
export default content;