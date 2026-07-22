import error from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import sql from "#core/sql.ts";

import { type InputCommand, type InputValue } from "#core/sql.ts";
import { type ObjectReader } from "#core/object.reader.ts";
import { type BasicId as OrderId } from "#model/order.ts";

/**
 * ระบบจัดการข้อมูลการร้องเรียน / สอบถาม (Inquiry)
 */
const content = () =>
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
}

/**
 * เริ่มต้นการทำงานของระบบ
 */
content.init = async () =>
{
    return Promise.resolve ();
}

/**
 * ยุติการทำงานของระบบ
 */
content.terminate = () =>
{
    return;
}

/**
 * ดึงข้อมูลการร้องเรียนตามรหัสที่ระบุ
 * 
 * @param key รหัสรายการร้องเรียน
 */
content.getBasic = async (key: BasicId) : Promise<BasicFetch> =>
{
    const cmd = `SELECT * FROM Inquiry WHERE InquiryId = ?`;
    const param = [key];
    const query = await sql.select (cmd, param);

    if (query.length === 0) {
        throw new error.NotFound (`ไม่พบข้อมูลการร้องเรียน: ${String (key)}`);
    }

    return content.readBasic (objectReader (query [0]));
}

/**
 * ดึงรายการข้อมูลการร้องเรียนทั้งหมดในระบบ
 */
content.getBasicList = async () : Promise<BasicFetch []> =>
{
    const query = await sql.select (`SELECT * FROM Inquiry`);

    return query.map ((x) =>
    {
        return content.readBasic (objectReader (x));
    });
}

/**
 * ดึงรายการข้อมูลการร้องเรียนตามคำสั่งซื้อ (Order)
 * 
 * @param key รหัสคำสั่งซื้อ
 */
content.getListByOrder = async (key: OrderId) : Promise<BasicFetch []> =>
{
    const cmd = `SELECT * FROM Inquiry WHERE OrderId = ?`;
    const param = [key];
    const query = await sql.select (cmd, param);

    return query.map ((x) =>
    {
        return content.readBasic (objectReader (x));
    });
}

/**
 * แก้ไขข้อมูลการร้องเรียน (เช่น เปลี่ยนสถานะ)
 * 
 * @param info ข้อมูลที่ต้องการแก้ไข
 */
content.updateBasic = async (info: BasicUpdate) : Promise<void> =>
{
    const fields: InputCommand [] = [];
    const values: InputValue = [];

    if (info.status !== undefined) {
        fields.push ("`Status` = ?");
        values.push (info.status);
    }

    if (fields.length === 0) {
        return;
    }

    values.push (info.inquiryId);

    const result = await sql.update (
        `UPDATE \`Inquiry\` SET ${fields.join (", ")} WHERE \`InquiryId\` = ?`,
        values
    );

    if (result === 0) {
        throw new error.NotFound (`ไม่พบข้อมูลการร้องเรียน: ${String (info.inquiryId)}`);
    }
}

/**
 * สร้างรายการร้องเรียนใหม่เข้าสู่ระบบ
 * 
 * @param info ข้อมูลสำหรับสร้างรายการร้องเรียน
 */
content.createBasic = async (info: BasicCreate) : Promise<BasicId> =>
{
    const id = await sql.insert (`
        INSERT INTO Inquiry (OrderId, Type, Title, Text, Status)
        VALUES (?, ?, ?, ?, ?)`,
        [
            info.orderId ?? null,
            info.type,
            info.title,
            info.text,
            info.status
        ]
    ) as BasicId;

    return id;
}

/**
 * ลบข้อมูลการร้องเรียนออกจากระบบ
 * 
 * @param key รหัสรายการร้องเรียน
 */
content.delete = async (key: BasicId) : Promise<void> =>
{
    const result = await sql.delete (`
        DELETE FROM Inquiry 
        WHERE InquiryId = ?`,
        [key]
    );

    if (result === 0) {
        throw new error.NotFound (`ไม่พบข้อมูลการร้องเรียน: ${String (key)}`);
    }
}

/**
 * แปลงข้อมูลจาก ObjectReader เป็น Object โครงสร้าง BasicFetch
 */
content.readBasic = (reader: ObjectReader) : BasicFetch =>
{
    return {
        inquiryId: reader.requireInteger ("InquiryId"),
        orderId: reader.requireIntegerOrNull ("OrderId"),
        type: reader.requireInteger ("Type"),
        title: reader.requireString ("Title"),
        text: reader.requireString ("Text"),
        status: reader.requireInteger ("Status")
    };
}

/**
 * ประเภทการร้องเรียน: สอบถามทั่วไป
 */
content.TYPE_GENERAL = 1;
/**
 * ประเภทการร้องเรียน: ปัญหาคำสั่งซื้อ / สินค้า
 */
content.TYPE_ORDER = 2;
/**
 * ประเภทการร้องเรียน: แจ้งปัญหาการชำระเงิน
 */
content.TYPE_PAYMENT = 3;

/**
 * รายการประเภทการร้องเรียนทั้งหมดในระบบ
 */
content.TYPE_LIST = [
    content.TYPE_GENERAL,
    content.TYPE_ORDER,
    content.TYPE_PAYMENT
];

/**
 * สถานะการร้องเรียน: รอดำเนินการ
 */
content.STATUS_PENDING = 0;
/**
 * สถานะการร้องเรียน: กำลังตรวจสอบ
 */
content.STATUS_IN_PROGRESS = 1;
/**
 * สถานะการร้องเรียน: ดำเนินการเสร็จสิ้น
 */
content.STATUS_RESOLVED = 2;
/**
 * สถานะการร้องเรียน: ปฏิเสธ / ยกเลิก
 */
content.STATUS_REJECTED = 3;

/**
 * รายการสถานะการร้องเรียนทั้งหมดในระบบ
 */
content.STATUS_LIST = [
    content.STATUS_PENDING,
    content.STATUS_IN_PROGRESS,
    content.STATUS_RESOLVED,
    content.STATUS_REJECTED
];

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลการร้องเรียน
 */
export interface BasicFetch
{
    /**
     * รหัสรายการร้องเรียน
     */
    readonly inquiryId: BasicId;
    /**
     * รหัสคำสั่งซื้อ (ถ้ามี)
     */
    readonly orderId: OrderId | null;
    /**
     * ประเภทการสอบถาม
     */
    readonly type: number;
    /**
     * เรื่องที่สอบถาม
     */
    readonly title: string;
    /**
     * เนื้อหาการร้องเรียน
     */
    readonly text: string;
    /**
     * สถานะการร้องเรียน
     */
    readonly status: number;
}

/**
 * โครงสร้างข้อมูลที่ใช้ในการแก้ไขรายการร้องเรียน
 */
export interface BasicUpdate
{
    /**
     * รหัสรายการร้องเรียน
     */
    inquiryId: BasicId;
    /**
     * สถานะการร้องเรียน
     */
    status ?: number | undefined;
}

/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างรายการร้องเรียน
 */
export interface BasicCreate
{
    /**
     * รหัสคำสั่งซื้อ (ไม่บังคับ)
     */
    readonly orderId ?: OrderId | null | undefined;
    /**
     * ประเภทการสอบถาม
     */
    readonly type: number;
    /**
     * เรื่องที่สอบถาม
     */
    readonly title: string;
    /**
     * เนื้อหาการร้องเรียน
     */
    readonly text: string;
    /**
     * สถานะการร้องเรียน
     */
    readonly status: number;
}

/**
 * รหัสของชุดรหัสข้อมูล (PRIMARY KEY)
 */
export type BasicId = number;

/**
 * ส่งออกตัวแปร
 */
export default content;