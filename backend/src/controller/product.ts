import formidable       from "formidable";
import error            from "#core/error.ts";
import http             from "#core/http.ts";
import logging          from "#core/log.ts";
import objectReader     from "#core/object.reader.ts";
import auth             from "#controller/auth.ts";
import model            from "#model/product.ts";
import modelStorage     from "#model/storage.ts";
import
{
    type Request,
    type Response
}
from "#core/http.ts";
import { type BasicId as AccountId } from "#model/account.ts";
import { type ResourceId } from "#model/storage.ts";
import
{
    type BasicId,
    type BasicFetch,
    type BasicFetchOption,
    type BasicUpdate,
    type BasicCreate,
    type CategoryId,
    type CategoryFetch,
    type CategoryUpdate,
    type CategoryCreate,
    type CommentId,
    type CommentFetch,
    type CommentUpdate,
    type CommentCreate,
    type ReviewId,
    type ReviewFetch,
    type ReviewUpdate,
    type ReviewCreate,
    type StockFetch,
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
    
    if (!Number.isSafeInteger (productId) || productId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getBasic (productId).then ((x) =>
    {
        content.outputGetBasic (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasic (response, e);
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
        search: request.query ["search"] as string,
        category: request.query ["category"] ? 
            (request.query ["category"] as string).split(",").map ((x) => Number (x)) : [],
        minPrice: request.query ["minPrice"] ? Number (request.query ["minPrice"]) : 0,
        maxPrice: request.query ["maxPrice"] ? Number (request.query ["maxPrice"]) : 0,
    };

    void model.getBasicList (option).then ((x) =>
    {
        content.outputGetBasicList (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetBasicList (response, e);
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

    if (!Number.isSafeInteger (categoryId) || categoryId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getCategory (categoryId).then ((x) =>
    {
        content.outputGetCategory (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetCategory (response, e);
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

    if (!Number.isSafeInteger (commentId) || commentId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getComment (commentId).then ((x) =>
    {
        content.outputGetComment (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetComment (response, e);
    });
}
/**
 * ดึงข้อมูลรายการความคิดเห็นของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getCommentList = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (productId) || productId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getCommentList (productId).then ((x) =>
    {
        content.outputGetCommentList (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetCommentList (response, e);
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

    if (!Number.isSafeInteger (reviewId) || reviewId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getReview (reviewId).then ((x) =>
    {
        content.outputGetReview (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetReview (response, e);
    });
}
/**
 * ดึงข้อมูลรายการตัวอย่างของสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.getReviewList = (request: Request, response: Response) =>
{
    const productId = Number (request.params ["id"]);

    if (!Number.isSafeInteger (productId) || productId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getReviewList (productId).then ((x) =>
    {
        content.outputGetReviewtList (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetReviewList (response, e);
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
    const stockId = Number (request.params ["id"]);
    
    if (!Number.isSafeInteger (stockId) || stockId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.getStock (stockId).then ((x) =>
    {
        content.outputGetStock (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorGetStock (response, e);
    });
}
/**
 * แก้ไขสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.putBasic = async (request: Request, response: Response) =>
{
    const basicId = Number (request.params ["id"]);
    let input: BasicUpdate;

    if (!Number.isSafeInteger (basicId) || basicId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    const coverId = await modelStorage.createWriterId ();
    const bgId = await modelStorage.createWriterId ();

    try
    {
        input = await content.inputPutBasic (request, basicId, coverId, bgId);
    }
    catch (e: unknown)
    {
        await modelStorage.delete (coverId);
        await modelStorage.delete (bgId);

        log.warn (e);
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateBasic (input).then (() =>
    {
        content.outputPutBasic (response);
    })
    .catch (async (e: unknown) =>
    {
        await modelStorage.delete (coverId);
        await modelStorage.delete (bgId);

        content.errorPutBasic (response, e);
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

    if (!Number.isSafeInteger (categoryId) || categoryId <= 0 ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    try
    {
        input = content.inputPutCategory (request, categoryId);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateCategory (input).then (() =>
    {
        content.outputPutCategory (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutCategory (response, e);
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
    const commentId = Number (request.params ["id"]);
    let input: CommentUpdate;

    if (!Number.isSafeInteger (commentId) || commentId <= 0 ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    try
    {
        input = content.inputPutComment (request, commentId);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateComment (input).then (() =>
    {
        content.outputPutComment (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutComment (response, e);
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

    if (!Number.isSafeInteger (reviewId) || reviewId <= 0 ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    try
    {
        input = content.inputPutPreview (request, reviewId);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateReview (input).then (() =>
    {
        content.outputPutReview (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutReview (response, e);
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
    const basicId = Number (request.params ["id"]);
    let input: StockUpdate;

    if (!Number.isSafeInteger (basicId) || basicId <= 0 ||
        !request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    try
    {
        input = content.inputPutStock (request, basicId);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.updateStock (input).then (() =>
    {
        content.outputPutStock (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorPutStock (response, e);
    });
}

/**
 * เพิ่มสินค้าดังกล่าว
 * 
 * @param request คำขอ
 * @param response คำตอบ
*/
content.postBasic = async (request: Request, response: Response) =>
{
    const coverId = await modelStorage.createWriterId ();
    const bgId = await modelStorage.createWriterId ();
    let input: BasicCreate;
    
    try
    {
        input = await content.inputPostBasic (request, coverId, bgId);
    }
    catch (e: unknown)
    {
        await modelStorage.delete (coverId);
        await modelStorage.delete (bgId);

        log.warn (e);

        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.create (input).then ((x) =>
    {
        content.outputPostBasic (response, x);
    })
    .catch (async (e: unknown) =>
    {
        await modelStorage.delete (coverId);
        await modelStorage.delete (bgId);

        content.errorPostBasic (response, e);
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
        input = content.inputPostCategory (request);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createCategory (input).then ((x) =>
    {
        content.outputPostCategory (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorPostCategory (response, e);
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
        input = content.inputPostComment (request, authorId);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createComment (input).then ((x) =>
    {
        content.outputPostComment (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorPostComment (response, e);
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
        input = content.inputPostReview (request);
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.createReview (input).then ((x) =>
    {
        content.outputPostReview (response, x);
    })
    .catch ((e: unknown) =>
    {
        content.errorPostReview (response, e);
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
    //
    // เสี่ยงเกินไปที่ดำเนินการ ดังนั้นจึงไม่มีการทำงานใด ๆ
    //
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
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

    if (!Number.isSafeInteger (categoryId) || categoryId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteCategory (categoryId).then (() =>
    {
        content.outputDeleteCategory (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorDeleteCategory (response, e);
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

    if (!Number.isSafeInteger (commentId) || commentId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteComment (commentId).then (() =>
    {
        content.outputDeleteComment (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorDeleteComment (response, e);
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

    if (!Number.isSafeInteger (reviewId) || reviewId <= 0)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    void model.deleteReview (reviewId).then (() =>
    {
        content.outputDeleteReview (response);
    })
    .catch ((e: unknown) =>
    {
        content.errorDeleteReview (response, e);
    });
}

content.inputPutBasic = async (
    request: Request,
    productId: BasicId,
    coverId: ResourceId,
    backgroundId: ResourceId
) : Promise<BasicUpdate> =>
{
    const form = formidable ({
        multiples: false,
        uploadDir: modelStorage.getPath (),
        filter: (part) =>
        {
            const isKey = part.name === "Cover" || 
                            part.name === "Background";
            const isImage = part.mimetype ? 
                            part.mimetype.startsWith ("image/") : false;

            return isKey && isImage;
        },
        filename: (name, ext, part, form) =>
        {
            void name; void ext;
            void part; void form;

            switch (part.name)
            {
                case "Cover": return coverId;
                case "Background": return backgroundId;
            }
            throw new Error ("unknown part name");
        },
    });
    const [field, file] = await form.parse (request);

    const arrayMeta = field ["Metadata"] ?? [];
    const arrayCover = file ["Cover"] ?? [];
    const arrayBG = file ["Background"] ?? [];

    const meta = objectReader (JSON.parse (arrayMeta.at (0) ?? ""));
    const cover = arrayCover.at (0);
    const bg = arrayBG.at (0);

    const result: BasicUpdate =
    {
        id: productId,
        name: meta.optionalString ("Name"),
        description: meta.optionalString ("Description"),
        price: meta.optionalFloat ("Price"),
        priceCode: meta.optionalInteger ("PriceCode"),
        cover: cover?.newFilename ?? undefined,
        background: bg?.newFilename ?? undefined,
    };
    return result;
}
content.inputPutCategory = (r: Request, id: CategoryId) : CategoryUpdate =>
{
    const reader = objectReader (r.body);
    const result: CategoryUpdate =
    {
        categoryId: id,
        value: reader.optionalInteger ("Value")
    };
    return result;
}
content.inputPutComment = (r: Request, id: CommentId) : CommentUpdate =>
{
    const reader = objectReader (r.body);
    const result: CommentUpdate =
    {
        commentId: id,
        title: reader.optionalString ("Title"),
        text: reader.optionalString ("Text"),
        rating: reader.optionalInteger ("Rating")
    };
    return result;
}
content.inputPutPreview = (r: Request, id: ReviewId) : ReviewUpdate =>
{
    const reader = objectReader (r.body);
    const result: ReviewUpdate =
    {
        reviewId: id,
        mime: reader.optionalString ("Mime"),
        link: reader.optionalString ("Link"),
    };
    return result;
}
content.inputPutStock = (r: Request, id: BasicId) : StockUpdate =>
{
    const reader = objectReader (r.body);
    const result: StockUpdate =
    {
        productId: id,
        quantity: reader.optionalInteger ("Quantity"),
    };
    return result;
}
content.inputPostBasic = async (
    request: Request, 
    coverId: ResourceId,
    bgId: ResourceId
) : Promise<BasicCreate> =>
{
    const form = formidable ({
        multiples: false,
        uploadDir: modelStorage.getPath (),
        filter: (part) =>
        {
            const isKey = part.name === "Cover" || 
                            part.name == "Background";
            const isImage = part.mimetype ? 
                            part.mimetype.startsWith ("image/") : false;

            return isKey && isImage;
        },
        filename: (name, ext, part, form) =>
        {
            void name; void ext;
            void part; void form;

            switch (part.name)
            {
                case "Cover": return coverId;
                case "Background": return bgId;
            }
            return "";
        },
    });
    const [field, file] = await form.parse (request);

    const listMetadata = field ["Metadata"] ?? [];
    const listCover = file ["Cover"] ?? [];
    const listBackground = file ["Background"] ?? [];

    const meta = objectReader (JSON.parse (listMetadata.at (0) ?? ""));
    const background = listBackground.at (0);
    const cover = listCover.at (0);

    const result: BasicCreate = 
    {
        name: meta.requireString ("Name"),
        description: meta.requireString ("Description"),
        price: meta.requireInteger ("Price"),
        priceCode: meta.requireInteger ("PriceCode"),
        platform: meta.requireInteger ("Platform"),
        background: background?.newFilename ?? "",
        cover: cover?.newFilename ?? ""
    };
    return result;
}
content.inputPostCategory = (request: Request) : CategoryCreate =>
{
    const reader = objectReader (request.body);
    const result: CategoryCreate = 
    {
        productId: reader.requireInteger ("ProductId"),
        value: reader.requireInteger ("Value")
    };
    return result;
}
content.inputPostComment = (request: Request, author: AccountId) 
    : CommentCreate =>
{
    const reader = objectReader (request.body);
    const result: CommentCreate = 
    {
        productId: reader.requireInteger ("ProductId"),
        author: author,
        title: reader.requireString ("Title"),
        text: reader.requireString ("Text"),
        rating: reader.requireInteger ("Rating"),
    };
    return result;
}
content.inputPostReview = (request: Request) : ReviewCreate =>
{
    const reader = objectReader (request.body);
    const result: ReviewCreate = 
    {
        productId: reader.requireInteger ("ProductId"),
        mime: reader.requireString ("Mime"),
        link: reader.requireString ("Link"),
    };
    return result;
}

content.outputGetBasic = (r: Response, x: BasicFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Id": x.id,
        "Name": x.name,
        "Description": x.description,
        "Price": x.price,
        "PriceCode": x.priceCode,
        "Platform": x.platform,
        "Background": x.background,
        "Cover": x.cover
    });
    r.end ();
}
content.outputGetBasicList = (r: Response, x: BasicFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((x) => 
        {
            return {
                "Id": x.id,
                "Name": x.name,
                "Description": x.description,
                "Price": x.price,
                "PriceCode": x.priceCode,
                "Platform": x.platform,
                "Background": x.background,
                "Cover": x.cover
            }
        })
    })
    r.end ();
}
content.outputGetCategory = (r: Response, x: CategoryFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "CategoryId": x.categoryId,
        "ProductId": x.productId,
        "Value": x.value,
    });
    r.end ();
}
content.outputGetComment = (r: Response, x: CommentFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "CommentId": x.commentId,
        "ProductId": x.productId,
        "Author": x.author,
        "Title": x.title,
        "Text": x.text,
        "Rating": x.rating,
    });
    r.end ();
}
content.outputGetCommentList = (r: Response, x: CommentFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((y) =>
        {
            return {
                "CommentId": y.commentId,
                "ProductId": y.productId,
                "Author": y.author,
                "Title": y.title,
                "Text": y.text,
                "Rating": y.rating,
            }    
        })
        
    });
    r.end ();
}
content.outputGetReview = (r: Response, x: ReviewFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "ReviewId": x.reviewId,
        "ProductId": x.productId,
        "Mime": x.mime,
        "Link": x.link,
    });
    r.end ();
}
content.outputGetReviewtList = (r: Response, x: ReviewFetch []) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "Item": x.map ((y) =>
        {
            return {
                "ReviewId": y.reviewId,
                "ProductId": y.productId,
                "Mime": y.mime,
                "Link": y.link,
            }    
        })
        
    });
    r.end ();
}
content.outputGetStock = (r: Response, x: StockFetch) =>
{
    r.status (http.STATUS_OK);
    r.json ({
        "ProductId": x.productId,
        "Quantity": x.quantity,
    });
    r.end ();
}
content.outputPutBasic = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputPutCategory = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputPutComment = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputPutReview = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputPutStock = (r: Response) =>
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
content.outputPostCategory = (r: Response, id: CategoryId) =>
{
    r.status (http.STATUS_CREATED);
    r.json ({
        "Id": id,
        "Created": new Date ().getTime ()
    });
    r.end ();
}
content.outputPostComment = (r: Response, id: CommentId) =>
{
    r.status (http.STATUS_CREATED);
    r.json ({
        "Id": id,
        "Created": new Date ().getTime ()
    });
    r.end ();
}
content.outputPostReview = (r: Response, id: ReviewId) =>
{
    r.status (http.STATUS_CREATED);
    r.json ({
        "Id": id,
        "Created": new Date ().getTime ()
    });
    r.end ();
}
content.outputDeleteCategory = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputDeleteComment = (r: Response) =>
{
    r.status (http.STATUS_NO_CONTENT);
    r.end ();
}
content.outputDeleteReview = (r: Response) =>
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
content.errorGetCategory = (r: Response, e: unknown) =>
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
content.errorGetComment = (r: Response, e: unknown) =>
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
content.errorGetCommentList = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}
content.errorGetReview = (r: Response, e: unknown) =>
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
content.errorGetReviewList = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}
content.errorGetStock = (r: Response, e: unknown) =>
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
content.errorPutCategory = (r: Response, e: unknown) =>
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
content.errorPutComment = (r: Response, e: unknown) =>
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
content.errorPutReview = (r: Response, e: unknown) =>
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
content.errorPutStock = (r: Response, e: unknown) =>
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
content.errorPostCategory = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}
content.errorPostComment = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}
content.errorPostReview = (r: Response, e: unknown) =>
{
    log.error (e);
    r.status (http.STATUS_SERVICE_UNAVAILABLE);
    r.end ();
}
content.errorDeleteCategory = (r: Response, e: unknown) =>
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
content.errorDeleteComment = (r: Response, e: unknown) =>
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
content.errorDeleteReview = (r: Response, e: unknown) =>
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