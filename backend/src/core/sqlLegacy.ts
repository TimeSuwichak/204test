/**
 * 
 * ทำหน้าที่เป็นตัวแทนการเชื่อมต่อกับฐานข้อมูล SQL
 * 
*/
import dotenv   from "#core/env.ts"
import logging  from "#core/log.ts"
import impl, { type FieldPacket } from "mysql2/promise";

interface ErrorInterface
{
    code: string;
    sqlMessage: string;
}

let     cPool: impl.Pool | null = null;
let     cHost = "127.0.0.1";
let     cPort = "51100";
let     cUser = "root";
let     cPwd = "root";
let     cDb = "project";
const   log = logging.scoped ("Sql");

/**
 * เริ่มต้นการทำงานของระบบเชื่อมต่อ SQL
*/
const content = () => 
{
    cHost   = dotenv.getString ("SqlConnectAddress", "127.0.0.1");
    cPort   = dotenv.getString ("SqlConnectPort", "51001");
    cUser   = dotenv.getString ("SqlConnectUser", "project");
    cPwd    = dotenv.getString ("SqlConnectPassword", "project");
    cDb     = dotenv.getString ("SqlConnectDatabase", "project");
    cPool   = impl.createPool ({
        host: cHost,
        port: Number (cPort),
        user: cUser,
        password: cPwd,
        database: cDb,
        enableKeepAlive: true,
    });
    log.info ("Started");
};
/**
 * ข้อผิดพลาดเนื่องจากระบบไม่สามารถใช้งานได้
*/
content.ErrorUnavailable = class extends Error {};
/**
 * ข้อผิดพลาดจากสาเหตุที่ไม่รู้จัก
*/
content.ErrorUnknown = class extends Error {};
/**
 * ข้อผิดพลาดจากปัญหาความไม่ลงรอยกับข้อมูลในตาราง
 * เช่น ขาด Foreign-Key, หรือ การส่งค่า NULL ไปยังคอลัมน์ NOT-NULL
*/
content.ErrorConstraint = class extends Error {};
/**
 * ข้อผิดพลาดเนื่องจากข้อมูลที่ป้อนซ้ำกันกับข้อมูลอื่น ๆ ที่อยู่ในตาราง
*/
content.ErrorDuplicate = class extends Error {};
/**
 * ข้อผิดพลาดเนื่องคำสั่งภาษา SQL ไม่สมบูรณ์หรือไม่ถูกต้อง
*/
content.ErrorCommand = class extends Error {};

/**
 * ตรวจสอบว่าข้อผิดพลาดนั้นมาจากระบบนี้หรือไม่
*/
content.isError = (error: unknown) =>
{
    return error instanceof content.ErrorUnavailable ||
            error instanceof content.ErrorUnknown ||
            error instanceof content.ErrorConstraint ||
            error instanceof content.ErrorDuplicate ||
            error instanceof content.ErrorCommand;
}
/**
 * ตรวจสอบว่าข้อผิดพลาดนั้นเป็นเรื่องจาก Constraints หรือไม่
*/
content.isErrorConstraint = (error: unknown) =>
{
    return error instanceof content.ErrorConstraint;
}
/**
 * ตรวจสอบว่าข้อผิดพลาดนั้นเป็นเรื่องจากข้อมูลซ้ำกันหรือไม่
*/
content.isErrorDuplicate = (error: unknown) =>
{
    return error instanceof content.ErrorDuplicate;
}


/**
 * เริ่มการดึงหนนึ่งข้อมูลหรือชุดข้อมูลหลายจำนวน จากในตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นรายการข้อมูลที่ผู้ใช้ร้องขอ
 * 
 * @param command คำสั่งภาษา SQL
 * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการดึงข้อมูล
*/
content.select = (command: string, field: (string | number | Date | null)[] = []) : Promise<impl.RowDataPacket[]> =>
{
    if (cPool === null)
    {
        throw new content.ErrorUnavailable ("SQL connection isn't initialized");
    }
    return cPool.getConnection ().catch ((error: unknown) =>
    {
        throw catchError (error as ErrorInterface);
    })
    .then ((connection) =>
    {
        return connection.execute<impl.RowDataPacket[]> (command, field).then ((result: [impl.RowDataPacket[], FieldPacket[]]) =>
        {
            connection.release ();

            return result [0];
        })
        .catch ((error: unknown) =>
        {
            connection.release ();

            throw catchError (error as ErrorInterface);
        });
    });
};
/**
 * เริ่มการแทรกข้อมูลหนึ่งจำนวนลงไปในตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นรหัสกุญแจหลัก (PRIMARY KEY)
 * 
 * @param command คำสั่งภาษา SQL
 * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.insert = (command: string, field: (string | number | Date | null)[] = []) : Promise<number> =>
{    
    if (cPool === null)
    {
        throw new content.ErrorUnavailable ("SQL connection isn't initialized");
    }
    return cPool.getConnection ().catch ((error: unknown) =>
    {
        throw catchError (error as ErrorInterface);
    })
    .then ((connection) =>
    {
        return connection.execute<impl.ResultSetHeader> (command, field).then ((result) =>
        {
            connection.release ();

            return result [0].insertId;
        })
        .catch ((error: unknown) =>
        {
            connection.release ();

            throw catchError (error as ErrorInterface);
        });
    });
}
/**
 * เริ่มการแก้ไขข้อมูลหนึ่งจำนวน (หรือมากกว่า) ลงไปในตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
 * 
 * @param command คำสั่งภาษา SQL
 * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.update = (command: string, field: (string | number | Date | null)[] = []) : Promise<number> =>
{    
    if (cPool === null)
    {
        throw new content.ErrorUnavailable ("SQL connection isn't initialized");
    }
    return cPool.getConnection ().catch ((error: unknown) =>
    {
        throw catchError (error as ErrorInterface);
    })
    .then ((connection) =>
    {
        return connection.execute<impl.ResultSetHeader> (command, field).then ((result) =>
        {
            connection.release ();

            return result [0].affectedRows;
        })
        .catch ((error: unknown) =>
        {
            connection.release ();

            throw catchError (error as ErrorInterface);
        });
    });
}
/**
 * เริ่มการลบข้อมูลหนึ่งจำนวน (หรือมากกว่า) จากไปในตารางที่กำหนดไว้
 * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
 * 
 * @param command คำสั่งภาษา SQL
 * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
*/
content.delete = (command: string, field: (string | number | Date | null)[] = []) : Promise<number> =>
{    
    if (cPool === null)
    {
        throw new content.ErrorUnavailable ("SQL connection isn't initialized");
    }
    return cPool.getConnection ().catch ((error: unknown) =>
    {
        throw catchError (error as ErrorInterface);
    })
    .then ((connection) =>
    {
        return connection.execute<impl.ResultSetHeader> (command, field).then ((result) =>
        {
            connection.release ();

            return result [0].affectedRows;
        })
        .catch ((error: unknown) =>
        {
            connection.release ();

            throw catchError (error as ErrorInterface);
        });
    });
}
/**
 * เริ่มการทำงานรูปแบบธุรกรรม (transaction) 
 * โดยมีการจบการทำงาน (commit) และยกเลิกการทำงาน (rollback)
*/
content.transaction = async () =>
{
    if (cPool === null)
    {
        throw new content.ErrorUnavailable ("SQL connection isn't initialized");
    }
    return await cPool.getConnection ().then (async (subject) =>
    {
        await subject.beginTransaction ();
        return {
            /**
             * เริ่มการดึงหนนึ่งข้อมูลหรือชุดข้อมูลหลายจำนวน จากในตารางที่กำหนดไว้
             * คำสั่งนี้จะคืนค่าข้อมูลเป็นรายการข้อมูลที่ผู้ใช้ร้องขอ
             * 
             * @param command คำสั่งภาษา SQL
             * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการดึงข้อมูล 
            */
            select: (command: string, field: (string | number | Date | null)[] = []) : Promise<impl.RowDataPacket[]> =>
            {
                return subject.execute<impl.RowDataPacket[]> (command, field).then ((result: [impl.RowDataPacket[], FieldPacket[]]) =>
                {
                    return result [0];
                })
                .catch ((error: unknown) =>
                {
                    throw catchError (error as ErrorInterface);
                });
            },
            /**
             * เริ่มการแทรกข้อมูลหนึ่งจำนวนลงไปในตารางที่กำหนดไว้
             * คำสั่งนี้จะคืนค่าข้อมูลเป็นรหัสกุญแจหลัก (PRIMARY KEY)
             * 
             * @param command คำสั่งภาษา SQL
             * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
            */
            insert: (command: string, field: (string | number | Date | null)[] = []) : Promise<number> =>
            {    
                return subject.execute<impl.ResultSetHeader> (command, field).then ((result) =>
                {
                    return result [0].insertId;
                })
                .catch ((error: unknown) =>
                {
                    throw catchError (error as ErrorInterface);
                });
            },
            /**
             * เริ่มการแก้ไขข้อมูลหนึ่งจำนวน (หรือมากกว่า) ลงไปในตารางที่กำหนดไว้
             * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
             * 
             * @param command คำสั่งภาษา SQL
             * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
            */
            update: (command: string, field: (string | number | Date | null)[] = []) : Promise<number> =>
            {    
                return subject.execute<impl.ResultSetHeader> (command, field).then ((result) =>
                {
                    return result [0].affectedRows;
                })
                .catch ((error: unknown) =>
                {
                    throw catchError (error as ErrorInterface);
                });
            },
            /**
             * เริ่มการลบข้อมูลหนึ่งจำนวน (หรือมากกว่า) จากไปในตารางที่กำหนดไว้
             * คำสั่งนี้จะคืนค่าข้อมูลเป็นจำนวนข้อมูลที่ถูกกระทบ (affected rows)
             * 
             * @param command คำสั่งภาษา SQL
             * @param field ข้อมูลเพิ่มเติมที่ป้อนสำหรับการแทรกข้อมูล
            */
            delete: (command: string, field: (string | number | Date | null)[] = []) : Promise<number> =>
            {    
                return subject.execute<impl.ResultSetHeader> (command, field).then ((result) =>
                {
                    return result [0].affectedRows;
                })
                .catch ((error: unknown) =>
                {
                    throw catchError (error as ErrorInterface);
                });
            },
            /**
             * จบการทำงานในรูปแบบธุรกรรม (transaction)
             * และข้อมูลทั้งหมดที่ถูกเขียนบนธุรกรรมจะถูกบันทึกลงในฐานข้อมูล
            */
            commit: () => subject.commit (),
            /**
             * ยกเลิกการทำงานในรูปแบบธุรกรรม (transaction)
             * ทำให้ข้อมูลในธุรกรรมจะถูกทิ้งทั้งหมด
            */
            rollback: () => subject.rollback (),
            /**
             * ปล่อยการเชื่อมต่อกลับไปยังกลุ่มการเชื่อมต่อ (connnection pool)
             * เพื่อให้ระบบอื่น ๆ สามารถนำการเชื่อมต่อนี้ไปใช้งานต่อได้
            */
            release: () => { subject.release (); },
        }
    })
    .catch ((error: unknown) =>
    {
        throw catchError (error as ErrorInterface);
    })
}

/**
 * ดักจับข้อผิดพลาดที่เกิดขึ้นในระหว่างการทำงานของคำสั่ง
*/
function catchError (error: ErrorInterface)
{
    switch (error.code)
    {
        case "ER_DUP_ENTRY": return new content.ErrorDuplicate (error.sqlMessage, { cause: error });
        case "ER_NO_REFERENCED_ROW": return new content.ErrorConstraint (error.sqlMessage, { cause: error });
        case "ER_NO_REFERENCED_ROW_2": return new content.ErrorConstraint (error.sqlMessage, { cause: error });
        case "ER_PARSE_ERROR": return new content.ErrorCommand (error.sqlMessage, { cause: error });
        case "ER_BAD_FIELD_ERROR": return new content.ErrorCommand (error.sqlMessage, { cause: error });
    }
    log.error (`Unhandled error: ${JSON.stringify (error)}`);

    return new content.ErrorUnknown ("Unknown error has occurred during SQL query command", { cause: error });
}

Object.freeze (content);
export default content;