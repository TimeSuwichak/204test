/**
 * 
 * ทำหน้าที่ในการโหลดข้อมูลจากไฟล์ .env 
 * และเป็นตัวแทนในการดึงข้อมูลให้กับระบบอื่น ๆ ใช้งานต่อไป
 * 
*/
import dotenv from "dotenv";

/**
 * กลุ่มข้อมูลที่ได้จากการโหลดไฟล์ .env
*/
let collection: dotenv.DotenvParseOutput | undefined = undefined;
/**
 * ทำการโหลดข้อมูลจากไฟล์ .env ที่มีอยู่ในไฟล์โครงงาน
*/
const content = function ()
{
    const info = dotenv.configDotenv ({
        debug: true,
        encoding: "utf8",
    });
    if (info.error !== undefined)
    {
        return;
    }
    collection = info.parsed;
}
/**
 * ดึงค่าข้อมูลจากรหัสที่กำหนดไว้ ถ้าไม่พบข้อมูลระบบจะใช้ค่าเริ่มต้นจาก `initial` แทน
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
 * ดึงค่าข้อมูลจากรหัสที่กำหนดไว้ ถ้าไม่พบข้อมูลระบบจะใช้ค่าเริ่มต้นจาก `initial` แทน
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
 * ดึงค่าข้อมูลจากรหัสที่กำหนดไว้ ถ้าไม่พบข้อมูลระบบจะใช้ค่าเริ่มต้นจาก `initial` แทน
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

export default content;