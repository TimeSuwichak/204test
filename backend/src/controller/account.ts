import http         from "#core/http.ts";
import logging      from "#core/log.ts"
import error        from "#core/error.ts";
import objectReader from "#core/object.reader.ts";
import auth         from "#controller/auth.ts";
import model        from "#model/account.ts";
import 
{ 
    type Request, 
    type Response 
} 
from "#core/http.ts";
import
{
    type BasicUpdate,
    type BasicCreate,
    type CartUpdate,
    type CartCreate
}
from "#model/account.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("User");
/**
 * ระบบจัดการข้อมูลบัญชี
*/
const content = function ()
{
    return;
}
/**
 * ดึงข้อมูลบัญชีดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getBasic = (request: Request, response: Response) =>
{
    const accountId = Number (request.params ["id"]);
    
    if (!Number.isSafeInteger (accountId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getBasic (accountId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "Id": x.id,
            "Name": x.name,
            "Role": x.role,
            "Created": x.created,
            "Modified": x.modified
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
content.getCart = (request: Request, response: Response) =>
{
    const validate = auth.validateResult (response);
    const accountId = validate.id;

    void model.getCartByAccount (accountId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "Item": x.map ((y) =>
            {
                return {
                    "ItemId": y.itemId,
                    "ProductId": y.productId,
                    "Quantity": y.quantity
                }
            })
        });
        response.end ();
    });
}
/**
 * แก้ไขบัญชีดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putBasic = (request: Request, response: Response) =>
{
    const accountId = Number (request.params ["id"]);
    let input: BasicUpdate;

    if (!Number.isSafeInteger (accountId) ||
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
            id: accountId,
            name: reader.optionalString ("Name"),
            role: reader.optionalInteger ("Role"),
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateBasic (input).then (() =>
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
content.putCart = (request: Request, response: Response) =>
{
    const accountId = auth.validateResult (response).id;
    const itemId = Number (request.params ["id"]);
    let update: CartUpdate;

    try
    {
        const reader = objectReader (request.body);
        const quantity = reader.requireInteger ("Quantity");

        update = {
            accountId: accountId,
            itemId: itemId,
            quantity: quantity
        }
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateCart (update).then (() =>
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
    });
}

content.postBasic = (request: Request, response: Response) =>
{
    let input: BasicCreate;

    try
    {
        const reader = objectReader (request.body);
        input = 
        {
            name: reader.requireString ("Name"),
            role: reader.requireInteger ("Role")
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
content.postCart = (request: Request, response: Response) =>
{
    const accountId = auth.validateResult (response).id;
    let create: CartCreate;

    try
    {
        const reader = objectReader (request.body);
        create = 
        {
            accountId: accountId,
            productId: reader.requireInteger ("ProductId"),
            quantity: reader.requireInteger ("Quantity")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createCart (create).then ((x) =>
    {
        response.status (http.STATUS_CREATED);
        response.json ({
            "Id": x,
            "Created": new Date ().getTime ()
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
        if (e instanceof error.Constraint)
        {
            response.status (http.STATUS_BAD_REQUEST);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    });
}


content.deleteBasic = (request: Request, response: Response) =>
{
    const accountId = Number (request.params ["id"]);
    
    if (!Number.isSafeInteger (accountId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.delete (accountId).then (() =>
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
content.deleteCart = (request: Request, response: Response) =>
{
    const accountId = auth.validateResult (response).id;
    const itemId =  Number (request.params ["id"]);

     void model.deleteCart (itemId, accountId).then (() =>
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