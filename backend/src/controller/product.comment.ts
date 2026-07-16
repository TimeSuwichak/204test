import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts";
import objectReader from "#core/object.reader.ts";
import auth         from "#controller/auth.ts";
import model        from "#model/product.comment.ts";
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
from "#model/product.comment.ts";
/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("ProductComment");
/**
 * ระบบจัดการหมวดหมู่ให้กับสินค้า
*/
const content = () =>
{
    return;
}
/**
 * ดึงข้อมูลความคิดเห็นของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.get = (request: Request, response: Response) =>
{
    const commentId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (commentId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.get (commentId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.end ({
            "CommentId": x.commentId,
            "ProductId": x.productId,
            "Author": x.author,
            "Title": x.title,
            "Text": x.text,
            "Rating": x.rating,
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
 * แก้ไขเนื้อหาของความคิดเห็นในสินค้าดังกล่าว
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
            commentId: categoryId,
            title: reader.requireString ("Title"),
            text: reader.requireString ("Text"),
            rating: reader.requireInteger ("Rating")
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
 * สร้างเนื้อหาความคิดเห็นใหม่
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.post = (request: Request, response: Response) =>
{
    const authorId = auth.validateResult (response).id;
    let input: DataCreate;

    try
    {
        const reader = objectReader (request.body);
        input = 
        {
            productId: reader.requireInteger ("ProductId"),
            author: authorId,
            title: reader.requireString ("Title"),
            text: reader.requireString ("Text"),
            rating: reader.requireInteger ("Rating"),
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
 * ลบความคิดเห็นออกจากสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.delete = (request: Request, response: Response) =>
{
    const commentId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (commentId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.delete (commentId).then (() =>
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