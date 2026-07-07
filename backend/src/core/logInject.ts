import logging from "#core/log.ts";

const log = logging.scoped ("LogConsole");

const content = function ()
{
    return;
}
content.init = async function ()
{
    console.log = (... data: unknown []) =>
    {
        log.info (... data);
        return;
    }
    console.warn = (... data: unknown []) =>
    {
        log.warn (... data);
        return;
    }
    console.error = (... data: unknown []) =>
    {
        log.error (... data);
        return;
    }

    return Promise.resolve ();
}

Object.freeze (content);
export default content;