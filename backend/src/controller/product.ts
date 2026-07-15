import http from "#core/http.ts";
import error from "#core/error.ts";
import logging from "#core/log.ts";
import objReader from "#core/objectReader.ts";
import auth from "#controller/auth.ts";
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
import
{
    type UpdateProductBasic,
    type UpdateProductComment,
    type UpdateProductOrder,
    type UpdateProductReview,
    type UpdateProductStock,
    type CreateProduct,
    type CreateProductCategory,
    type CreateProductComment,
    type CreateProductReview,
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
content.get = (request: Request, response: Response) =>
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
content.getPreview = (request: Request, response: Response) =>
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
content.getComment = (request: Request, response: Response) =>
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
content.getStock = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);

    if (id === 0 || !Number.isSafeInteger (id))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getStock (id).then ((x) =>
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
    const productId = Number (request.params ["id"]);

    if (productId === 0 || !Number.isSafeInteger (productId))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let content: UpdateProductBasic;

    try
    {
        const reader = objReader (request.body);

        content = {
            productId: productId,
            name: reader.requireString ("Name"),
            description: reader.requireString ("Description"),
            price: reader.requireFloat ("Price"),
            priceCode: reader.requireInteger ("PriceCode")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateBasic (content).then (() =>
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
content.putPreview = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    const reviewId = Number (request.params ["pid"]);

    if ((productId === 0 || !Number.isSafeInteger (productId)) ||
        (reviewId === 0 || !Number.isSafeInteger (reviewId)))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let content: UpdateProductReview;
    
    try
    {
        const reader = objReader (request.body);

        content = {
            productId: productId,
            reviewId: reviewId,
            mime: reader.requireString ("Mime"),
            link: reader.requireString ("Link")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    
    void model.updateReview (content).then (() =>
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
content.putComment = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    const commentId = Number (request.params ["cid"]);

    if ((productId === 0 || !Number.isSafeInteger (productId)) ||
        (commentId === 0 || !Number.isSafeInteger (commentId)))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let content: UpdateProductComment;
    
    try
    {
        const reader = objReader (request.body);

        content = {
            productId: productId,
            commentId: commentId,
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
    
    void model.updateComment (content).then (() =>
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


content.post = (request: Request, response: Response) =>
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let content: CreateProduct;

    try
    {
        const reader = objReader (request.body);

        content = {
            name: reader.requireString ("Name"),
            description: reader.requireString ("Description"),
            price: reader.requireFloat ("Price"),
            priceCode: reader.requireInteger ("PriceCode"),
            category: reader.requireArrayObject ("Category").map ((x) =>
            {
                const y = objReader (x);
                return {
                    value: y.requireInteger ("Value")
                };
            }),
            review: reader.requireArrayObject ("Review").map ((x) =>
            {
                const y = objReader (x);
                return {
                    mime: y.requireString ("Mime"),
                    link: y.requireString ("Link")
                };
            }),
            stock: {
                quantity: reader.requireInteger ("StockQuantity")
            }
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.create (content).then (() =>
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
content.postReview = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);

    if (productId === 0 || !Number.isSafeInteger (productId))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let content: CreateProductReview;

    try
    {
        const reader = objReader (request.body);

        content = {
            productId: productId,
            mime: reader.requireString ("Mime"),
            link: reader.requireString ("Link")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createReview (content).then (() =>
    {
        response.status (http.STATUS_CREATED);
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
content.postComment = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    const validation = auth.validateResult (request);

    if (productId === 0 || !Number.isSafeInteger (productId))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let content: CreateProductComment;

    try
    {
        const reader = objReader (request.body);

        content = {
            productId: productId,
            author: validation.id,
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

    void model.createComment (content).then (() =>
    {
        response.status (http.STATUS_CREATED);
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
content.putStock = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);

    if (id === 0 || !Number.isSafeInteger (id))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    let quantity: number;

    try
    {
        const reader = objReader (request.body);

        quantity = reader.requireInteger ("Quantity");
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateStock (id, quantity).then (() =>
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

content.deleteProduct = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);

    if (id === 0 || !Number.isSafeInteger (id))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteBasic (id).then (() =>
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
content.deleteProductPreview = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);
    const pid = Number (request.params ["pid"]);

    if ((id === 0 || !Number.isSafeInteger (id)) || 
        (pid === 0 || !Number.isSafeInteger (pid)))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteReview (id, pid).then (() =>
    {
        response.status (http.STATUS_NO_CONTENT);
        response.end ();
    })
    .catch ((e: unknown) =>
    {
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    });
}
content.deleteProductComment = (request: Request, response: Response) =>
{
    const id = Number (request.params ["id"]);
    const pid = Number (request.params ["pid"]);

    if ((id === 0 || !Number.isSafeInteger (id)) || 
        (pid === 0 || !Number.isSafeInteger (pid)))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteComment (id, pid).then (() =>
    {
        response.status (http.STATUS_NO_CONTENT);
        response.end ();
    })
    .catch ((e: unknown) =>
    {
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