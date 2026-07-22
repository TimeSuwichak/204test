import http             from "#core/http.ts";
import logging          from "#core/log.ts"
import error            from "#core/error.ts";
import auth             from "#controller/auth.ts";
import model            from "#model/order.ts";
import modelAccount     from "#model/account.ts";
import objectReader from "#core/object.reader.ts";
import
{ 
    type Request, 
    type Response,
} 
from "#core/http.ts";
import
{
    type BasicCreate,
    type BasicFetch,
    type BasicUpdate
}
from "#model/order.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("Order");
/**
 * ระบบจัดการข้อมูลคำสั่งซื้อ
*/
const content = function ()
{
    return;
}
content.get = (request: Request, response: Response) =>
{
    const authenticate = auth.validateResult (response);
    const orderId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (orderId) || orderId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
    }
    void model.get (orderId).then ((x) =>
    {
        if (authenticate.id !== x.accountId &&
            authenticate.role !== modelAccount.ROLE_MANAGER &&
            authenticate.role !== modelAccount.ROLE_STAFF &&
            authenticate.role !== modelAccount.ROLE_DEVELOPER)
        {
            response.status (http.STATUS_FORBIDDEN);
            response.end ();
            return;
        }
        content.outputGet (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGet (response, e);
    })
}
content.getList = (request: Request, response: Response) =>
{
    void model.getList ().then ((x) =>
    {
        content.outputGetList (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetList (response, e);
    })
}

content.outputGet = (r: Response, x: BasicFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "OrderId": x.orderId,
        "AccountId": x.accountId,
        "Created": x.created,
        "Delivered": x.delivered,
        "Status": x.status,
        "Item": x.item.map ((x) =>
        {
            return {
                "ProductId": x.productId,
                "Quantity": x.quantity
            }
        })
    });
    r.end ();
}
content.outputGetList = (r: Response, x: BasicFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((y) =>
        {
            return {
                "OrderId": y.orderId,
                "AccountId": y.accountId,
                "Created": y.created,
                "Delivered": y.delivered,
                "Status": y.status,
                "Item": y.item.map ((x) =>
                {
                    return {
                        "ProductId": x.productId,
                        "Quantity": x.quantity
                    }
                })
            }
        })
    });
    r.end ();
}
content.errorGet = (r: Response, e: unknown) =>
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
content.errorGetList = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}
/*
 * สร้างคำสั่งซื้อ
 **/
content.post = async (request: Request, response: Response) => {
    try {
        const payload = content.inputPost(request);
        const orderId = await model.create(payload);

        response.status(http.STATUS_CREATED);
        response.json({ OrderId: orderId, Created: new Date () });
        response.end();
    } catch (e: unknown) {
        log.error(e);
        response.status(http.STATUS_BAD_REQUEST);
        response.end();
    }
};

content.inputPost = (request: Request): BasicCreate => {
    const reader = objectReader(request.body);
    const rawItems = reader.requireArrayRecord("Item");

    return {
        accountId: reader.requireInteger("AccountId"),
        created: new Date(),
        delivered: null,
        status: reader.requireInteger("Status"),
        shipName: reader.requireString ("ShipName"),
        shipAddress: reader.requireString ("ShipAddress"),
        shipPhone: reader.requireString ("ShipPhone"),
        shipEmail: reader.requireString ("ShipEmail"),
        paymentType: reader.requireInteger ("PaymentType"),
        promotionId: reader.requireString ("PromotionId"),
        item: rawItems.map((item) => {
            const itemReader = objectReader(item);
            return {
                productId: itemReader.requireInteger("ProductId"),
                quantity: itemReader.requireInteger("Quantity"),
            };
        }),
    };
};

/*
 * แก้ไขคำสั่งซื้อ
 **/
content.put = async (request: Request, response: Response) => {
    const orderId = Number(request.params["id"]);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        response.status(http.STATUS_BAD_REQUEST);
        response.end();
        return;
    }

    try {
        const payload = content.inputPut(request);
        await model.update(payload);

        response.status(http.STATUS_OK);
        response.json({ Success: true });
        response.end();
    } catch (e: unknown) {
        log.error(e);
        response.status(http.STATUS_BAD_REQUEST);
        response.end();
    }
};

content.inputPut = (request: Request): BasicUpdate => {
    const orderId = Number(request.params["id"]);
    const body = request.body as Record<string, unknown> | undefined;

    const result: BasicUpdate = {
        orderId,
    };

    if (body && typeof body === "object") {
        if (body["Delivered"] !== undefined) {
            const reader = objectReader(body);
            const deliveredRaw = reader.requireStringOrNull("Delivered");
            result.delivered = deliveredRaw ? new Date(deliveredRaw) : null;
        }

        if (body["Status"] !== undefined) {
            const reader = objectReader(body);
            const statusRaw = reader.requireIntegerOrNull("Status");
            if (statusRaw !== null) {
                result.status = statusRaw;
            }
        }
    }

    return result;
};

/*
 * ลบคำสั่งซื้อ
 **/
content.delete = (request: Request, response: Response) => {
    const orderId = Number(request.params["id"]);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        response.status(http.STATUS_BAD_REQUEST);
        response.end();
        return;
    }

    void model
        .delete(orderId)
        .then(() => {
            response.status(http.STATUS_OK);
            response.json({ Success: true });
            response.end();
        })
        .catch((e: unknown) => {
            log.error(e);
            response.status(http.STATUS_BAD_REQUEST);
            response.end();
        });
};

/*
 * ERROR
 **/
content.outputGet = (r: Response, x: BasicFetch) => {
    r.status(http.STATUS_OK);
    r.json({
        OrderId: x.orderId,
        AccountId: x.accountId,
        Created: x.created.getTime(),
        Delivered: x.delivered ? x.delivered.getTime() : null,
        Status: x.status,
        ShipName: x.shipName,
        ShipAddress: x.shipAddress,
        ShipPhone: x.shipPhone,
        ShipEmail: x.shipEmail,
        PaymentType: x.paymentType,
        PromotionId: x.promotionId,
        Item: x.item.map((i) => ({
            ProductId: i.productId,
            Quantity: i.quantity,
        })),
    });
    r.end();
};

content.outputGetList = (r: Response, x: BasicFetch[]) => {
    r.status(http.STATUS_OK);
    r.json({
        Item: x.map((y) => ({
            OrderId: y.orderId,
            AccountId: y.accountId,
            Created: y.created.getTime(),
            Delivered: y.delivered ? y.delivered.getTime() : null,
            Status: y.status,
            ShipName: y.shipName,
            ShipAddress: y.shipAddress,
            ShipPhone: y.shipPhone,
            ShipEmail: y.shipEmail,
            PaymentType: y.paymentType,
            PromotionId: y.promotionId,
            Item: y.item.map((i) => ({
                ProductId: i.productId,
                Quantity: i.quantity,
            })),
        })),
    });
    r.end();
};

content.errorGet = (r: Response, e: unknown) => {
    if (e instanceof error.NotFound) {
        r.status(http.STATUS_NOT_FOUND);
        r.end();
        return;
    }
    log.error(e);
    r.status(http.STATUS_SERVICE_UNAVAILABLE);
    r.end();
};

content.errorGetList = (r: Response, e: unknown) => {
    log.error(e);
    r.status(http.STATUS_SERVICE_UNAVAILABLE);
    r.end();
};

/**
 * ส่งออกตัวแปร
*/
export default content;