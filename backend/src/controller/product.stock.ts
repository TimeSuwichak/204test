import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts";
import objectReader from "#core/object.reader.ts";
import model        from "#model/product.stock.ts";
import
{
    type Request,
    type Response
}
from "#core/http.ts";
import
{
    type DataUpdate,
}
from "#model/product.stock.ts";
/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("ProductStock");
/**
 * ระบบจัดการสต็อกให้กับสินค้า
*/
const content = () =>
{
    return;
}
/**
 * ดึงข้อมูลสต็อกของสินค้าดังกล่าว
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
        response.json ({
            "ProductId": x.productId,
            "Quantity": x.quantity,
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
 * แก้ไขสต็อกของสินค้าดังกล่าว
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
            productId: productId,
            quantity: reader.optionalInteger ("Quantity"),
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
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;