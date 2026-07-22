import formidable       from "formidable";
import http             from "#core/http.ts";
import logging          from "#core/log.ts"
import error            from "#core/error.ts";
import objectReader     from "#core/object.reader.ts";
import auth             from "#controller/auth.ts";
import controlOrder     from "#controller/order.ts";
import model, { type ContactFetch, type ContactUpdate }            from "#model/account.ts";
import modelOrder       from "#model/order.ts";
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
    type CartCreate,

    type FavoriteFetch,
    type FavoriteCreate
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
const log = logging.scoped ("Account");
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

    void model.getCartByAccount (accountId).then ((x) =>
    {
        content.outputGetCart (response, x);
    });
}
/**
 * ดึงข้อมูลติดต่อของบัญชีที่ตนเองกำลังใช้งานอยู่
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getContact = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;

    request.params ["id"] = String (accountId);
    content.getContactOf (request, response);
}
/**
 * ดึงข้อมูลติดต่อของบัญชีดังกล่าวด้วย `id` ที่กำหนดไว้
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getContactOf = (request: Request, response: Response) =>
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
    void model.getContact (queryId).then ((x) =>
    {
        content.outputGetContact (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetContact (response, e);
    });
}
/**
 * ดึงข้อมูลสินค้าที่ชอบของบัญชีตนเอง
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getFavorite = (request: Request, response: Response) =>
    {
        const authenticate = auth.validateResult (response);
        const accountId = authenticate.id;
    
        void model.getFavoriteByAccount (accountId).then ((x) =>
        {
            content.outputGetFavorite (response, x);
        })
        .catch ((e: unknown) =>
        {
            content.errorGetFavorite (response, e);
        });
    }
/**
 * ดึงข้อมูลคำสั่งซื้อสินค้าของบัญชีตนเองที่กำลังใช้งานอยู่ 
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getOrder = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;

    void modelOrder.getListByAccount (accountId).then ((x) =>
    {
        controlOrder.outputGetList (response, x);
    })
    .catch ((e: unknown) =>
    {
        controlOrder.errorGetList (response, e);
    })
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
/**
 * ปรับเปลี่ยนข้อมูลติดต่อบัญชีของตนเอง
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putContact = async (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const accountId = authenticate.id;

    request.params ["id"] = String (accountId);
    return content.putBasicOf (request, response);
}
/**
 * ปรับเปลี่ยนข้อมูลติดต่อบัญชีดังกล่าวด้วย `id` ที่กำหนดไว้
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putContactOf = async (request: Request, response: Response) =>
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

    let input: ContactUpdate;
    
    try
    {
        input = content.inputPutContact (request, queryId);
    }
    catch (e: unknown)
    {
        log.warn (e);
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateContact (input).then (() =>
    {
        content.outputPutContact (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutContact (response, e);
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
//
// เพิ่มสินค้าที่ชอบเข้าบัญชีตัวเอง
//
content.postFavorite = (request: Request, response: Response) =>
    {
        const authenticate = auth.validateResult (response);
        const accountId = authenticate.id;
        let create: FavoriteCreate;
    
        try
        {
           create = content.inputPostFavorite (request, accountId);
        }
        catch
        {
            response.status (http.STATUS_BAD_REQUEST);
            response.end ();
            return;
        }
    
        void model.createFavorite (create).then ((x) =>
        {
            content.outputPostFavorite (response, x);
        })
        .catch ((e: unknown) =>
        {
            content.errorPostFavorite (response, e);
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
//
// ลบสินค้าที่ชอบออก
//
content.deleteFavorite = (request: Request, response: Response) =>
    {
        const authenticate = auth.validateResult (response);
        const accountId = authenticate.id;
        const favoriteId = Number (request.params ["id"]);
    
        if (!Number.isSafeInteger (favoriteId) || favoriteId <= 0)
        {
            response.status (http.STATUS_BAD_REQUEST);
            response.end ();
            return;
        }
    
        void model.deleteFavorite (favoriteId, accountId).then (() =>
        {
            content.outputDeleteFavorite (response);
        })
        .catch ((e: unknown) =>
        {
            content.errorDeleteFavorite (response, e);
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
        status: meta.optionalInteger ("Status"),
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
    const result = {
        accountId: accountId,
        itemId: itemId,
        quantity: quantity
    };
    if (result.quantity && result.quantity < 0) {
        throw new error.BadData ("Negative quantity not accepted");
    }
    return result;
}
content.inputPutContact = (request: Request, accountId: BasicId) : ContactUpdate  =>
{
    const reader = objectReader (request.body);
    const result: ContactUpdate = {
        id: accountId,
        email: reader.optionalString ("Email"),
        phone: reader.optionalString ("Phone"),
        address: reader.optionalString ("Address"),
    };
    return result;
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
        status: meta.requireInteger ("Status"),
        icon: icon?.newFilename ?? ""
    };
}
content.inputPostCart = (request: Request, accountId: number) : CartCreate =>
{
    const reader = objectReader (request.body);
    const result = {
        accountId: accountId,
        productId: reader.requireInteger ("ProductId"),
        quantity: reader.requireInteger ("Quantity")
    };
    if (result.quantity && result.quantity < 0) {
        throw new error.BadData ("Negative quantity not accepted");
    }
    return result;
}
content.inputPostFavorite = (request: Request, accountId: number) : FavoriteCreate =>
    {
        const reader = objectReader (request.body);
        const result = {
            accountId: accountId,
            productId: reader.requireInteger ("ProductId")
        };
        return result;
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
        "Status": x.status,
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
            "Status": x.status,
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
content.outputGetContact = (r: Response, x: ContactFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Id": x.id,
        "Email": x.email,
        "Phone": x.phone,
        "Address": x.address,
    });
    r.end ();
}
content.outputGetFavorite = (r: Response, x: FavoriteFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((x) => { return {
            "FavoriteId": x.favoriteId,
            "ProductId": x.productId
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
content.outputPutContact = (r: Response) =>
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
content.outputPostFavorite = (r: Response, id: number) =>
{
    r.status (http.STATUS_CREATED);
    r.json ({
        "Id": id,
        "Created": new Date ().getTime ()
    });
    r.end ();
}
content.outputDeleteCart = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputDeleteFavorite = (r: Response) =>
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
content.errorGetContact = (r: Response, e: unknown) =>
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
content.errorGetFavorite = (r: Response, e: unknown) =>
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
content.errorPutContact = (r: Response, e: unknown,) =>
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
content.errorPostFavorite = (r: Response, e: unknown) =>
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
content.errorDeleteFavorite = (r: Response, e: unknown) =>
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