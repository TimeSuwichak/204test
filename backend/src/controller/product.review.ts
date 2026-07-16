import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts";
import objectReader from "#core/object.reader.ts";
import model        from "#model/product.review.ts";
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
from "#model/product.review.ts";
/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("ProductReview");
/**
 * ระบบจัดการรีวิวให้กับสินค้า
*/
const content = () =>
{
    return;
}
/**
 * ดึงข้อมูลรีวิวของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.get = (request: Request, response: Response) =>
{
    const reviewId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (reviewId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.get (reviewId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.end ({
            "ReviewId": x.reviewId,
            "ProductId": x.productId,
            "Mime": x.mime,
            "Link": x.link,
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
 * แก้ไขรีวิวของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.put = (request: Request, response: Response) =>
{
    const reviewId = Number (request.params ["id"]);
    let input: DataUpdate;

    if (!Number.isSafeInteger (reviewId) ||
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
            reviewId: reviewId,
            mime: reader.requireString ("Mime"),
            link: reader.requireString ("Link"),
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
 * เพิ่มรีวิวให้กับสินค้าดังกล่าว
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
            productId: reader.requireInteger ("ProductId"),
            mime: reader.requireString ("Mime"),
            link: reader.requireString ("Link"),
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
 * ลบรีวิวออกจากสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.delete = (request: Request, response: Response) =>
{
    const reviewId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (reviewId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.delete (reviewId).then (() =>
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