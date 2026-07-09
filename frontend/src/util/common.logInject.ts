import logging from "#util/common.log.ts";

const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;
const log = logging.scoped ("Frontend");

const content = function ()
{
    return;
}
content.init = function ()
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
}
/**
 * ยุติการทำงานของระบบ
*/
content.terminate = function ()
{
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
}

Object.freeze (content);
export default content;