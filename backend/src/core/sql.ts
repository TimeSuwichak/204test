import env      from "#core/env.ts";
import logging  from "#core/log.ts";
import error    from "#core/error.ts";

import mysql from "mysql2/promise";
import type
{
    FieldPacket,
    ResultSetHeader,
    RowDataPacket 
}
from "mysql2/promise";

type InputCommand = string;
type InputValue = (string | number | Date | null) [];

interface ResultTransaction
{
    /**
     * จบการทำงานในรูปแบบธุรกรรม (transaction)
     * และข้อมูลทั้งหมดที่ถูกเขียนบนธุรกรรมจะถูกบันทึกลงในฐานข้อมูล
    */
    commit: () => Promise<void>;
    /**
     * ยกเลิกการทำงานในรูปแบบธุรกรรม (transaction)
     * ทำให้ข้อมูลในธุรกรรมจะถูกทิ้งทั้งหมด
    */
    rollback: () => Promise<void>;
    /**
     * ปล่อยการเชื่อมต่อกลับไปยังกลุ่มการเชื่อมต่อ (connnection pool)
     * เพื่อให้ระบบอื่น ๆ สามารถนำการเชื่อมต่อนี้ไปใช้งานต่อได้
    */
    release: () => void;
}
interface ResultError 
{
    code: string;
    sqlMessage: string; 
};

/**
 * สถานะการทำงาน
*/
let running = false;
/**
 * กลุ่มการเชื่อมต่อ
*/
let client: mysql.Pool | undefined;
/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("MySQL");
/**
 * ดักจับข้อผิดพลาดที่เกิดขึ้นในระหว่างการทำงานของคำสั่ง
*/
const mediate = function (info: ResultError) : number
{
    switch (info.code)
    {
        case "ER_DUP_ENTRY": 
            return error.DUPLICATE;
        case "ER_NO_REFERENCED_ROW":
        case "ER_NO_REFERENCED_ROW_2": 
            return error.CONSTRAINT;
        case "ER_PARSE_ERROR":
        case "ER_BAD_FIELD_ERROR": 
            return error.COMMAND;
        case "ER_NO_SUCH_TABLE": 
            return error.NOT_FOUND;
        case "ER_ACCESS_DENIED_ERROR": 
        case "ER_DBACCESS_DENIED_ERROR":
            return error.NOT_AUTHORIZED;
        case "ECONNREFUSED":
            return error.NETWORK;
    }
    return error.UNKNOWN;
}
/**
 * 
 * ทำหน้าที่เป็นตัวแทนการเชื่อมต่อกับฐานข้อมูล SQL
 * 
*/
const content = function ()
{
    return;
}
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = async function ()
{
    if (running) {
        return;
    }
    const host = env.getString ("SqlHost", "127.0.0.1");
    const port = env.getInteger ("SqlPort", 51100);
    const data = env.getString ("SqlDb", "project");
    const user = env.getString ("SqlUser", "project");
    const pwd = env.getString ("SqlPassword", "project");
    const multi = env.getBoolean ("SqlMutliStatement", false);
    
    client = mysql.createPool ({
        host: host,
        port: port,
        database: data,
        user: user,
        password: pwd,
        enableCleartextPlugin: false,
        enableKeepAlive: true,
        multipleStatements: multi
    });
    running = true;
    log.info ("Started");
    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = async function ()
{
    if (!running) {
        return;
    }
    if (client) {
        await client.end ();
    }
    log.info ("Stopped");
    return Promise.resolve ();
}
/**
 * เริ่มการดึงหนนึ่งข้อมูล จากในตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นรายการข้อมูลที่ผู้ใช้ร้องขอ
 * 
 * @param command คำสั่งภาษา SQL
 * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการดึงข้อมูล
*/
content.select = async function
(
    command: InputCommand,
    value: InputValue = []

) : Promise<Record<string,unknown>[]>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }

    try
    {
        const raw: [RowDataPacket[], FieldPacket[]] 
            = await client.execute (command, value);
        const row = raw[0];
        
        return row;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการดึงหนนึ่งข้อมูลหรือชุดข้อมูลหลายจำนวน จากในตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นรายการข้อมูลที่ผู้ใช้ร้องขอ
 * 
 * @param command คำสั่งภาษา SQL
 * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการดึงข้อมูล
*/
content.selectMultiple = async function
(
    command: InputCommand,
    value: InputValue = []

) : Promise<Record<string, unknown>[]>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }

    try
    {
        const raw: [RowDataPacket[], FieldPacket[]] 
            = await client.query (command, value);
        const row = raw[0];

        return row;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการแทรกข้อมูลหนึ่งจำนวนลงไปในตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นรหัสกุญแจหลัก (PRIMARY KEY)
 * 
 * @param command คำสั่งภาษา SQL
 * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.insert = async function
(
    command: InputCommand,
    value: InputValue = []
    
) : Promise<unknown>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }
    try
    {
        const raw = await client.execute<ResultSetHeader> (command, value);
        const id = raw [0].insertId;

        return id;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการแทรกข้อมูลหลายจำนวนลงไปในหลายตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นรหัสกุญแจหลัก (PRIMARY KEY)
 * 
 * @param command คำสั่งภาษา SQL
 * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.insertMultiple =  async function
(
    command: InputCommand,
    field: InputValue = []
    
) : Promise<unknown []>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }
    try
    {
        const raw = await client.query<ResultSetHeader[]> (command, field);
        const ids = raw [0].map ((x) => x.insertId);

        return ids;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการแก้ไขข้อมูลหนึ่งจำนวน (หรือมากกว่า) ลงไปในหนึ่งตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
 * 
 * @param command คำสั่งภาษา SQL
 * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.update = async function
(
    command: InputCommand, 
    field: InputValue = []

) : Promise<number>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }
    try
    {
        const raw = await client.execute<ResultSetHeader> (command, field);
        const affected = raw [0].affectedRows;

        return affected;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการแก้ไขข้อมูลหนึ่งจำนวน (หรือมากกว่า) ลงไปในหลายตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
 * 
 * @param command คำสั่งภาษา SQL
 * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.updateMultiple = async function
(
    command: InputCommand, 
    value: InputValue = []

) : Promise<number[]>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }
    try
    {
        const raw = await client.query<ResultSetHeader[]> (command, value);
        const affected = raw [0].map ((x) => x.affectedRows);

        return affected;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการลบข้อมูลหนึ่งจำนวน (หรือมากกว่า) จากไปในหนึ่งตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
 * 
 * @param command คำสั่งภาษา SQL
 * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.delete = async function (
    command: InputCommand, 
    value: InputValue = []

) : Promise<number>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }
    try
    {
        const raw = await client.execute<ResultSetHeader> (command, value);
        const affected = raw [0].affectedRows;

        return affected;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการลบข้อมูลหนึ่งจำนวน (หรือมากกว่า) จากไปในหลายตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
 * 
 * @param command คำสั่งภาษา SQL
 * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.deleteMultiple = async function
(
    command: InputCommand, 
    value: InputValue = []

) : Promise<number[]>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }
    try
    {
        const raw = await client.query<ResultSetHeader[]> (command, value);
        const affected = raw [0].map ((x) => x.affectedRows);

        return affected;
    }
    catch (info: unknown)
    {
        throw mediate (info as ResultError);
    }
}
/**
 * เริ่มการทำงานรูปแบบธุรกรรม (transaction) 
 * โดยมีการจบการทำงาน (commit) และยกเลิกการทำงาน (rollback)
*/
content.transaction = async function ()
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw error.NOT_AVAILABLE;
    }

    const subject = await client.getConnection ().catch ((info: unknown) => 
    {
        throw mediate (info as ResultError);
    });
    
    try
    {
        await subject.beginTransaction ();

        const instance: ResultTransaction = 
        {
            commit () { return subject.commit () },
            rollback () { return subject.rollback () },
            release () { subject.release (); },
        };
        Object.freeze (instance);
        return instance;
    }
    catch (info: unknown)
    {
        subject.release ();
        throw mediate (info as ResultError);
    }
}
Object.freeze (content);
export default content;