import logging          from "#core/log.ts";
import objectReader     from "#core/object.reader.ts";
import modelAuth        from "#model/auth.ts";
import modelAccount     from "#model/account.ts";
import modelProd        from "#model/product.ts";

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
    const location = path.resolve (path.join (cwd, "data", "sample", filename));
    const json = objectReader (JSON.parse (fs.readFileSync (location, "utf8")));
    const item = json.requireArrayRecord ("Item");

    for (const x of item)
    {
        const read = objectReader (x);
        const name = read.requireString ("Name");
        const desc = read.requireString ("Description");
        const price = read.requireFloat ("Price");
        // const priceCode = read.requireInteger ("PriceCode");

        await content.setupProductFor (name, desc, price);
    }

    log.info ("Setting up test products completed");
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
                role: accountRole
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
content.setupProductFor = async (
    productName: string,
    productDesc: string,
    price: number
) =>
{
    try
    {
        await modelProd.getBasicByName (productName);
        log.info (`Skipped: ${productName}`);
    }
    catch
    {
        try
        {
            await modelProd.create ({
                name: productName,
                description: productDesc,
                price: price,
                priceCode: 1,
                platform: modelProd.PLATFORM_WINDOWS,
            });
        }
        catch (e: unknown)
        {
            log.error (`Product cannot be created, ignored: ${productName}`);
            log.error (e);
            return;
        }
        log.info (`Created: ${productName}`);
    }
    return;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;