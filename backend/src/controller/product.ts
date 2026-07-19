import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts";
import objectReader from "#core/object.reader.ts";
import auth         from "#controller/auth.ts";
import model        from "#model/product.ts";
import
{
    type Request,
    type Response
}
from "#core/http.ts";
import
{
    type BasicFetchOption,
    type BasicUpdate,
    type BasicCreate,
    type CategoryUpdate,
    type CategoryCreate,
    type CommentUpdate,
    type CommentCreate,
    type ReviewUpdate,
    type ReviewCreate,
    type StockUpdate,
}
from "#model/product.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("Product");
/**
 * ระบบจัดการสินค้า
*/
const content = function ()
{
    return;
}
/**
 * ดึงข้อมูลสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getBasic = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    
    if (!Number.isSafeInteger (productId))
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getBasic (productId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "Id": x.id,
            "Name": x.name,
            "Description": x.description,
            "Price": x.price,
            "PriceCode": x.priceCode,
            "Platform": x.platform,
            "Cover": x.cover
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
 * ดึงข้อมูลรายการสินค้า
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getBasicList = (request: Request, response: Response) =>
{
    const option: BasicFetchOption =
    {
        search: request.query ["search"] as string
    };

    void model.getBasicList (option).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json (
        {
            "Item": x.map ((x) => 
            {
                return {
                    "Id": x.id,
                    "Name": x.name,
                    "Description": x.description,
                    "Price": x.price,
                    "PriceCode": x.priceCode,
                    "Platform": x.platform,
                    "Cover": x.cover
                }
            })
        });
        response.end ();
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
 * ดึงข้อมูลหมวดหมู่ของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getCategory = (request: Request, response: Response) =>
{
    const categoryId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (categoryId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getCategory (categoryId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "CategoryId": x.categoryId,
            "ProductId": x.productId,
            "Value": x.value,
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
 * ดึงข้อมูลความคิดเห็นของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getComment = (request: Request, response: Response) =>
{
    const commentId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (commentId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getComment (commentId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "CommentId": x.commentId,
            "ProductId": x.productId,
            "Author": x.author,
            "Title": x.title,
            "Text": x.text,
            "Rating": x.rating,
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
 * ดึงข้อมูลรีวิวของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getReview = (request: Request, response: Response) =>
{
    const reviewId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (reviewId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getReview (reviewId).then ((x) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "ReviewId": x.reviewId,
            "ProductId": x.productId,
            "Mime": x.mime,
            "Link": x.link,
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
 * ดึงข้อมูลสต็อกของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getStock = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    
    if (!Number.isSafeInteger (productId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getStock (productId).then ((x) =>
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
 * แก้ไขสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putBasic = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    let input: BasicUpdate;

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
            id: productId,
            name: reader.optionalString ("Name"),
            description: reader.optionalString ("Description"),
            price: reader.optionalInteger ("Price"),
            priceCode: reader.optionalInteger ("PriceCode"),
            platform: reader.optionalInteger ("Platform"),
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
 * แก้ไขหมวดหมู่ของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putCategory = (request: Request, response: Response) =>
{
    const categoryId = Number (request.params ["id"]);
    let input: CategoryUpdate;

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
            categoryId: categoryId,
            value: reader.optionalInteger ("Value")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateCategory (input).then (() =>
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
 * แก้ไขเนื้อหาของความคิดเห็นในสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putComment = (request: Request, response: Response) =>
{
    const categoryId = Number (request.params ["id"]);
    let input: CommentUpdate;

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
            title: reader.optionalString ("Title"),
            text: reader.optionalString ("Text"),
            rating: reader.optionalInteger ("Rating")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateComment (input).then (() =>
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
 * แก้ไขรีวิวของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putReview = (request: Request, response: Response) =>
{
    const reviewId = Number (request.params ["id"]);
    let input: ReviewUpdate;

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
            mime: reader.optionalString ("Mime"),
            link: reader.optionalString ("Link"),
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateReview (input).then (() =>
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
 * แก้ไขสต็อกของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putStock = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);
    let input: StockUpdate;

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

    void model.updateStock (input).then (() =>
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
 * เพิ่มสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.postBasic = (request: Request, response: Response) =>
{
    let input: BasicCreate;

    try
    {
        const reader = objectReader (request.body);
        input = 
        {
            name: reader.requireString ("Name"),
            description: reader.requireString ("Description"),
            price: reader.requireInteger ("Price"),
            priceCode: reader.requireInteger ("PriceCode"),
            platform: reader.requireInteger ("Platform"),
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
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}
/**
 * เพิ่มหมวดหมู่ให้กับสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.postCategory = (request: Request, response: Response) =>
{
    let input: CategoryCreate;

    try
    {
        const reader = objectReader (request.body);
        input = 
        {
            productId:  reader.requireInteger ("ProductId"),
            value: reader.requireInteger ("Value")
        };
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createCategory (input).then ((x) =>
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
content.postComment = (request: Request, response: Response) =>
{
    const authorId = auth.validateResult (response).id;
    let input: CommentCreate;

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

    void model.createComment (input).then ((x) =>
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
content.postReview = (request: Request, response: Response) =>
{
    let input: ReviewCreate;

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

    void model.createReview (input).then ((x) =>
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
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    });
}

/**
 * ลบสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.deleteBasic = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (productId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.delete (productId).then (() =>
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
 * ลบหมวดหมู่ออกจากสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.deleteCategory = (request: Request, response: Response) =>
{
    const categoryId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (categoryId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteCategory (categoryId).then (() =>
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
 * ลบความคิดเห็นออกจากสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.deleteComment = (request: Request, response: Response) =>
{
    const commentId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (commentId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteComment (commentId).then (() =>
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
 * ลบรีวิวออกจากสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.deleteReview = (request: Request, response: Response) =>
{
    const reviewId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (reviewId) ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteReview (reviewId).then (() =>
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
 * ส่งออกตัวแปร
*/
export default content;