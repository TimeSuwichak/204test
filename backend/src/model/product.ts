import sql              from "#core/sql.ts";
import error            from "#core/error.ts";
import objectReader     from "#core/object.reader.ts";

import { type BasicId as AccountId } from "#model/account.ts";
import { type InputValue, type InputCommand } from "#core/sql.ts";
import { type ObjectReader }     from "#core/object.reader.ts";

/**
 * ระบบจัดการข้อมูลสินค้า
*/
const content = () =>
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
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
 * @param key รหัสสินค้า
*/
content.getBasic = async (key: BasicId) =>
{
    const cmd = `SELECT * FROM Product WHERE Id = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }
        if (!x [0]) {
            throw new error.BadData ();
        }
        return content.readBasic (objectReader (x [0]));
    });
}
/**
 * ดึงข้อมูลรายการสินค้า
*/
content.getBasicList = async (option ?: BasicFetchOption) =>
{
    const whereAnd = 
    [
        [
            "Price >= ?",
            option?.minPrice ? option.minPrice : undefined
        ],
        [
            "Price <= ?",
            option?.maxPrice ? option.maxPrice : undefined
        ]
    ];
    const whereOr = 
    [
        [
            "Name LIKE ?", 
            option?.search ? `%${option.search}%` : undefined
        ],
        [
            "Description LIKE ?", 
            option?.search ? `%${option.search}%` : undefined
        ]
    ];

    const whereCmdAnd = whereAnd
        .filter ((x) => x[1] !== undefined)
        .map ((x) => x [0])
        .join (" AND ");
    const whereCmdOr = whereOr
        .filter ((x) => x[1] !== undefined)
        .map ((x) => x [0])
        .join (" OR ");

    const whereParamAnd = whereAnd
        .map ((x) => x [1])
        .filter ((x) => x !== undefined)

    const whereParamOr = whereOr
        .map ((x) => x [1])
        .filter ((x) => x !== undefined)

    const cmd: InputCommand = `
        SELECT * FROM Product
        ${whereCmdAnd.length || whereCmdOr.length > 0 ? "WHERE" : ""} ${whereCmdAnd} ${whereCmdOr}
    `;
    const param: InputValue = [
        ... whereParamAnd,
        ... whereParamOr
    ];
    console.log (cmd);
    console.log (param);

    const query = await sql.select (cmd, param);
    const item: BasicFetch [] = query.map ((x) =>
    {
        return content.readBasic (objectReader (x));
    }); 
    return item;
}
/**
 * ดึงข้อมูลพื้นฐานของสินค้าด้วยชื่อสินค้า
 * (ข้อมูลอาจมีหลายค่า)
 * 
 * @param key ชื่อสินค้า
*/
content.getBasicByName = (key: string) =>
{
    const cmd = `SELECT * FROM Product WHERE Name = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        return x.map ((x) =>
        {
            return content.readBasic (objectReader (x));
        })
    });
}
/**
 * ดึงข้อมูลพื้นฐานของสินค้าด้วยคำอธิบายสินค้า
 * (ข้อมูลอาจมีหลายค่า)
 * 
 * @param key คำอธิบาย
*/
content.getBasicByDescription = (key: string) =>
{
    const cmd = `SELECT * FROM Product WHERE Description = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        return x.map ((x) =>
        {
            return content.readBasic (objectReader (x));
        })
    });
}
/**
 * ดึงข้อมูลหมวดหมู่ของสินค้า
 * 
 * @param key รหัสความหมวดหมู่สินค้า
*/
content.getCategory = (key: CategoryId) =>
{
    const cmd = `SELECT * FROM ProductCategory WHERE CategoryId = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }

        const reader = objectReader (x.at (0));
        const result: CategoryFetch =
        {
            categoryId: reader.requireInteger ("CategoryId") ,
            productId: reader.requireInteger ("ProductId"),
            value: reader.requireInteger ("Value")
        };
        return result;
    });
}
/**
 * ดึงข้อมูลความคิดเห็นของสินค้า
 * 
 * @param key รหัสความคิดเห็นสินค้า
*/
content.getComment = (key: CommentId) =>
{
    const cmd = `SELECT * FROM ProductComment WHERE CommentId = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }

        const reader = objectReader (x.at (0));
        const result = content.readComment (reader);

        return result;
    });
}
/**
 * ดึงข้อมูลรายการความคิดเห็นของสินค้า
 * 
 * @param key รหัสความคิดเห็นสินค้า
*/
content.getCommentList = (key: BasicId) =>
{
    const cmd = `SELECT * FROM ProductComment WHERE ProductId = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        return x.map ((x) =>
        {
            return content.readComment (objectReader (x));
        });
    });
}
/**
 * ดึงข้อมูลรีวิวของสินค้า
 * 
 * @param key รหัสความหมวดหมู่สินค้า
*/
content.getReview = (key: ReviewId) =>
{
    const cmd = `SELECT * FROM ProductReview WHERE ReviewId = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }

        const reader = objectReader (x.at (0));
        const result: ReviewFetch =
        {
            reviewId: reader.requireInteger ("ReviewId") ,
            productId: reader.requireInteger ("ProductId"),
            mime: reader.requireString ("Mime"),
            link: reader.requireString ("Link")
        };
        return result;
    });
}
/**
 * ดึงข้อมูลรายการตัวอย่างของสินค้า
 * 
 * @param key รหัสความคิดเห็นสินค้า
*/
content.getReviewList = (key: BasicId) =>
{
    const cmd = `SELECT * FROM ProductReview WHERE ProductId = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        return x.map ((x) =>
        {
            return content.readReview (objectReader (x));
        });
    });
}
/**
 * ดึงข้อมูลสต็อกของสินค้า
 * 
 * @param key รหัสสต็อกสินค้า
*/
content.getStock = (key: BasicId) =>
{
    const cmd = `SELECT * FROM ProductStock WHERE ProductId = ?`;
    const param = [key];
    
    return sql.select (cmd, param).then ((x) =>
    {
        if (x.length == 0) {
            throw new error.NotFound ();
        }
        if (x.length >= 2) {
            throw new error.Conflict ();
        }

        const reader = objectReader (x.at (0));
        const result: StockFetch =
        {
            productId: reader.requireInteger ("ProductId"),
            quantity: reader.requireInteger ("Quantity"),
        };
        return result;
    });
}

/**
 * แก้ไขข้อมูลพื้นฐานของสินค้า
 * 
 * @param productId รหัสสินค้า
 * @param info ข้อมูลที่ต้องการแก้ไข
*/
content.updateBasic = async (info: BasicUpdate) : Promise<number> =>
{
    const key = 
    [
        (info.name !== undefined) ? "Name = ?" : undefined,
        (info.description !== undefined) ? "Description = ?" : undefined,
        (info.price !== undefined) ? "Price = ?" : undefined,
        (info.priceCode !== undefined) ? "PriceCode = ?" : undefined,
        (info.platform !== undefined) ? "Platform = ?" : undefined,
        (info.cover !== undefined) ? "Cover = ?" : undefined,
        (info.background !== undefined) ? "Background = ?" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat (" ")
    .concat ("WHERE Id = ?");

    const value = [
        info.name,
        info.description,
        info.price,
        info.priceCode,
        info.platform,
        info.cover,
        info.id
    ]
    .filter (x => x !== undefined);

    return await sql.update (`UPDATE Product SET ${key}`, value);
}
/**
 * อัพเดทหมวดหมู่สินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.updateCategory = (info: CategoryUpdate) =>
{
    const key = [
        (info.value !== undefined) ? "Value = ?" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat (" ")
    .concat ("WHERE CategoryId = ?");

    const value = [
        info.value,
        info.categoryId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductCategory SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product category`);
        }
    });
}
/**
 * แก้ไขข้อมูลความคิดเห็นของสินค้า
 * 
 * @param info ข้อมูลที่ต้องการแก้ไข
 */
content.updateComment = (info: CommentUpdate) =>
{
    const key = [
        (info.title !== undefined) ? "Title = ?" : undefined,
        (info.text !== undefined) ? "Text = ?" : undefined,
        (info.rating !== undefined) ? "Rating = ?" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat (" ")
    .concat ("WHERE CommentId = ?");

    const value = [
        info.title,
        info.text,
        info.rating,
        info.commentId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductComment SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product comment`);
        }
    });
}
/**
 * อัพเดทข้อมูลการรีวิวสินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.updateReview = (info: ReviewUpdate) =>
{
    const key = [
        (info.mime !== undefined) ? "Mime = ?" : undefined,
        (info.link !== undefined) ? "Link = ?" : undefined
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat (" ")
    .concat ("WHERE ReviewId = ?");

    const value = [
        info.mime,
        info.link,
        info.reviewId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductReview SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product review`);
        }
    });
}
/**
 * อัพเดทข้อมูลสต็อกสินค้า
 * 
 * @param info ข้อมูลสต็อกของสินค้า
*/
content.updateStock = (info: StockUpdate) =>
{
    const key = [
        (info.quantity !== undefined) ? "Quantity = ?" : undefined,
    ]
    .filter (x => x !== undefined)
    .join (", ")
    .concat (" ")
    .concat ("WHERE ProductId = ?");

    const value = [
        info.quantity,
        info.productId
    ]
    .filter (x => x !== undefined);

    return sql.update (`UPDATE ProductStock SET ${key}`, value).then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product stock`);
        }
    });
}


/**
 * สร้างข้อมูลสินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.create = async (info: BasicCreate) : Promise<BasicId> =>
{
    const transaction = await sql.transaction ();

    try
    {
        const id = await transaction.insert (`
            INSERT INTO Product 
            (Name, Description, Price, PriceCode, Platform, Background, Cover) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                info.name, 
                info.description, 
                info.price, 
                info.priceCode, 
                info.platform,
                info.background,
                info.cover,
            ]
        ) as BasicId;

        await transaction.insert (`
            INSERT INTO ProductStock (ProductId, Quantity)
            VALUES (?, ?)`,
            [id, 0]
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
 * สร้างข้อมูลความคิดเห็นของสินค้า
 * 
 * @param info ข้อมูลความคิดเห็นของสินค้า
*/
content.createComment = (info: CommentCreate) =>
{
    return sql.insert (`
        INSERT INTO ProductComment (ProductId, Author, Title, Text, Rating)
        VALUES (?, ?, ?, ?, ?)`,
        [
            info.productId,
            info.author,
            info.title,
            info.text,
            info.rating
        ]
    ) as Promise<CommentId>;
}
/**
 * สร้างข้อมูลหมวดหมู่ของสินค้า
 * 
 * @param info ข้อมูลหมวดหมู่ของสินค้า
*/
content.createCategory = (info: CategoryCreate) =>
{
    return sql.insert (`
        INSERT INTO ProductCategory (ProductId, Value)
        VALUES (?, ?)`,
        [info.productId, info.value]
    ) as Promise<CategoryId>;
}
/**
 * สร้างข้อมูลการรีวิวของสินค้า
 * 
 * @param info ข้อมูลความคิดเห็นของสินค้า
*/
content.createReview = (info: ReviewCreate) =>
{
    return sql.insert (`
        INSERT INTO ProductReview (ProductId, Mime, Link)
        VALUES (?, ?, ?)`,
        [
            info.productId,
            info.mime,
            info.link
        ]
    ) as Promise<ReviewId>;
}

/**
 * ลบข้อมูลพื้นฐานของสินค้า
 * 
 * @param id รหัสสินค้า
 */
content.delete = async (id: BasicId) : Promise<void> =>
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
/**
 * ลบข้อมูลความคิดเห็นของสินค้า
 * 
 * @param key รหัสความคิดเห็นสินค้า
*/
content.deleteComment = (key: CommentId) =>
{
    return sql.delete (`
        DELETE FROM ProductComment 
        WHERE CommentId = ?`,
        [key]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product category`);
        }
    });
}
/**
 * ลบข้อมูลหมวดหมู่ของสินค้า
 * 
 * @key รหัสหมวดหมู่
*/
content.deleteCategory = (key: CategoryId) =>
{
    return sql.delete (`
        DELETE FROM ProductCategory 
        WHERE CategoryId = ?`,
        [key]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product category`);
        }
    });
}
/**
 * ลบข้อมูลการรีวิวของสินค้า
 * 
 * @key รหัสหมวดหมู่
*/
content.deleteReview = (key: ReviewId) =>
{
    return sql.delete (`
        DELETE FROM ProductReview 
        WHERE ProductReview = ?`,
        [key]
    )
    .then ((x) =>
    {
        if (x === 0)
        {
            throw new error.NotFound (`No entry of product review`);
        }
    });
}

content.readBasic = (reader: ObjectReader) =>
{
    const result: BasicFetch =
    {
        id: reader.requireInteger ("Id"),
        name: reader.requireString ("Name"),
        description: reader.requireString ("Description"),
        price: reader.requireFloat ("Price"),
        priceCode: reader.requireInteger ("PriceCode"),
        platform: reader.requireInteger ("Platform"),
        background: reader.requireString ("Background"),
        cover: reader.requireString ("Cover")
    };
    return result;
}
content.readComment = (reader: ObjectReader) =>
{
    const result: CommentFetch =
    {
        commentId: reader.requireInteger ("CommentId") ,
        productId: reader.requireInteger ("ProductId"),
        author: reader.requireInteger ("Author"),
        title: reader.requireString ("Title"),
        text: reader.requireString ("Text"),
        rating: reader.requireInteger ("Rating"),
    };
    return result;
}
content.readReview = (reader: ObjectReader) =>
{
    const result: ReviewFetch =
    {
        reviewId: reader.requireInteger ("ReviewId") ,
        productId: reader.requireInteger ("ProductId"),
        mime: reader.requireString ("Mime"),
        link: reader.requireString ("Link")
    };
    return result;
}
/**
 * ไม่มีแพลตฟอร์ม
*/
content.PLATFORM_NONE = 0;
/**
 * แพลตฟอร์ม: Windows
 */
content.PLATFORM_WINDOWS = 1;
/**
 * แพลตฟอร์ม: Android
 */
content.PLATFORM_ANDROID = 2;
/**
 * แพลตฟอร์ม: Linux
 */
content.PLATFORM_LINUX = 3;
/**
 * แพลตฟอร์ม: MacOS
 */
content.PLATFORM_MACOS = 4;
/**
 * แพลตฟอร์ม: iOS
 */
content.PLATFORM_IOS = 5;
/**
 * แพลตฟอร์ม: PlayStation 1
 */
content.PLATFORM_PLAYSTATION_1 = 6;
/**
 * แพลตฟอร์ม: PlayStation 2
 */
content.PLATFORM_PLAYSTATION_2 = 7;
/**
 * แพลตฟอร์ม: PlayStation 3
 */
content.PLATFORM_PLAYSTATION_3 = 8;
/**
 * แพลตฟอร์ม: PlayStation 4
 */
content.PLATFORM_PLAYSTATION_4 = 9;
/**
 * แพลตฟอร์ม: PlayStation 5
 */
content.PLATFORM_PLAYSTATION_5 = 10;
/**
 * แพลตฟอร์ม: XBOX
 */
content.PLATFORM_XBOX = 11;
/**
 * แพลตฟอร์ม: XBOX 360
 */
content.PLATFORM_XBOX_360 = 12;
/**
 * แพลตฟอร์ม: XBOX One
 */
content.PLATFORM_XBOX_ONE = 13;
/**
 * แพลตฟอร์ม: XBOX One S
 */
content.PLATFORM_XBOX_ONE_S = 14;
/**
 * แพลตฟอร์ม: XBOX One X
 */
content.PLATFORM_XBOX_ONE_X = 15;
/**
 * แพลตฟอร์ม: XBOX Series X
 */
content.PLATFORM_XBOX_SERIES_X = 16;
/**
 * แพลตฟอร์ม: XBOX Series S
 */
content.PLATFORM_XBOX_SERIES_S = 17;

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface BasicFetch
{
    /**
     * รหัสสินค้า
    */
    id: BasicId;
    /**
     * ชื่อสินค้า
    */
    name: string;
    /**
     * คำอธิบายสินค้า
    */
    description: string;
    /**
     * ราคาของสินค้า
    */
    price: number;
    /**
     * สกุลเงินของราคาสินค้า
    */
    priceCode: number;
    /**
     * แพลตฟอร์ม
    */
    platform: number;
    /**
     * พื้นหลังสินค้า
    */
    background: string;
    /**
     * รูปปกเกม
    */
    cover: string;
}
export interface BasicFetchOption
{
    search ?: string | undefined;
    category ?: number [] | undefined;
    minPrice ?: number;
    maxPrice ?: number;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface BasicUpdate
{
    /**
     * รหัสสินค้า
    */
    id: BasicId;
    /**
     * ชื่อสินค้า
    */
    name ?: string | undefined;
    /**
     * คำอธิบายสินค้า
    */
    description ?: string | undefined;
    /**
     * ราคา
    */
    price ?: number | undefined;
    /**
     * รหัสสกุลเงิน
    */
    priceCode ?: number | undefined;
    /**
     * แพลตฟอร์ม
    */
    platform ?: number | undefined;
    /**
     * พื้นหลังสินค้า
    */
    background ?: string | undefined;
    /**
     * รูปปกเกม
    */
    cover ?: string | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface BasicCreate
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
     * แพลตฟอร์ม
    */
    platform: number;
    /**
     * พื้นหลังสินค้า
    */
    background: string;
    /**
     * รูปปกสินค้า
    */
    cover: string;
}

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface CategoryFetch
{
    /**
     * รหัสเอกลักษณ์
    */
    categoryId: CategoryId;
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัสหมวดหมู่
    */
    value: number;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface CategoryUpdate
{
    /**
     * รหัสเอกลักษณ์
    */
    categoryId: CategoryId;
    /**
     * รหัสหมวดหมู่
    */
    value ?: number | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface CategoryCreate
{
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัสหมวดหมู่
    */
    value: number;
}

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface CommentFetch
{
    /**
     * รหัสเอกลักษณ์
    */
    commentId: CommentId;
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัสบัญชีของผู้เขียน
    */
    author: AccountId;
    /**
     * หัวเรื่อง
    */
    title: string;
    /**
     * ข้อความ
    */
    text: string;
    /**
     * คะแนน
    */
    rating: number;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface CommentUpdate
{
    /**
     * รหัสเอกลักษณ์
    */
    commentId: CommentId;
    /**
     * หัวเรื่อง
    */
    title ?: string | undefined;
    /**
     * ข้อความ
    */
    text ?: string | undefined;
    /**
     * คะแนน
    */
    rating ?: number | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface CommentCreate
{
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัสบัญชีของผู้เขียน
    */
    author: AccountId;
    /**
     * หัวเรื่อง
    */
    title: string;
    /**
     * ข้อความ
    */
    text: string;
    /**
     * คะแนน
    */
    rating: number;
}

/**
 * โครงสร้างข้อมูลที่ได้รับจากการดึงข้อมูลในฐานข้อมูล
*/
export interface ReviewFetch
{
    /**
     * รหัสเอกลักษณ์
    */
    reviewId: ReviewId;
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัส MIME
    */
    mime: string;
    /**
     * ลิงค์ที่อยู่ของทรัพยากร
    */
    link: string;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการเปลี่ยนแปลงข้อมูลในฐานข้อมูล
*/
export interface ReviewUpdate
{
    /**
     * รหัสเอกลักษณ์
    */
    reviewId: ReviewId;
    /**
     * รหัส MIME
    */
    mime ?: string | undefined;
    /**
     * ลิงค์ที่อยู่ของทรัพยากร
    */
    link ?: string | undefined;
}
/**
 * โครงสร้างข้อมูลที่ใช้ในการสร้างข้อมูลลงในฐานข้อมูล
*/
export interface ReviewCreate
{
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * รหัส MIME
    */
    mime: string;
    /**
     * ลิงค์ที่อยู่ของทรัพยากร
    */
    link: string;
}

export interface StockFetch
{
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * จำนวนสินค้า
    */
    quantity: number;
}
export interface StockUpdate
{
    /**
     * รหัสสินค้า
    */
    productId: BasicId;
    /**
     * จำนวนสินค้า
    */
    quantity ?: number | undefined;
}

/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type BasicId = number;
/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type CategoryId = number;
/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type CommentId = number;
/**
 * รหัสของชุดรหัสข้อมูล (หรือเรียกอีกอย่างว่า PRIMARY KEY)
*/
export type ReviewId = number;

/**
 * ส่งออกตัวแปร
*/
export default content;