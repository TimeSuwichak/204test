import http         from "#core/http.ts";
import logging      from "#core/log.ts"
import error        from "#core/error.ts";
import objReader    from "#core/object.reader.ts";
import objWriter    from "#core/object.writer.ts";
import model        from "#model/auth.ts";
import modelAct     from "#model/account.ts";
import
{ 
    type Request, 
    type Response,
    type NextFunction
} 
from "#core/http.ts";
import 
{ 
    type DataId,
    type AccountRole
} 
from "#model/account.ts";

export interface ValidationSettings
{
    allowedRole ?: number [];
    allowedRestriction ?: number;
}
export interface ValidationResult
{
    id: DataId;
    role: AccountRole;
    restriction: number;
    session: string;
    sessionIssued: Date;
    sessionExpire: Date;

    authStep ?: number;
}

/**
 * ระบบบันทึกกิจกรรมเริ่มต้น
*/
const log = logging.scoped ("Auth");
/**
 * ระบบประมวลคำสั่งยืนยันตัวตนจากเครือข่าย
*/
const content = function ()
{
    return;
}
content.validate = function (config: ValidationSettings)
{
    config.allowedRole = config.allowedRole ?? [
        modelAct.ROLE_USER,
        modelAct.ROLE_STAFF,
        modelAct.ROLE_MANAGER
    ];
    config.allowedRestriction = 
        config.allowedRestriction ?? model.RESTRICTION_NONE;

    return function (
        request: Request,
        response: Response,
        next: NextFunction
    )
    {
        void request;
        void response;
        void next;

        if (!request.headers.authorization)
        {
            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        const addr = request.socket.remoteAddress ?? "(unknown address)";
        const header = request.headers.authorization;
        const map = header.split (" ");

        if (map.length != 2)
        {
            log.warn (`${addr} sent invalid authorization header`);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        const key = String (map [0]);
        const value = String (map [1]);

        if (key !== "Bearer")
        {
            log.warn (`${addr} sent invalid authorization type: ${key}`);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        void model.jwtVerify (value).then ((x) =>
        {
            const result: ValidationResult = {
                session: value,
                sessionIssued: new Date (Number (x.data.iat)),
                sessionExpire: new Date (Number (x.data.exp)),
                id: x.data ["Id"] as DataId,
                role: x.data ["Role"] as AccountRole,
                restriction: x.data ["Restriction"] as number,
                authStep: x.data ["AuthStep"] as number
            };

            const passRole = config.allowedRole?.includes (result.role);
            const passRestriction =  
                (result.restriction & (config.allowedRestriction ?? 0)) 
                === config.allowedRestriction;

            if (!passRole || !passRestriction)
            {
                log.warn (`${addr} didn't pass validation: role=${String (result.role)}, restriction=${String (result.restriction)}`);

                response.status (http.STATUS_FORBIDDEN);
                response.end ();
                return;
            }

            response.locals ["AuthValidation"] = result;

            next ();
        })
        .catch ((e: unknown) =>
        {
            log.error ("Session validation failed");
            log.error ("------------------------");
            log.error (e);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        })
    }
}
content.validateResult = (response: Response) : ValidationResult =>
{
    return response.locals ["AuthValidation"] as ValidationResult;
}
content.validateOnlyUser = () =>
{
    return content.validate ({
        allowedRole: [modelAct.ROLE_USER],
        allowedRestriction: model.RESTRICTION_NONE
    });
}
content.validateOnlyStaff = () =>
{
    return content.validate ({
        allowedRole: [modelAct.ROLE_STAFF],
        allowedRestriction: model.RESTRICTION_NONE
    });
}
content.validateOnlyManager = () =>
{
    return content.validate ({
        allowedRole: [modelAct.ROLE_MANAGER],
        allowedRestriction: model.RESTRICTION_NONE
    });
}
content.validateLeastUser = () =>
{
    return content.validate ({
        allowedRole: [
            modelAct.ROLE_USER, 
            modelAct.ROLE_STAFF, 
            modelAct.ROLE_MANAGER
        ],
        allowedRestriction: model.RESTRICTION_NONE
    });
}
content.validateLeastStaff = () =>
{
    return content.validate ({
        allowedRole: [
            modelAct.ROLE_STAFF, 
            modelAct.ROLE_MANAGER
        ],
        allowedRestriction: model.RESTRICTION_NONE
    });
}
/**
 * เส้นทางเริ่มต้นการลงชื่อเข้าใช้งาน
*/
content.signIn = function (request: Request, response: Response)
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }
    let input: string;

    try
    {
        input = objReader (request.body).requireString ("Identifier");
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    model.signIn (input).then ((x) =>
    {
        const result = objWriter ();

        result.requireString ("Session", x.session);
        result.requireDate ("SessionIssued", x.sessionIssued);
        result.requireDate ("SessionExpire", x.sessionExpire);
        result.requireInteger ("Step", x.step);

        response.status (http.STATUS_OK);
        response.set ("content-type", "application/json");
        response.end (result.toJson ());
    })
    .catch ((e: unknown) =>
    {
        if (e instanceof error.NotFound)
        {
            response.status (http.STATUS_NOT_FOUND);
            response.end ();
            return;
        }
        if (e instanceof error.Conflict)
        {
            response.status (http.STATUS_CONFLICT);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;
    })
    
}
/**
 * เส้นทางต่อเนื่องการลงชื่อเข้าใช้งาน ดำเนินการต่อโดยการป้อนรหัสผ่าน
 * คำสั่งนี้ต้องใช้รหัสยืนยันตัวตนที่ถูกต้อง
*/
content.routeSignInPwd = function (request: Request, response: Response)
{
    if (!request.body)
    {
        response.status (http.STATUS_BAD_REQUEST)
        response.end ();
        return;
    }
    const validation = content.validateResult (response);

    if ((validation.restriction & model.RESTRICTION_CHALLENGE) == 0 ||
        (validation.authStep != model.STEP_PASSWORD))
    {
        response.status (http.STATUS_FORBIDDEN);
        response.end ();
        return;
    }

    let identifier: string;
    let password: string;

    try
    {
        identifier = objReader (request.body).requireString ("Identifier");
        password = objReader (request.body).requireString ("Password");
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    model.signInPwd (
        validation.id, 
        identifier, 
        validation.role, 
        password

    ).then ((x) =>
    {
        const result = objWriter ();

        result.requireString ("Session", x.session);
        result.requireDate ("SessionIssued", x.sessionIssued);
        result.requireDate ("SessionExpire", x.sessionExpire);
        result.requireInteger ("Step", x.step);

        response.status (http.STATUS_OK);
        response.set ("content-type", "application/json");
        response.end (result.toJson ());
    })
    .catch ((e: unknown) =>
    {
        if (e instanceof error.NotAuthorized)
        {
            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        if (e instanceof error.Conflict)
        {
            response.status (http.STATUS_CONFLICT);
            response.end ();
            return;
        }
        log.error (e);
        response.status (http.STATUS_SERVICE_UNAVAILABLE);
        response.end ();
        return;;
    });
}
content.routeSignInTotp = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}
content.routeSignOut = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}

content.signUp = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}
content.signUpPwd = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}
content.signUpEmail = function (request: Request, response: Response)
{
    response.status (200);
    response.end ();
}

content.routeResume = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.routeRenewal = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.deactivate = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
content.delete = function (request: Request, response: Response)
{
    response.status (http.STATUS_NOT_IMPLEMENTED);
    response.end ();
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;