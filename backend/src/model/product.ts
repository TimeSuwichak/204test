import error        from "#core/error.ts";
import sql          from "#core/sql.ts";
import objreader    from "#core/objectReader.ts";
import 
{
    type AccountId
}
from "#model/account.ts";
import
{
    type InputCommand as SqlCommand,
    type InputValue as SqlValue
}
from "#core/sql.ts";

export type ProductId = number;
export type ProductCategoryId = number;
export type ProductReviewId = number;
export type ProductCommentId = number;
export type ProductStockId = number;
export type ProductOrderId = number;

export interface GetProductBasic
{
    /**
     * รหัสสินค้า
    */
    id: ProductId;
    /**
     * ชื่อสินค้า
    */
    name: string;
    /**
     * คำอธิบายสินค้า
    */
    description: string;

    /**
     * รายการตัวอย่างสินค้า
    */
    review: ProductReviewId [];
    /**
     * รายการความคิดเห็นสินค้า
    */
    comment: ProductCommentId [];
}
export interface GetProductComment
{
    /**
     * รหัสความคิดเห็นสินค้า
    */
    commentId: ProductCommentId;
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * รหัสบัญชีผู้เขียน
    */
    author: AccountId;
    /**
     * หัวข้อความคิดเห็น
    */
    title: string;
    /**
     * เนื้อหาความคิดเห็น
    */
    text: string;
}
export interface GetProductOrder
{
    /**
     * รหัสคำสั่งซื้อ
    */
    orderId: ProductOrderId;
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * วันที่สร้าง
    */
    created: Date;
    /**
     * วันที่รับสินค้า
    */
    delivered: Date;
    /**
     * สถานะ
    */
    status: number;
}
export interface GetProductReview
{
    /**
     * รหัสตัวอย่างสินค้า
    */
    reviewId: ProductReviewId;
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * ประเภท MIME
    */
    mime: string;
    /**
     * ลิงก์ตัวอย่าง
    */
    link: string;
}
export interface GetProductStock
{
    /**
     * รหัสสต๊อกสินค้า
    */
    productId: ProductStockId;
    /**
     * จำนวนสินค้าในสต๊อก
    */
    quantity: number;
}

export interface UpdateProductBasic
{
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * ชื่อสินค้า
    */
    name ?: string;
    /**
     * คำอธิบายสินค้า
    */
    description ?: string;
    /**
     * ราคา
    */
    price ?: number;
    /**
     * รหัสสกุลเงิน
    */
    priceCode ?: number;
}
export interface UpdateProductCategory
{
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * รหัสหมวดหมู่สินค้า
    */
    value ?: number;
}
export interface UpdateProductReview
{
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * รหัสตัวอย่างสินค้า
    */
    reviewId: ProductReviewId;
    /**
     * ประเภท MIME
    */
    mime ?: string;
    /**
     * ลิงก์ตัวอย่าง
    */
    link ?: string;
}
export interface UpdateProductComment
{
        /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * รหัสความคิดเห็นสินค้า
    */
    commentId: ProductCommentId;
    /**
     * หัวข้อความคิดเห็น
    */
    title ?: string;
    /**
     * เนื้อหาความคิดเห็น
    */
    text ?: string;
    /**
     * คะแนน
    */
    rating ?: number;
}
export interface UpdateProductStock
{
    /**
     * รหัสสินค้า
    */
    productId: ProductStockId;
    /**
     * จำนวนสินค้าในสต๊อก
    */
    quantity ?: number;
}
export interface UpdateProductOrder
{
    /**
     * วันที่สร้าง
    */
    created ?: Date;
    /**
     * วันที่รับสินค้า
    */
    received ?: Date;
    /**
     * สถานะ
    */
    status ?: number;
}

export interface CreateProduct
{
    /**
     * ชื่อสินค้า
    */
    name: string;
    /**
     * คำอธิบายสินค้า
    */
    description: string;
    /**
     * ราคา
    */
    price: number;
    /**
     * รหัสสกุลเงิน
    */
    priceCode: number;
    /**
     * รายการหมวดหมู่สินค้า
    */
    category: {
        /**
         * รหัสหมวดหมู่สินค้า
        */
        value: number;
    } [];
    /**
     * รายการลิงก์ตัวอย่างสินค้า
    */
    review: {
        /**
         * ประเภท MIME
        */
        mime: string;
        /**
         * ลิงก์ตัวอย่าง
        */
        link: string;
    }[];
    /**
     * ข้อมูลสต๊อกสินค้า
    */
    stock: {
        /**
         * จำนวนสินค้าในสต๊อก
        */
        quantity: number;
    };
}
export interface CreateProductCategory
{
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * รหัสหมวดหมู่สินค้า
    */
    value: number;
}
export interface CreateProductComment
{
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * รหัสบัญชีผู้เขียน
    */
    author: AccountId;
    /**
     * หัวข้อความคิดเห็น
    */
    title: string;
    /**
     * เนื้อหาความคิดเห็น
    */
    text: string;
    /**
     * คะแนน
    */
    rating: number;
}
export interface CreateProductReview
{
    /**
     * รหัสสินค้า
    */
    productId: ProductId;
    /**
     * ประเภท MIME
    */
    mime: string;
    /**
     * ลิงก์ตัวอย่าง
    */
    link: string;
}

/**
 * ระบบจัดการข้อมูลสินค้า
*/
const content = function ()
{
    return;
}
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = () =>
{
    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ
 */
content.terminate = () =>
{
    return;
}
/**
 * ดึงข้อมูลพื้นฐานของสินค้า
 * 
 * @param productId รหัสสินค้า
*/
content.getBasic = async (
    productId: number
) : Promise<GetProductBasic> =>
{
    const cmd = `SELECT * FROM Product WHERE Id = ?`;
    const param = [productId];
    const basic = await sql.select (cmd, param);

    if (basic.length == 0) {
        throw new error.NotFound ();
    }
    if (basic.length >= 2) {
        throw new error.Conflict ();
    }

    const bread = objreader (basic.at (0));
    const output: GetProductBasic =
    {
        id: bread.requireInteger ("Id"),
        name: bread.requireString ("Name"),
        description: bread.requireString ("Description"),
        review: [],
        comment: []
    };

    return output;
}
/**
 * ดำเนินการต่อการดึงข้อมูลความคิดเห็นของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param commentId รหัสความคิดเห็นสินค้า
*/
content.getComment = async (
    productId: number, 
    commentId: number
) : Promise<GetProductComment> =>
{
    const cmd = `
        SELECT * FROM ProductComment 
        WHERE CommentId = ? AND ProductId = ?
    `;
    const param = [commentId, productId];
    const query = await sql.select (cmd, param);

    if (query.length == 0) {
        throw new error.NotFound ();
    }
    if (query.length >= 2) {
        throw new error.Conflict ();
    }

    const data = objreader (query.at (0));
    const output: GetProductComment =
    {
        commentId: data.requireInteger ("CommentId"),
        productId: data.requireInteger ("ProductId"),
        author: data.requireInteger ("Author"),
        title: data.requireString ("Title"),
        text: data.requireString ("Text"),
    };
    return output;
}
content.getOrder = async (
    orderId: number
) : Promise<GetProductOrder> =>
{
    const cmd = `SELECT * FROM ProductOrder WHERE OrderId = ?`;
    const param = [orderId];
    const query = await sql.select (cmd, param);

    if (query.length == 0) {
        throw new error.NotFound ();
    }
    if (query.length >= 2) {
        throw new error.Conflict ();
    }

    const data = objreader (query.at (0));
    const output: GetProductOrder =
    {
        orderId: data.requireInteger ("OrderId"),
        productId: data.requireInteger ("ProductId"),
        created: data.requireDate ("Created"),
        delivered: data.requireDate ("Delivered"),
        status: data.requireInteger ("Status")
    };
    return output;
}
/**
 * ดึงข้อมูลตัวอย่างของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param reviewId รหัสตัวอย่างสินค้า
*/
content.getReview = async (
    productId: number, 
    reviewId: number
) : Promise<GetProductReview> =>
{
    const cmd = `
        SELECT * FROM ProductReview 
        WHERE ReviewId = ? AND ProductId = ?
    `;
    const param = [reviewId, productId];
    const query = await sql.select (cmd, param);

    if (query.length == 0) {
        throw new error.NotFound ();
    }
    if (query.length >= 2) {
        throw new error.Conflict ();
    }
    const data = objreader (query.at (0));
    const output: GetProductReview =
    {
        reviewId: data.requireInteger ("ReviewId"),
        productId: data.requireInteger ("ProductId"),
        mime: data.requireString ("Mime"),
        link: data.requireString ("Link")
    };
    return output;
}
/**
 * ดำเนินการต่อการดึงข้อมูลสต๊อกของสินค้า
 * 
 * @param productId รหัสสินค้า
*/
content.getStock = async (
    productId: number
) : Promise<GetProductStock> =>
{
    const cmd = `SELECT Id, Quantity FROM Product WHERE Id = ?`;
    const param = [productId];
    const query = await sql.select (cmd, param);

    if (query.length == 0) {
        throw new error.NotFound ();
    }
    if (query.length >= 2) {
        throw new error.Conflict ();
    }

    const reader = objreader (query.at (0));
    const result: GetProductStock =
    {
        productId: reader.requireInteger ("Id"),
        quantity: reader.requireInteger ("Quantity")
    };
    return result;
}

/**
 * แก้ไขข้อมูลพื้นฐานของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param info ข้อมูลที่ต้องการแก้ไข
*/
content.updateBasic = async (info: UpdateProductBasic) : Promise<number> =>
{
    const key: SqlCommand = [
        info.name ? "Name" : undefined,
        info.description ? "Description" : undefined,
        info.price ? "Price" : undefined,
        info.priceCode ? "PriceCode" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE ProductId = ?");

    const value: SqlValue = [
        info.name,
        info.description,
        info.price,
        info.priceCode,
        info.productId
    ]
    .filter (x => x !== undefined);

    return await sql.update (`UPDATE Product SET ${key}`, value);
}
content.updateCategory = async (info: UpdateProductCategory) 
    : Promise<number> =>
{
    const key: SqlCommand = [
        info.value ? "Value" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE ProductId = ?");

    const value: SqlValue = [
        info.value,
        info.productId
    ]
    .filter (x => x !== undefined);

    return await sql.update (`UPDATE ProductCategory SET ${key}`, value);
}
/**
 * แก้ไขข้อมูลตัวอย่างของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param reviewId รหัสตัวอย่างสินค้า
 * @param info ข้อมูลที่ต้องการแก้ไข
*/
content.updateReview = async (info: UpdateProductReview) : Promise<number> =>
{
    const key: SqlCommand = [
        info.mime ? "Mime" : undefined,
        info.link ? "Link" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE ReviewId = ? AND ProductId = ?");

    const value: SqlValue = [
        info.mime,
        info.link,
        info.reviewId,
        info.productId
    ]
    .filter (x => x !== undefined);

    return await sql.update (`UPDATE ProductReview SET ${key}`, value);
}
/**
 * แก้ไขข้อมูลความคิดเห็นของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param commentId รหัสความคิดเห็นสินค้า
 * @param info ข้อมูลที่ต้องการแก้ไข
 */
content.updateComment = async (info: UpdateProductComment) : Promise<number> =>
{
    const key: SqlCommand = [
        info.title ? "Title" : undefined,
        info.text ? "Text" : undefined,
        info.rating ? "Rating" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE CommentId = ? AND ProductId = ?");

    const value: SqlValue = [
        info.title,
        info.text,
        info.rating,
        info.commentId,
        info.productId
    ]
    .filter (x => x !== undefined);

    return await sql.update (`UPDATE ProductComment SET ${key}`, value);
}
/**
 * แก้ไขข้อมูลสต๊อกของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param quantity จำนวนสินค้า
 */
content.updateStock = async (info: UpdateProductStock) 
: Promise<ProductStockId> =>
{
    const key: SqlCommand = [
        info.quantity ? "Quantity" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat ("WHERE Id = ?");

    const value: SqlValue = [
        info.quantity,
        info.productId
    ]
    .filter (x => x !== undefined);

    return await sql.update (`UPDATE ProductStock SET ${key}`, value);
}
content.create = async (info: CreateProduct) : Promise<ProductId> =>
{
    const transaction = await sql.transaction ();

    try
    {
        const id = await transaction.insert (`
            INSERT INTO Product (Name, Description, Price, PriceCode) 
            VALUES (?, ?, ?, ?)`,
            [info.name, info.description, info.price, info.priceCode]
        ) as ProductId;

        for (const category of info.category)
        {
            await transaction.insert (`
                INSERT INTO ProductCategory (ProductId, Value)
                VALUES (?, ?)`,
                [id, category.value]
            );
        }
        for (const review of info.review)
        {
            await transaction.insert (`
                INSERT INTO ProductReview (ProductId, Mime, Link)
                VALUES (?, ?, ?)`,
                [id, review.mime, review.link]
            );
        }
        await transaction.insert (`
            INSERT INTO ProductStock (ProductId, Quantity)
            VALUES (?, ?)`,
            [id, info.stock.quantity]
        );

        await transaction.commit ();
        return id;
    }
    catch (e)
    {
        await transaction.rollback ();
        throw e;
    }
    finally
    {
        transaction.release ();
    }
}
/**
 * สร้างข้อมูลหมวดหมู่ของสินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.createCategory = async (info: CreateProductCategory)
    : Promise<ProductCategoryId> =>
{
    const id = await sql.insert (`
        INSERT INTO ProductCategory (ProductId, Value)
        VALUES (?, ?)`,
        [info.productId, info.value]
    );
    return id as ProductCategoryId;
}
/**
 * สร้างข้อมูลความคิดเห็นของสินค้า
 * 
 * @param info ข้อมูลความคิดเห็นของสินค้า
*/
content.createComment = async (info: CreateProductComment) 
    : Promise<ProductCommentId> =>
{
    const id = await sql.insert (`
        INSERT INTO ProductComment (ProductId, Author, Title, Text, Rating) 
        VALUES (?, ?, ?, ?, ?)`, 
        [info.productId, info.author, info.title, info.text, info.rating]
    );
    return id as ProductCommentId;
}
/**
 * สร้างข้อมูลตัวอย่างของสินค้า
 * 
 * @param info ข้อมูลตัวอย่างของสินค้า
*/
content.createReview = async (info: CreateProductReview) 
    : Promise<ProductReviewId> =>
{
    const id = await sql.insert (`
        INSERT INTO ProductReview (ProductId, Mime, Link) 
        VALUES (?, ?, ?)`, 
        [info.productId, info.mime, info.link]
    );
    return id as ProductReviewId;
}


/**
 * ลบข้อมูลพื้นฐานของสินค้า
 * 
 * @param id รหัสสินค้า
 */
content.delete = async (id: ProductId) : Promise<void> =>
{
    const transaction = await sql.transaction ();
    
    try
    {
        await transaction.delete (`
            DELETE FROM ProductCategory 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM ProductReview 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM ProductComment 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM ProductStock 
            WHERE ProductId = ?`,
            [id]
        );
        await transaction.delete (`
            DELETE FROM Product 
            WHERE Id = ?`,
            [id]
        );

        await transaction.commit ();
    }
    catch (e)
    {
        await transaction.rollback ();
        throw e;
    }
    finally
    {
        transaction.release ();
    }
};
content.deleteReview = async (
    productId: ProductId, 
    reviewId: ProductReviewId
) : Promise<void> =>
{
    await sql.delete (`
        DELETE FROM ProductReview 
        WHERE ReviewId = ? AND ProductId = ?`,
        [reviewId, productId]
    );
}
content.deleteComment = async (
    productId: ProductId, 
    commentId: ProductCommentId
) : Promise<void> =>
{
    await sql.delete (`
        DELETE FROM ProductComment 
        WHERE CommentId = ? AND ProductId = ?`,
        [commentId, productId]
    );
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;