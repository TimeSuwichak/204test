import error            from "#core/error.ts";
import http             from "#core/http.ts";
import logging          from "#core/log.ts";
import objectReader     from "#core/object.reader.ts";
import model            from "#model/promotion.ts";
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
from "#model/promotion.ts";

const log = logging.scoped ("Promotion");

const content = function ()
{
    return;
}

content.getBasic = (request: Request, response: Response) =>
{
    const promotionId = String (request.params ["id"]);

    void model.getBasic (promotionId).then ((x) =>
    {
        content.outputGetBasic (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasic (response, e);
    });
}

content.getBasicList = (request: Request, response: Response) =>
{
    void model.getBasicList ().then ((x) =>
    {
        content.outputGetBasicList (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasicList (response, e);
    });
}

content.putBasic = (request: Request, response: Response) =>
{
    const promotionId = String (request.params ["id"]);
    let input: BasicUpdate;

    try
    {
        input = content.inputPutBasic (request, promotionId);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateBasic (input).then (() =>
    {
        content.outputPutBasic (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutBasic (response, e);
    });
}

content.postBasic = (request: Request, response: Response) =>
{
    let input: BasicCreate;

    try
    {
        input = content.inputPostBasic (request);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.create (input).then ((x) =>
    {
        content.outputPostBasic (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorPostBasic (response, e);
    });
}

content.deleteBasic = (request: Request, response: Response) =>
{
    const promotionId = String (request.params ["id"]);

    void model.delete (promotionId).then (() =>
    {
        content.outputDeleteBasic (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorDeleteBasic (response, e);
    });
}

content.inputPutBasic = (r: Request, id: BasicId) : BasicUpdate =>
{
    const reader = objectReader (r.body);
    const result: BasicUpdate =
    {
        id: id,
        expire: reader.optionalDate ("Expire"),
        type: reader.optionalInteger ("Type"),
        discount: reader.optionalInteger ("Discount"),
        minPrice: reader.optionalFloat ("MinPrice"),
        maxDiscount: reader.optionalFloat ("MaxDiscount")
    };
    return result;
}

content.inputPostBasic = (r: Request) : BasicCreate =>
{
    const reader = objectReader (r.body);
    const result: BasicCreate =
    {
        id: reader.requireString ("Id"),
        expire: reader.requireDate ("Expire"),
        type: reader.requireInteger ("Type"),
        discount: reader.requireInteger ("Discount"),
        minPrice: reader.requireFloat ("MinPrice"),
        maxDiscount: reader.requireFloat ("MaxDiscount")
    };
    return result;
}

content.outputGetBasic = (r: Response, x: BasicFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Id": x.id,
        "Created": x.created.getTime (),
        "Expire": x.expire.getTime (),
        "Type": x.type,
        "Discount": x.discount,
        "MinPrice": x.minPrice,
        "MaxDiscount": x.maxDiscount
    });
    r.end ();
}

content.outputGetBasicList = (r: Response, x: BasicFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((item) => ({
            "Id": item.id,
            "Created": item.created.getTime (),
            "Expire": item.expire.getTime (),
            "Type": item.type,
            "Discount": item.discount,
            "MinPrice": item.minPrice,
            "MaxDiscount": item.maxDiscount
        }))
    });
    r.end ();
}

content.outputPutBasic = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}

content.outputPostBasic = (r: Response, id: BasicId) =>
{
    r.status (http.STATUS_CREATED);
    r.json ({
        "Id": id,
        "Created": new Date ().getTime ()
    });
    r.end ();
}

content.outputDeleteBasic = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}

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

content.errorPostBasic = (r: Response, e: unknown) =>
{
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

export default content;