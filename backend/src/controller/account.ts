import formidable       from "formidable";
import http             from "#core/http.ts";
import logging          from "#core/log.ts"
import error            from "#core/error.ts";
import objectReader     from "#core/object.reader.ts";
import auth             from "#controller/auth.ts";
import model            from "#model/account.ts";
import modelStorage     from "#model/storage.ts";
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
    type BasicCreate,

    type CartId,
    type CartFetch,
    type CartUpdate,
    type CartCreate
}
from "#model/account.ts";
import 
{ 
    type ResourceId 
} 
from "#model/storage.ts";

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
 * ดึงข้อมูลพื้นฐานของบัญชีที่ตนเองกำลังใช้งานอยู่
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getBasic = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;

    request.params ["id"] = String (accountId);
    content.getBasicOf (request, response);
}
/**
 * ดึงข้อมูลพื้นฐานของบัญชีดังกล่าวด้วย `id` ที่กำหนดไว้
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getBasicOf = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const authId = authenticate.id;
    const queryId = Number (request.params ["id"]);

    if ((authId !== queryId) && 
        (authenticate.role !== model.ROLE_MANAGER))
    {
        response.status (http.STATUS_FORBIDDEN);
        response.end ();
        return;    
    }
    void model.getBasic (queryId).then ((x) =>
    {
        content.outputGetBasic (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasic (response, e);
    });
}
/**
 * ดึงข้อมูลรายการบัญชีที่มีอยู่ในระบบ
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getBasicList = (request: Request, response: Response) =>
{
    void model.getBasicList ().then ((x) =>
    {
        content.outputGetBasicList (response, x);
    })
    .catch ((e: unknown) =>
    {
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    });
}
/**
 * ดึงข้อมูลตะกร้าของบัญชีตนเองที่กำลังใช้งานอยู่ 
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getCart = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;

    if (authenticate.id !== accountId)
    {
        response.status (http.STATUS_FORBIDDEN);
        response.end ();
        return;
    }
    void model.getCartByAccount (accountId).then ((x) =>
    {
        content.outputGetCart (response, x);
    });
}
/**
 * ปรับเปลี่ยนข้อมูลพื้นฐานบัญชีของตนเอง
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putBasic = async (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;

    request.params ["id"] = String (accountId);
    return content.putBasicOf (request, response);
}
/**
 * ปรับเปลี่ยนข้อมูลพื้นฐานบัญชีดังกล่าวด้วย `id` ที่กำหนดไว้
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putBasicOf =  async (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;
    const queryId =  Number (request.params ["id"]);

    if ((accountId != queryId) &&
        (authenticate.role !== model.ROLE_MANAGER))
    {
        response.status (http.STATUS_FORBIDDEN);
        response.end ();
        return;
    }

    if (!Number.isSafeInteger (queryId) || queryId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    const iconId = await modelStorage.createWriterId ();
    let input: BasicUpdate;
    
    try
    {
        input = await content.inputPutBasic (iconId, accountId, request);
    }
    catch (e: unknown)
    {
        await modelStorage.delete (iconId);

        log.warn (e);
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

content.putCart = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;
    const itemId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (itemId) || itemId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    let update: CartUpdate;

    try
    {
        update = content.inputPutCart (accountId, itemId, request);
    }
    catch (e: unknown)
    {
        log.warn (e);
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateCart (update).then (() =>
    {
        content.outputPutBasic (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutCart (response, e);
    });
}

content.postBasic = async (request: Request, response: Response) =>
{
    const iconId = await modelStorage.createWriterId ();
    let input: BasicCreate;

    try
    {
        input = await content.inputPostBasic (iconId, request);
    }
    catch (e: unknown)
    {
        await modelStorage.delete (iconId);

        log.warn (e);
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
content.postCart = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;
    let create: CartCreate;

    try
    {
       create = content.inputPostCart (request, accountId);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createCart (create).then ((x) =>
    {
        content.outputPostCart (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorPostCart (response, e);
    });
}
/**
 * ลบข้อมูลบัญชีของตนเอง
*/
content.deleteBasic = (request: Request, response: Response) =>
{
    //
    // เสี่ยงเกินไปที่ดำเนินการ ดังนั้นจึงไม่มีการทำงานใด ๆ
    //
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.deleteCart = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;
    const itemId =  Number (request.params ["id"]);

    if (!Number.isSafeInteger (itemId) || itemId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

     void model.deleteCart (itemId, accountId).then (() =>
    {
        content.outputDeleteCart (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorDeleteCart (response, e);
    });
}


content.inputPutBasic = async (
    iconId: ResourceId, 
    accountId: BasicId, 
    request: Request
) : Promise<BasicUpdate> =>
{
    const form = formidable ({
        multiples: false,
        uploadDir: modelStorage.getPath (),
        filter: (part) =>
        {
            const isKey = part.name === "Icon";
            const isImage = part.mimetype ? 
                            part.mimetype.startsWith ("image/") : false;

            return isKey && isImage;
        },
        filename: (name, ext, part, form) =>
        {
            void name; void ext;
            void part; void form;
            return iconId;
        },
    });
    const [field, file] = await form.parse (request);

    const listMetadata = field ["Metadata"] ?? [];
    const listFile = file ["Icon"] ?? [];

    const meta = objectReader (JSON.parse (listMetadata.at (0) ?? ""));
    const icon = listFile.at (0);
    
    return {
        id: accountId,
        name: meta.optionalString ("Name"),
        role: meta.optionalInteger ("Role"),
        icon: icon?.newFilename ?? ""
    };
}
content.inputPutCart = (
    accountId: BasicId, 
    itemId: CartId, 
    request: Request
) : CartUpdate =>
{
    const reader = objectReader (request.body);
    const quantity = reader.requireInteger ("Quantity");

    return {
        accountId: accountId,
        itemId: itemId,
        quantity: quantity
    };
}
content.inputPostBasic = async (
    iconId: ResourceId, 
    request: Request
) : Promise<BasicCreate> =>
{
    const form = formidable ({
        multiples: false,
        uploadDir: modelStorage.getPath (),
        filter: (part) =>
        {
            const isKey = part.name === "Icon";
            const isImage = part.mimetype ? 
                            part.mimetype.startsWith ("image/") : false;

            return isKey && isImage;
        },
        filename: (name, ext, part, form) =>
        {
            void name; void ext;
            void part; void form;
            return iconId;
        },
    });
    const [field, file] = await form.parse (request);

    const listMetadata = field ["Metadata"] ?? [];
    const listFile = file ["Icon"] ?? [];

    const meta = objectReader (JSON.parse (listMetadata.at (0) ?? ""));
    const icon = listFile.at (0);

    return {
        name: meta.requireString ("Name"),
        role: meta.requireInteger ("Role"),
        icon: icon?.newFilename ?? ""
    };
}
content.inputPostCart = (request: Request, accountId: number) : CartCreate =>
{
    const reader = objectReader (request.body);
    return {
        accountId: accountId,
        productId: reader.requireInteger ("ProductId"),
        quantity: reader.requireInteger ("Quantity")
    };
}


content.outputGetBasic = (r: Response, x: BasicFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Id": x.id,
        "Icon": x.icon,
        "Name": x.name,
        "Role": x.role,
        "Created": x.created.getTime (),
        "Modified": x.modified ? x.modified.getTime () : null,
    });
    r.end ();
}
content.outputGetBasicList = (r: Response, x: BasicFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((x) => { return {
            "Id": x.id,
            "Icon": x.icon,
            "Name": x.name,
            "Role": x.role,
            "Created": x.created.getTime (),
            "Modified": x.modified ? x.modified.getTime () : null,
        }})
    });
    r.end ();
}
content.outputGetCart = (r: Response, x: CartFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((x) => { return {
            "ItemId": x.itemId,
            "ProductId": x.productId,
            "Quantity": x.quantity
        }})
    });
    r.end ();
}
content.outputPutBasic = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputPutCart = (r: Response) =>
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
    r.end ()
}
content.outputPostCart = (r: Response, id: CartId) =>
{
    r.status (http.STATUS_CREATED);
    r.json ({
        "Id": id,
        "Created": new Date ().getTime ()
    });
    r.end ()
}
content.outputDeleteCart = (r: Response) =>
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
content.errorPutCart = (r: Response, e: unknown,) =>
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
content.errorPostCart = (r: Response, e: unknown) =>
{
    if (e instanceof error.NotFound)
    {
        r.status (http.STATUS_NOT_FOUND);
        r.end ();
        return;
    }
    if (e instanceof error.Constraint)
    {
        r.status (http.STATUS_BAD_REQUEST);
        r.end ();
        return;
    }
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}
content.errorDeleteCart = (r: Response, e: unknown) =>
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
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;