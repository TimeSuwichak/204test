import logging          from "#core/log.ts";
import objectReader     from "#core/object.reader.ts";
import modelAuth        from "#model/auth.ts";
import modelAccount     from "#model/account.ts";
import modelProd        from "#model/product.ts";
import modelStorage     from "#model/storage.ts";
import modelPromotion   from "#model/promotion.ts";

import path from "node:path";
import fs from "node:fs";

import { type BasicId as DataAuthId } from "#model/auth.ts";
import { type BasicId as DataAccountId } from "#model/account.ts";
import { type BasicFetch as DataAuth } from "#model/auth.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("TestMode");
/**
 * ระบบจัดการระบบทดสอบ
*/
const content = () =>
{
    return;
}
content.setupAccount = async () =>
{
    log.info ("Setting up test accounts ...");

    const cwd = process.cwd ();
    const filename = "account.json";
    const location = path.resolve (path.join (cwd, "data", "sample", filename));
    const json = objectReader (JSON.parse (fs.readFileSync (location, "utf8")));
    const item = json.requireArrayRecord ("Item");

    for (const x of item)
    {
        const read = objectReader (x);
        const id = read.requireString ("Id");
        const pwd = read.requireString ("Password");
        const name = read.requireString ("Name");
        const role = read.requireInteger ("Role");

        await content.setupAccountFor (id, pwd, name, role);
    }
    log.info ("Setting up test accounts completed");
    return;
}
content.setupProduct = async () =>
{
    log.info ("Setting up test products ...");

    const cwd = process.cwd ();
    const filename = "product.json";
    const folder = path.resolve (path.join (cwd, "data", "sample"));
    const location = path.resolve (path.join (folder, filename));
    const json = objectReader (JSON.parse (fs.readFileSync (location, "utf8")));
    const item = json.requireArrayRecord ("Item");

    for (const x of item)
    {
        const read = objectReader (x);
        const name = read.requireString ("Name");
        const desc = read.requireString ("Description");
        const price = read.requireFloat ("Price");
        const priceCode = read.requireInteger ("PriceCode");
        const platform = read.requireInteger ("Platform");
        const bg = read.requireString ("Background");
        const cover = read.requireString ("Cover");

        const bgPath = path.resolve (path.join (folder, bg));
        const coverPath = path.resolve (path.join (folder, cover));

        const bgBin = bg !== "" ?
            fs.existsSync (bgPath) ? 
            fs.readFileSync (bgPath) : undefined : undefined;

        const coverBin = cover !== "" ?
            fs.existsSync (coverPath) ?
            fs.readFileSync (coverPath) : undefined : undefined;

        try
        {
            await modelProd.getBasicByName (name);
            log.info (`Skipped: ${name}`);
        }
        catch
        {
            try
            {
                const bgId = bgBin ? 
                    await modelStorage.createWriter (bgBin) : undefined;
                const coverId = coverBin ?  
                    await modelStorage.createWriter (coverBin) : undefined;

                await modelProd.create ({
                    name: name,
                    description: desc,
                    price: price,
                    priceCode: priceCode,
                    platform: platform,
                    background: bgId ?? "",
                    cover: coverId ?? "",
                });
            }
            catch (e: unknown)
            {
                log.error (`Product cannot be created, ignored: ${name}`);
                log.error (e);
                return;
            }
            log.info (`Created: ${name}`);
        }
    }

    log.info ("Setting up test products completed");
    return;
}
content.setupPromotion = async () =>
{
    log.info ("Setting up test promotions ...");

    const cwd = process.cwd ();
    const filename = "promotion.json";
    const folder = path.resolve (path.join (cwd, "data", "sample"));
    const location = path.resolve (path.join (folder, filename));

    if (!fs.existsSync (location))
    {
        log.warn (`File not found, skipped: ${location}`);
        return;
    }

    const json = objectReader (JSON.parse (fs.readFileSync (location, "utf8")));
    const item = json.requireArrayRecord ("Item");

    for (const x of item)
    {
        const read = objectReader (x);
        const pid = read.requireString ("Id");
        const expire = read.requireString ("Expire");
        const type = read.requireInteger ("Type");
        const discount = read.requireInteger ("Discount");
        const minPrice = read.requireFloat ("MinPrice");
        const maxDiscount = read.requireFloat ("MaxDiscount");

        try
        {
            await modelPromotion.getBasic (pid);
            log.info (`Skipped: ${pid}`);
            continue;
        }
        catch
        {
            ;
        }

        try
        {
            const id = await modelPromotion.create ({
                id: pid,
                expire: new Date (expire),
                type: type,
                discount: discount,
                minPrice: minPrice,
                maxDiscount: maxDiscount
            });
            log.info (`Created Promotion ID: ${id}`);
        }
        catch (e: unknown)
        {
            log.error (`Promotion cannot be created, ignored: ${pid}`);
            log.error (e);
        }
    }

    log.info ("Setting up test promotions completed");
    return;
}
content.setupAccountFor = async (
    authId: DataAuthId,
    authPwd: string,
    accountName: string,
    accountRole: number
) =>
{
    let auth: DataAuth;
    let link: DataAccountId;

    try
    {
        auth = await modelAuth.getDb (authId);
        link = auth.link;
    }
    catch
    {
        try
        {
            link = await modelAccount.create ({
                name: accountName,
                role: accountRole,
                icon: "",
                status: modelAccount.RESTRICTION_NONE,
            });
            await modelAuth.createDb (authId, authPwd, link);
        }
        catch (e: unknown)
        {
            log.error (`Account cannot be created, ignored: ${accountName}`);
            log.error (e);
            return;
        }
    }
    const session = await modelAuth.createSession (
        new Date (), undefined,
        link, accountRole,
        modelAccount.RESTRICTION_NONE
    );

    log.info (`Name: ${accountName}`);
    log.info (`Session: ${session.raw}`);
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;