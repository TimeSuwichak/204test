import dotenv from "dotenv";
import fs from "node:fs";

/**
 * กลุ่มข้อมูลที่ได้จากการโหลดไฟล์ .env
*/
let collection: dotenv.DotenvParseOutput | undefined = undefined;
/**
 * 
 * ทำหน้าที่ในการโหลดข้อมูลจากไฟล์ .env 
 * และเป็นตัวแทนในการดึงข้อมูลให้กับระบบอื่น ๆ ใช้งานต่อไป
 * 
*/
const content = function ()
{
    return;
}
/**
 * ทำการโหลดข้อมูลจากไฟล์ .env ที่มีอยู่ในไฟล์โครงงาน
*/
content.init = async function ()
{
    if (fs.existsSync ("../env.local"))
    {
        const local = dotenv.configDotenv (
        {
            path: "../.env.local",
            debug: false,
            encoding: "utf8",
        });
        collection = local.parsed ?? {};
    }
    if (fs.existsSync ("../.env"))
    {
        const global = dotenv.configDotenv  (
        {
            path: "../.env",
            debug: false,
            encoding: "utf8",
        });
        collection = global.parsed ?? {};
    }


    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ .env
*/
content.terminate = function ()
{
    collection = {};
}
/**
 * ดึงค่าข้อมูลจากรหัสที่กำหนดไว้
 * ถ้าไม่พบข้อมูลระบบจะใช้ค่าเริ่มต้นจาก `initial` แทน
 * 
 * @param key รหัสสำหรับข้อมูลที่ต้องการ
 * @param initial ค่าเริ่มต้นในกรณีที่ไม่พบข้อมูล
*/
content.getString = function (key: string, initial: string)
{
    if (collection === undefined)
        return initial;
    if (collection [key] === undefined)
        return initial;

    return collection [key];
}
/**
 * ดึงค่าข้อมูลจากรหัสที่กำหนดไว้
 * ถ้าไม่พบข้อมูลระบบจะใช้ค่าเริ่มต้นจาก `initial` แทน
 * 
 * @param key รหัสสำหรับข้อมูลที่ต้องการ
 * @param initial ค่าเริ่มต้นในกรณีที่ไม่พบข้อมูล
*/
content.getInteger = function (key: string, initial: number)
{
    if (collection === undefined)
        return initial;
    if (collection [key] === undefined)
        return initial;

    const result = Number (collection [key]);

    if (!Number.isSafeInteger (result))
        return initial;

    return result;
}
/**
 * ดึงค่าข้อมูลจากรหัสที่กำหนดไว้ 
 * ถ้าไม่พบข้อมูลระบบจะใช้ค่าเริ่มต้นจาก `initial` แทน
 * 
 * @param key รหัสสำหรับข้อมูลที่ต้องการ
 * @param initial ค่าเริ่มต้นในกรณีที่ไม่พบข้อมูล
*/
content.getBoolean = function (key: string, initial: boolean)
{
    if (collection === undefined)
        return initial;
    if (collection [key] === undefined)
        return initial;

    const result = collection [key];

    if (result === "yes" || result === "true" || result === "1")
        return true;

    if (result === "no" || result === "false" || result === "0")
        return false;

    return initial;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;