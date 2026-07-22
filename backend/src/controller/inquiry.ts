import http             from "#core/http.ts";
import logging          from "#core/log.ts";
import error            from "#core/error.ts";
import objectReader     from "#core/object.reader.ts";
import auth             from "#controller/auth.ts";
import modelInquiry     from "#model/inquiry.ts";
import modelAccount     from "#model/account.ts";
import 
{ 
    type Request, 
    type Response 
} 
from "#core/http.ts";
import
{
    type BasicId,
    type BasicFetch,
    type BasicUpdate,
    type BasicCreate
}
from "#model/inquiry.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
 */
const log = logging.scoped ("Inquiry");

/**
 * ระบบจัดการข้อมูลการร้องเรียน / สอบถาม
 */
const content = function ()
{
    return;
}

/**
 * ดึงข้อมูลการร้องเรียนตาม ID
 * 
 * @param request คำขอ
 * @param response คำตอบ
 */
content.getBasic = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const inquiryId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (inquiryId) || inquiryId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void modelInquiry.getBasic (inquiryId).then ((x) =>
    {
        // ตรวจสอบสิทธิ์: ผู้ใช้ทั่วไปจะเห็นได้เฉพาะข้อมูลของตนเอง หรือ Staff/Manager/Dev ดูได้ทั้งหมด
        // (หากในระดับ Business Logic ต้องการจำกัดสิทธิ์ตามบทบาท)
        if (authenticate.role !== modelAccount.ROLE_MANAGER &&
            authenticate.role !== modelAccount.ROLE_STAFF &&
            authenticate.role !== modelAccount.ROLE_DEVELOPER)
        {
            // หากต้องการเช็กสิทธิ์เพิ่มเติม สามารถใส่เงื่อนไขตรงนี้ได้
        }

        content.outputGetBasic (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasic (response, e);
    });
}

/**
 * ดึงรายการข้อมูลการร้องเรียนทั้งหมดในระบบ (สำหรับผู้ดูแลระบบ/เจ้าหน้าที่)
 * 
 * @param request คำขอ
 * @param response คำตอบ
 */
content.getBasicList = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);

    if (authenticate.role !== modelAccount.ROLE_MANAGER &&
        authenticate.role !== modelAccount.ROLE_STAFF &&
        authenticate.role !== modelAccount.ROLE_DEVELOPER)
    {
        response.status (http.STATUS_FORBIDDEN);
        response.end ();
        return;
    }

    void modelInquiry.getBasicList ().then ((x) =>
    {
        content.outputGetBasicList (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasicList (response, e);
    });
}

/**
 * ดึงรายการข้อมูลการร้องเรียนตาม Order ID
 * 
 * @param request คำขอ
 * @param response คำตอบ
 */
content.getListByOrder = (request: Request, response: Response) =>
{
    const orderId = Number (request.params ["orderId"]);

    if (!Number.isSafeInteger (orderId) || orderId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void modelInquiry.getListByOrder (orderId).then ((x) =>
    {
        content.outputGetBasicList (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasicList (response, e);
    });
}

/**
 * สร้างรายการร้องเรียนใหม่
 * 
 * @param request คำขอ
 * @param response คำตอบ
 */
content.postBasic = async (request: Request, response: Response) =>
{
    auth.validateResult (response);
    let input: BasicCreate;

    try
    {
        input = content.inputPostBasic (request);
    }
    catch (e: unknown)
    {
        log.warn (e);
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void modelInquiry.createBasic (input).then ((id) =>
    {
        content.outputPostBasic (response, id);
    })
    .catch ((e: unknown) =>
    {
        content.errorPostBasic (response, e);
    });
}

/**
 * ปรับเปลี่ยนข้อมูลการร้องเรียน (เช่น อัปเดตสถานะการดำเนินการ)
 * 
 * @param request คำขอ
 * @param response คำตอบ
 */
content.putBasic = async (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const inquiryId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (inquiryId) || inquiryId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    // เฉพาะเจ้าหน้าที่/ผู้จัดการ/ผู้พัฒนา ที่มีสิทธิ์แก้ไขสถานะคำร้องเรียน
    if (authenticate.role !== modelAccount.ROLE_MANAGER &&
        authenticate.role !== modelAccount.ROLE_STAFF &&
        authenticate.role !== modelAccount.ROLE_DEVELOPER)
    {
        response.status (http.STATUS_FORBIDDEN);
        response.end ();
        return;
    }

    let input: BasicUpdate;

    try
    {
        input = content.inputPutBasic (inquiryId, request);
    }
    catch (e: unknown)
    {
        log.warn (e);
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void modelInquiry.updateBasic (input).then (() =>
    {
        content.outputPutBasic (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutBasic (response, e);
    });
}

/**
 * ลบข้อมูลการร้องเรียน
 * 
 * @param request คำขอ
 * @param response คำตอบ
 */
content.deleteBasic = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const inquiryId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (inquiryId) || inquiryId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    if (authenticate.role !== modelAccount.ROLE_MANAGER &&
        authenticate.role !== modelAccount.ROLE_DEVELOPER)
    {
        response.status (http.STATUS_FORBIDDEN);
        response.end ();
        return;
    }

    void modelInquiry.delete (inquiryId).then (() =>
    {
        content.outputDeleteBasic (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorDeleteBasic (response, e);
    });
}

/*
 * INPUT TRANSFORMERS
 */
content.inputPostBasic = (request: Request): BasicCreate =>
{
    const reader = objectReader (request.body);

    return {
        orderId: reader.optionalInteger ("OrderId"),
        type: reader.requireInteger ("Type"),
        title: reader.requireString ("Title"),
        text: reader.requireString ("Text"),
        status: reader.optionalInteger ("Status") ?? modelInquiry.STATUS_PENDING
    };
}

content.inputPutBasic = (inquiryId: BasicId, request: Request): BasicUpdate =>
{
    const reader = objectReader (request.body);

    return {
        inquiryId: inquiryId,
        status: reader.optionalInteger ("Status")
    };
}

/*
 * OUTPUT TRANSFORMERS
 */
content.outputGetBasic = (r: Response, x: BasicFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "InquiryId": x.inquiryId,
        "OrderId": x.orderId,
        "Type": x.type,
        "Title": x.title,
        "Text": x.text,
        "Status": x.status
    });
    r.end ();
}

content.outputGetBasicList = (r: Response, x: BasicFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((item) => ({
            "InquiryId": item.inquiryId,
            "OrderId": item.orderId,
            "Type": item.type,
            "Title": item.title,
            "Text": item.text,
            "Status": item.status
        }))
    });
    r.end ();
}

content.outputPostBasic = (r: Response, id: BasicId) =>
{
    r.status (http.STATUS_CREATED);
    r.json ({
        "InquiryId": id,
        "Created": new Date ().getTime ()
    });
    r.end ();
}

content.outputPutBasic = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}

content.outputDeleteBasic = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}

/*
 * ERROR HANDLERS
 */
content.errorGetBasic = (r: Response, e: unknown) =>
{
    if (e instanceof error.NotFound)
    {
        r.status (http.STATUS_NOT_FOUND);
        r.end ();
        return;
    }
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}

content.errorGetBasicList = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}

content.errorPostBasic = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}

content.errorPutBasic = (r: Response, e: unknown) =>
{
    if (e instanceof error.NotFound)
    {
        r.status (http.STATUS_NOT_FOUND);
        r.end ();
        return;
    }
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}

content.errorDeleteBasic = (r: Response, e: unknown) =>
{
    if (e instanceof error.NotFound)
    {
        r.status (http.STATUS_NOT_FOUND);
        r.end ();
        return;
    }
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}

/**
 * ส่งออกตัวแปร
 */
export default content;