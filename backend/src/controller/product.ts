import http from "#core/http.ts";
import error from "#core/error.ts";
import logging from "#core/log.ts";
import objReader from "#core/objectReader.ts";
import model from "#model/product.ts";
import
{
    type AccountId
}
from "#model/account.ts"
import 
{ 
    type Request, 
    type Response 
} 
from "#core/http.ts";

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
content.getProduct = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);

    if (id === 0 || !Number.isSafeInteger (id))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getBasic (id).then ((x) =>
    {
        void x;
        response.status (http.STATUS_OK);
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
        if (e instanceof error.Conflict)
        {
            response.status (http.STATUS_CONFLICT);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}
content.getProductPreview = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);
    const pid = Number (request.params ["pid"]);

    if (id === 0 || !Number.isSafeInteger (id) ||
        pid === 0 || !Number.isSafeInteger (pid))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getPreview (id, pid).then ((x) =>
    {
        void x;
        response.status (http.STATUS_OK);
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
        if (e instanceof error.Conflict)
        {
            response.status (http.STATUS_CONFLICT);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}
content.getProductComment = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);
    const cid = Number (request.params ["cid"]);

    if (id === 0 || !Number.isSafeInteger (id) ||
        cid === 0 || !Number.isSafeInteger (cid))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getComment (id, cid).then ((x) =>
    {
        void x;
        response.status (http.STATUS_OK);
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
        if (e instanceof error.Conflict)
        {
            response.status (http.STATUS_CONFLICT);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}


content.putProduct = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.putProductPreview = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.putProductComment = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}


content.postProduct = (request: Request, response: Response) =>
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let name: string;
    let description: string;
    let price: number;
    let priceCode: string;

    try
    {
        const reader = objReader (request.body);

        name = reader.requireString ("Name");
        description = reader.requireString ("Description");
        price = reader.requireFloat ("Price");
        priceCode = reader.requireString ("PriceCode");
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.create ({
        name: name,
        description: description,
        price: price,
        priceCode: priceCode
    })
    .then (() =>
    {
        response.status (http.STATUS_CREATED);
        response.end ();
    })
    .catch ((e: unknown) =>
    {
        log.error (e);

        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    });
}
content.postProductPreview = (request: Request, response: Response) =>
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    const inherited = Number (request.params ["id"]);

    if (inherited == 0 || !Number.isSafeInteger (inherited))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    let mime: string;
    let link: string;

    try
    {
        const reader = objReader (request.body);

        mime = reader.requireString ("Mime");
        link = reader.requireString ("Link");
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createPreview ({
        inherited: inherited,
        mime: mime,
        link: link
    })
    .then (() =>
    {
        response.status (http.STATUS_CREATED);
        response.end ();
    })
    .catch ((e: unknown) =>
    {
        log.error (e);

        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    });
}
content.postProductComment = (request: Request, response: Response) =>
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    const inherited = Number (request.params ["id"]);

    if (inherited == 0 || !Number.isSafeInteger (inherited))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    let author: AccountId;
    let title: string;
    let text: string;
    let rating: number;

    try
    {
        const reader = objReader (request.body);

        title = reader.requireString ("Mime");
        text = reader.requireString ("Link");
        rating = reader.requireInteger ("Rating");

        author = 0;
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createComment ({
        inherited: inherited,
        author: author,
        title: title,
        text: text,
        rating: rating
    })
    .then (() =>
    {
        response.status (http.STATUS_CREATED);
        response.end ();
    })
    .catch ((e: unknown) =>
    {
        log.error (e);

        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    });
}

content.deleteProduct = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.deleteProductPreview = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.deleteProductComment = (request: Request, response: Response) =>
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;