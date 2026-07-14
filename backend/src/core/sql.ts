import env      from "#core/env.ts";
import logging  from "#core/log.ts";
import error    from "#core/error.ts";
import mysql    from "mysql2/promise";
import
{
    type FieldPacket,
    type ResultSetHeader,
    type RowDataPacket 
}
from "mysql2/promise";

export type InputCommand = string;
export type InputValue = (string | number | Date | null) [];

interface ResultTransaction
{
    /**
    * เริ่มการดึงหนนึ่งข้อมูล จากในตารางที่กำหนดไว้
    * คำสั่งนี้จะคืนค่าข้อมูลเป็นรายการข้อมูลที่ผู้ใช้ร้องขอ
    * 
    * @param command คำสั่งภาษา SQL
    * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการดึงข้อมูล
    */
    select: (
        command: InputCommand, 
        value: InputValue
    ) => Promise<Record<string, unknown>[]>;
    /**
     * เริ่มการแทรกข้อมูลหนึ่งจำนวนลงไปในตารางที่กำหนดไว้
     * คำสั่งนี้จะคืนค่าข้อมูลเป็นรหัสกุญแจหลัก (PRIMARY KEY)
     * 
     * @param command คำสั่งภาษา SQL
     * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
    */
    insert: (
        command: InputCommand,
        value: InputValue
    ) => Promise<unknown>;
    /**
     * เริ่มการแก้ไขข้อมูลหนึ่งจำนวน (หรือมากกว่า) ลงไปในหนึ่งตารางที่กำหนดไว้
     * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
     * 
     * @param command คำสั่งภาษา SQL
     * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
    */
   update: (
        command: InputCommand,
        value: InputValue
   ) => Promise<number>;
    /**
     * เริ่มการลบข้อมูลหนึ่งจำนวน (หรือมากกว่า) จากไปในหนึ่งตารางที่กำหนดไว้
     * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
     * 
     * @param command คำสั่งภาษา SQL
     * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
    */
    delete: (
        command: InputCommand,
        value: InputValue
    ) => Promise<number>;
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
const mediate = function (info: ResultError) : Error
{
    switch (info.code)
    {
        case "ER_DUP_ENTRY": 
            return new error.Duplicate (info.sqlMessage, { cause: info });
        case "ER_NO_REFERENCED_ROW":
        case "ER_NO_REFERENCED_ROW_2":
            return new error.Constraint (info.sqlMessage, { cause: info }); 
        case "ER_PARSE_ERROR":
        case "ER_BAD_FIELD_ERROR":
            return new error.Command (info.sqlMessage, { cause: info }); 
        case "ER_NO_SUCH_TABLE": 
            return new error.NotFound (info.sqlMessage, { cause: info }); 
        case "ER_ACCESS_DENIED_ERROR": 
        case "ER_DBACCESS_DENIED_ERROR":
            return new error.NotAuthorized (info.sqlMessage, { cause: info }); 
        case "ECONNREFUSED":
        case "CR_CONNECTION_ERROR":
            return new error.Network (info.sqlMessage, { cause: info }); 
        case "ER_CON_COUNT_ERROR":
            return new error.NetworkLimit (info.sqlMessage, { cause: info });
        case "CR_SERVER_GONE_AWAY":
            return new error.NetworkGone (info.sqlMessage, { cause: info });
        default:
            return new error.Unknown (info.sqlMessage, { cause: info }); 
    }
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
    
    client = mysql.createPool ({
        host: host,
        port: port,
        database: data,
        user: user,
        password: pwd,
        enableCleartextPlugin: false,
        enableKeepAlive: true,
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
        throw new error.NotAvailable ();
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
        throw new error.NotAvailable ();
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
 * เริ่มการแก้ไขข้อมูลหนึ่งจำนวน (หรือมากกว่า) ลงไปในหนึ่งตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
 * 
 * @param command คำสั่งภาษา SQL
 * @param value ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.update = async function
(
    command: InputCommand, 
    value: InputValue = []

) : Promise<number>
{
    if (!client) 
    {
        //
        // ระบบไม่สามารถใช้งานได้
        //
        throw new error.NotAvailable ();
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
        throw new error.NotAvailable ();
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
        throw new error.NotAvailable ();
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
            select (command, value) 
            {
                return subject.execute <RowDataPacket[]> 
                    (command, value)
                    .then ((x) => x [0])
                    .catch ((x: unknown) => {
                        throw mediate (x as ResultError);
                    });
            },
            insert (command, value) 
            {
                return subject.execute <ResultSetHeader> (command, value)
                    .then ((x) => x [0].affectedRows)
                    .catch ((x: unknown) => { 
                        throw mediate (x as ResultError); 
                    });
            },
            update (command, value) 
            {
                return subject.execute <ResultSetHeader> (command, value)
                    .then ((x) => x [0].affectedRows)
                    .catch ((x: unknown) => { 
                        throw mediate (x as ResultError); 
                    });
            },
            delete (command, value) 
            {
                return subject.execute <ResultSetHeader> (command, value)
                    .then ((x) => x [0].affectedRows)
                    .catch ((x: unknown) => { 
                        throw mediate (x as ResultError); 
                    });
            },
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
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;