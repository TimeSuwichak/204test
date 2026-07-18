import logging          from "#core/log.ts";
import modelAuth        from "#model/auth.ts";
import modelAuthSignUp  from "#model/auth.signup.ts";
import modelAccount     from "#model/account.ts";
import modelProd        from "#model/product.ts";

import { type DataId as DataAuthId } from "#model/auth.ts";
import { type DataId as DataAccountId } from "#model/account.ts";
import { type DataFetch as DataAuth } from "#model/auth.signup.ts";

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

    await content.setupAccountFor (
        "Admin", "12345678", 
        "Administrator", modelAccount.ROLE_MANAGER
    );
    await content.setupAccountFor (
        "Staff", "12345678", 
        "Staff", modelAccount.ROLE_STAFF
    );
    await content.setupAccountFor (
        "User", "12345678", 
        "User", modelAccount.ROLE_USER
    );
    await content.setupAccountFor (
        "ItsJeremie", "12345678", 
        "ItsJeremie", modelAccount.ROLE_USER
    );
    await content.setupAccountFor (
        "Tess", "12345678", 
        "Tess Tester", modelAccount.ROLE_DEVELOPER
    );

    log.info ("Setting up test accounts completed");
    return;
}
content.setupProduct = async () =>
{
    log.info ("Setting up test products ...");

    await content.setupProductFor (
        "Battlefield 1", 
        `Battlefield 1 is a 2016 first-person shooter game developed by DICE 
        and published by Electronic Arts. It is the fifteenth installment in 
        the Battlefield series. It was released for PlayStation 4, 
        Microsoft Windows, and Xbox One in October 2016.`,
        1099
    );
    await content.setupProductFor (
        "Dying Light",
        `Dying Light is a 2015 survival horror video game developed 
         by Techland and originally published by Warner Bros. Interactive 
         Entertainment. The game's story follows undercover agent 
         Kyle Crane who  is sent to infiltrate a quarantine zone in a 
         fictional Middle Eastern city called Harran.`,
        748
    );
    await content.setupProductFor (
        "Dying Light 2",
        `Dying Light 2 Stay Human is a 2022 action role-playing survival horror 
        game developed and published by Techland. The game is a sequel to Dying 
        Light, and was released for PlayStation 4, PlayStation 5, Windows, Xbox 
        One, and Xbox Series X/S on February 4, 2022.`,
        1899
    );
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
        auth = await modelAuthSignUp.get (authId);
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
            await modelAuthSignUp.create (authId, authPwd, link);
        }
        catch (e: unknown)
        {
            log.error (`Account cannot be created, ignored: ${accountName}`);
            log.error (e);
            return;
        }
    }
    const session = await modelAuth.create (
        new Date (), undefined,
        link, accountRole,
        modelAccount.RESTRICTION_NONE
    );

    log.info (`Name: ${accountName}`);
    log.info (`Session: ${session.session}`);
}
content.setupProductFor = async (
    productName: string,
    productDesc: string,
    price: number
) =>
{
    try
    {
        await modelProd.getByName (productName);
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