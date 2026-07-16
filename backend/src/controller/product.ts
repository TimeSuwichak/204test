import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts";
import objectReader from "#core/object.reader.ts";
import model        from "#model/product.ts";
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
from "#model/product.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("Auth");
/**
 * ระบบจัดการสินค้า
*/
const content = function ()
{
    return;
}
/**
 * ดึงข้อมูลสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.get = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    
    if (!Number.isSafeInteger (productId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.get (productId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.end ({
            "Id": x.id,
            "Name": x.name,
            "Description": x.description,
        });
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
 * แก้ไขสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.put = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    let input: DataUpdate;

    if (!Number.isSafeInteger (productId) ||
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
            id: productId,
            name: reader.requireString ("Name"),
            description: reader.requireString ("Description"),
            price: reader.requireInteger ("Price"),
            priceCode: reader.requireInteger ("PriceCode"),
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
 * เพิ่มสินค้าดังกล่าว
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
            name: reader.requireString ("Name"),
            description: reader.requireString ("Description"),
            price: reader.requireInteger ("Price"),
            priceCode: reader.requireInteger ("PriceCode"),
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
        response.end ({
            "Id": x,
            "Created": new Date ().getTime ()
        });
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
 * ลบสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.delete = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (productId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.delete (productId).then (() =>
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