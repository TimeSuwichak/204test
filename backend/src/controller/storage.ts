import logging  from "#core/log.ts";
import reader   from "#core/object.reader.ts";
import http     from "#core/http.ts";
import error    from "#core/error.ts";
import model    from "#model/storage.ts";

import { type Request, type Response } from "#core/http.ts";

/**
 * ระบบบันทึกกิจกรรมการทำงาน
*/
const log = logging.scoped ("Stroage");
/**
 * เริ่นต้นการทำงานของระบบจัดเก็บข้อมูลไฟล์
 */
const content = function ()
{
    return;
}
content.getInfo = function (request: Request, response: Response)
{
    try
    {
        response.status (http.STATUS_NOT_IMPLEMENTED);
        response.end ();
    }
    catch (error)
    {
        log.error (error);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
    }
}
content.getStream = async function (request: Request, response: Response)
{
    try
    {
        const param = reader (request.params);
        const paramId = param.requireString ("id");

        //
        // ใน HTTP จะมีส่วนหัวหนึ่งที่เรียกว่า 
        // Content-Range ซึ่งใช้ในการระบุส่วนข้อมูลที่ต้องการจะอ่าน
        //
        // อย่างไรก็ตาม ตัวแปรนี้ไม่ใช่ข้อบังคับดังนั้นมันอาจจะมีหรือไม่มีก็ได้
        //        
        const range = request.range (Number.POSITIVE_INFINITY);
        const rangeAvailable = range !== undefined;

        let start = 0;
        let end = Number.POSITIVE_INFINITY;

        if (rangeAvailable)
        {
            if (range == -1)
            {
                response.status (http.STATUS_RANGE_NOT_SATISFIABLE);
                response.end ();
                return;
            }
            if (range == -2 || range.type !== "bytes" || range.length < 1)
            {
                response.status (http.STATUS_RANGE_NOT_SATISFIABLE);
                response.end ();
                return;
            }
            if (range.length > 0)
            {
                const data = range.at (0);

                start = data?.start ?? 0;
                end = data?.end ?? Number.POSITIVE_INFINITY;
            }
        }

        if ((start < 0 || end < 0) || 
            (start > end) ||
            (isNaN (start) || isNaN (end)))
        {
            response.status (http.STATUS_RANGE_NOT_SATISFIABLE);
            response.end ();
            return;
        }
        const result = await model.createReader (paramId, start, end);

        if (rangeAvailable)
        {
            //
            // 200: OK
            //
            response.writeHead (http.STATUS_OK, {
                "content-type": model.getMime (paramId),
                "content-length": result.totalSize,
                "accept-ranges": "bytes"
            });
        }
        else
        {
            //
            // 206: Partial Content
            //
            response.writeHead (http.STATUS_PARTIAL_CONTENT, {
                "content-type": model.getMime (paramId),
                "content-range": `bytes ${String (result.start)}-${String (result.end)}/${String (result.totalOffset)}`,
                "content-length": String (result.totalSize),
                "accept-ranges": "bytes"
            });
        }
        result.stream.pipe (response);
    }
    catch (e: unknown)
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
    }
}

export default content;