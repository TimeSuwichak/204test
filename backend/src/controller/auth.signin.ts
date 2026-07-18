import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts";
import objectReader from "#core/object.reader.ts";
import control      from "#controller/auth.ts";
import model        from "#model/auth.signin.ts";
import
{
    type Request,
    type Response,
    type NextFunction
}
from "#core/http.ts";

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("AuthSignIn");
/**
 * ระบบจัดการลงชื่อเข้าใช้งานระบบ
*/
const content = function ()
{
    return;
}

/**
 * เส้นทางเริ่มต้นการลงชื่อเข้าใช้งาน
*/
content.challenge = (
    request: Request, 
    response: Response, 
    next: NextFunction
) =>
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let key: number;
    let value: string;
    let identifier: string;
    let password: string;

    let access: string;
    let name: string;
    let email: string;
    let icon: string;

    try
    {
        const reader = objectReader (request.body);

        key = reader.requireInteger ("Key");
        value = reader.optionalString ("Value") ?? "";
        
        identifier = reader.optionalString ("Id") ?? "";
        password = reader.optionalString ("Password") ?? "";

        access = reader.optionalString ("Access") ?? "";
        name = reader.optionalString ("Name") ?? "";
        email = reader.optionalString ("Email") ?? "";
        icon = reader.optionalString ("Icon") ?? "";
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    if (key === model.STEP_SIMPLE)
    {
        void model.challengeSimple (identifier, password).then ((x) =>
        {
            const addr = request.socket.remoteAddress ?? "(unknown)";
            const port = request.socket.remotePort ?? 0;
            const ip = `${addr}:${port ? String (port) : "(??)"}`;


            response.status (http.STATUS_OK);
            response.json ({
                "Session": x.session,
                "SessionIssued": x.sessionIssued.getTime (),
                "SessionExpire": x.sessionExpire.getTime (),
                "Step": x.authStep ?? model.STEP_COMPLETE,
            });
            response.end ();

            log.verbose (`${ip} signed-in: simple mode`);
        })
        .catch ((e: unknown) =>
        {
            if (e instanceof error.NotFound)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }

            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
        return;
    }
    if (key === model.STEP_IDENTIFIER)
    {
        void model.challengeId (value).then ((x) =>
        {
            response.status (http.STATUS_OK);
            response.json ({
                "Session": x.session,
                "SessionIssued": x.sessionIssued.getTime (),
                "SessionExpire": x.sessionExpire.getTime (),
                "Step": x.authStep ?? model.STEP_COMPLETE
            });
            response.end ();
        })
        .catch ((e: unknown) =>
        {
            if (e instanceof error.NotFound)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }

            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
        return;
    }
    if (key === model.STEP_FACEBOOK)
    {
        void model.challengeFacebook (Number (value), access, name, email, icon)
            .then ((x) =>
        {
            response.status (http.STATUS_OK);
            response.json ({
                "Session": x.session,
                "SessionIssued": x.sessionIssued.getTime (),
                "SessionExpire": x.sessionExpire.getTime (),
                "Step": x.authStep ?? model.STEP_COMPLETE
            });
            response.end ();
        })
        .catch ((e: unknown) =>
        {
            if (e instanceof error.NotFound)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }

            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
        return;
    }

    //
    // จำเป็นต้องมีชุดรหัสยืนยันตัวตน ดำเนินการต่อไปยังรหัสผ่านและ MFA
    //
    next ();
}
/**
 * ดำเนินการลงชื่อเข้าใช้งานระบบต่อไป โดยวิธีที่ระบบสามารถระบุตัวตนได้บางส่วน
*/
content.challengeIdentified = (request: Request, response: Response) =>
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    const auth = control.validateResult (response);
    let key: number;
    let value: string;

    try
    {
        const reader = objectReader (request.body);

        key = reader.requireInteger ("Key");
        value = reader.optionalString ("Value") ?? "";
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    if (key === model.STEP_PASSWORD)
    {
        void model.challengePassword (auth, value).then ((x) =>
        {
            response.status (http.STATUS_OK);
            response.json ({
                "Session": x.session,
                "SessionIssued": x.sessionIssued.getTime (),
                "SessionExpire": x.sessionExpire.getTime (),
                "Step": x.authStep ?? model.STEP_COMPLETE
            });
            response.end ();
        })
        .catch ((e: unknown) =>
        {
            if (e instanceof error.BadAuth)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }

            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
        return;
    }
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;