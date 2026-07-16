import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts";
import objectReader from "#core/object.reader.ts";
import model        from "#model/product.category.ts";
import
{
    type Request,
    type Response
}
from "#core/http.ts";
import
{
    type DataUpdate,
    type DataCreate,
}
from "#model/product.category.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("ProductCategory");
/**
 * ระบบจัดการหมวดหมู่ให้กับสินค้า
*/
const content = () =>
{
    return;
}
/**
 * ดึงข้อมูลหมวดหมู่ของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.get = (request: Request, response: Response) =>
{
    const categoryId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (categoryId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.get (categoryId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "CategoryId": x.categoryId,
            "ProductId": x.productId,
            "Value": x.value,
        });
        response.end ();
    })
    .catch ((e: unknown) =>
    {
        if (e instanceof error.NotFound)
        {
            response.status (http.STATUS_NOT_FOUND);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}
/**
 * แก้ไขหมวดหมู่ของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.put = (request: Request, response: Response) =>
{
    const categoryId = Number (request.params ["id"]);
    let input: DataUpdate;

    if (!Number.isSafeInteger (categoryId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    try
    {
        const reader = objectReader (request.body);
        input = 
        {
            categoryId: categoryId,
            value: reader.optionalInteger ("Value")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.update (input).then (() =>
    {
        response.status (http.STATUS_NO_CONTENT);
        response.end ();
        return;
    })
    .catch ((e: unknown) =>
    {
        if (e instanceof error.NotFound)
        {
            response.status (http.STATUS_NOT_FOUND);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}
/**
 * เพิ่มหมวดหมู่ให้กับสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.post = (request: Request, response: Response) =>
{
    let input: DataCreate;

    try
    {
        const reader = objectReader (request.body);
        input = 
        {
            productId:  reader.requireInteger ("ProductId"),
            value: reader.requireInteger ("Value")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.create (input).then ((x) =>
    {
        response.status (http.STATUS_CREATED);
        response.json ({
            "Id": x,
            "Created": new Date ().getTime ()
        });
        response.end ();
        return;
    })
    .catch ((e: unknown) =>
    {
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}
/**
 * ลบหมวดหมู่ออกจากสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.delete = (request: Request, response: Response) =>
{
    const categoryId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (categoryId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.delete (categoryId).then (() =>
    {
        response.status (http.STATUS_NO_CONTENT);
        response.end ();
    })
    .catch ((e: unknown) =>
    {
        if (e instanceof error.NotFound)
        {
            response.status (http.STATUS_NOT_FOUND);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;