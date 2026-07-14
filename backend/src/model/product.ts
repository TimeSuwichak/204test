import error        from "#core/error.ts";
import sql          from "#core/sql.ts";
import objreader    from "#core/objectReader.ts";
import 
{
    type AccountId
}
from "#model/account.ts";

export type ProductId = number;
export type ProductPreviewId = number;
export type ProductCommentId = number;

export interface Product
{
    id: ProductId;
    name: string;
    description: string;

    preview: ProductPreviewId [];
    comment: ProductCommentId [];
}
export interface ProductPreview
{
    id: ProductPreviewId;
    inherited: ProductId;
    mime: string;
    link: string;
}
export interface ProductComment
{
    id: ProductCommentId;
    inherited: ProductId;
    author: AccountId;
    title: string;
    text: string;
}

export interface CreateProduct
{
    name: string;
    description: string;
    price: number;
    priceCode: string;
}
export interface CreateProductPreview
{
    inherited: ProductId;
    mime: string;
    link: string;
}
export interface CreateProductComment
{
    inherited: ProductId;
    author: AccountId;
    title: string;
    text: string;
    rating: number;
}

/**
 * ระบบจัดการข้อมูลสินค้า
*/
const content = function ()
{
    return;
}

content.getBasic = async (id: number) : Promise<Product> =>
{
    let cmd = `SELECT * FROM Product WHERE Id = ?`;
    let param = [id];
    const basic = await sql.select (cmd, param);

    if (basic.length == 0) {
        throw new error.NotFound ();
    }
    if (basic.length >= 2) {
        throw new error.Conflict ();
    }

    cmd = `SELECT Id FROM ProductPreview WHERE Inherited = ?`;
    param = [id];
    const preview = await sql.select (cmd, param);

    const bread = objreader (basic.at (0));
    const pread = objreader (preview.at (0));
    const output: Product =
    {
        id: bread.requireInteger ("Id"),
        name: bread.requireString ("Name"),
        description: bread.requireString ("Description"),
        preview: [],
        comment: []
    };
    console.log (pread);

    return output;
}
content.getPreview = async (
    id: number, 
    pid: number
) : Promise<ProductPreview> =>
{
    const cmd = `SELECT * FROM ProductPreview WHERE Id = ? AND Inherited = ?`;
    const param = [pid, id];
    const basic = await sql.select (cmd, param);

    if (basic.length == 0) {
        throw new error.NotFound ();
    }
    if (basic.length >= 2) {
        throw new error.Conflict ();
    }

    const output: ProductPreview =
    {
        id: 0,
        inherited: 0,
        mime: "",
        link: ""
    };
    return output;
}
content.getComment = async (
    id: number, 
    cid: number
) : Promise<ProductComment> =>
{
    const cmd = `SELECT * FROM ProductComment WHERE Id = ? AND Inherited = ?`;
    const param = [cid, id];
    const basic = await sql.select (cmd, param);

    if (basic.length == 0) {
        throw new error.NotFound ();
    }
    if (basic.length >= 2) {
        throw new error.Conflict ();
    }

    const output: ProductComment =
    {
        id: 0,
        inherited: 0,
        author: 0,
        title: "",
        text: "",
    };
    return output;
}

content.create = async (info: CreateProduct) : Promise<ProductId> => 
{
    const id = await sql.insert (`
        INSERT INTO Product (Name, Description, Price, PriceCode) 
        VALUES (?, ?, ?, ?)`, 
        [info.name, info.description, info.price, info.priceCode]
    );
    return id as ProductId;
};
content.createPreview = async (info: CreateProductPreview) 
    : Promise<ProductPreviewId> =>
{
    const id = await sql.insert (`
        INSERT INTO Product (Inherited, Mime, Link) 
        VALUES (?, ?, ?)`, 
        [info.inherited, info.mime, info.link]
    );
    return id as ProductPreviewId;
}
content.createComment = async (info: CreateProductComment) 
    : Promise<ProductPreviewId> =>
{
    const id = await sql.insert (`
        INSERT INTO Product (Inherited, Author, Title, Text, Rating) 
        VALUES (?, ?, ?, ?, ?)`, 
        [info.inherited, info.author, info.title, info.text, info.rating]
    );
    return id as ProductCommentId;
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;