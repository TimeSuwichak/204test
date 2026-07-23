import error        from "#core/error.ts";
import http         from "#core/http.ts";
import logging      from "#core/log.ts"
import objectReader from "#core/object.reader.ts";
import model        from "#model/auth.ts";
import modelAct     from "#model/account.ts";
import { type Session, type Challenge } from "#model/auth.ts";
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
const log = logging.scoped ("Auth");
/**
 * ระบบประมวลคำสั่งยืนยันตัวตนจากเครือข่าย
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
    let type: number;

    try
    {
        type = objectReader (request.body).requireInteger ("Type");
    }
    catch
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    const stepSimple = () =>
    {
        let id: string;
        let password: string;
        
        try
        {
            const reader = objectReader (request.body);
            id = reader.requireString ("Id");
            password = reader.requireString ("Password");
        }
        catch
        {
            response.status (http.STATUS_BAD_REQUEST);
            response.end ();
            return;
        }
        void model.challengeSimple (id, password).then (stepNext)
            .catch ((e: unknown) =>
        {
            if (e instanceof error.NotFound || e instanceof error.BadAuth)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }
            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
    }
    const stepId = () =>
    {
        let value: string;

        try
        {
            value = objectReader (request.body).requireString ("Value");
        }
        catch
        {
            response.status (http.STATUS_BAD_REQUEST);
            response.end ();
            return;
        }
        void model.challengeId (value).then (stepNext).catch ((e: unknown) =>
        {
            if (e instanceof error.NotFound || e instanceof error.BadAuth)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }
            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
    }
    const stepPassword = () =>
    {
        //
        // จำเป็นต้องมีชุดรหัสยืนยันตัวตนดำเนินการต่อไปยังรหัสผ่าน
        //
        next ();
    }
    const stepNext = (x: Challenge) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "Session": x.raw,
            "SessionIssued": x.issued.getTime (),
            "SessionExpire": x.expired.getTime (),
            "Step": x.authStep,
        });
        response.end ();
    }
    const connectFacebook = () =>
    {
        let id: number;
        let access: string;
        let name: string;
        let email: string;
        let icon: string;
        
        try
        {
            const reader = objectReader (request.body);
            id = reader.requireInteger ("Id");
            access = reader.requireString ("Access");
            name = reader.requireString ("Name");
            email = reader.requireString ("Email");
            icon = reader.requireString ("Icon");
        }
        catch
        {
            response.status (http.STATUS_BAD_REQUEST);
            response.end ();
            return;
        }
        void model.challengeFacebook (
            id, access, 
            name, email, icon
        )
        .then (stepNext)
        .catch ((e: unknown) =>
        {
            if (e instanceof error.NotAuthorized)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }
            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
    }
    switch (type)
    {
        case model.STEP_CHALLENGE_SIMPLE: stepSimple (); return;
        case model.STEP_CHALLENGE_ID: stepId (); return;
        case model.STEP_CHALLENGE_PASSWORD: stepPassword (); return;
        case model.STEP_CONNECT_FACEBOOK: connectFacebook (); return;
    }

    response.status (http.STATUS_BAD_REQUEST);
    response.end ();
}
/**
 * ดำเนินการลงชื่อเข้าใช้งานระบบต่อไป โดยวิธีที่ระบบสามารถระบุตัวตนได้บางส่วน
*/
content.challengeEnhanced = (request: Request, response: Response) =>
{
    const auth = content.validateResult (response) as Challenge;
    const reader = objectReader (request.body);
    const type = reader.requireInteger ("Type");

    const stepPassword = () =>
    {
        if (auth.authStep !== model.STEP_CHALLENGE_PASSWORD)
        {
            stepOut ();
            return;
        }
        let value: string;

        try
        {
            value = objectReader (request.body).requireString ("Value");
        }
        catch
        {
            response.status (http.STATUS_BAD_REQUEST);
            response.end ();
            return;
        }
        void model.challengePassword (auth, value)
        .then (stepNext)
        .catch ((e: unknown) =>
        {
            if (e instanceof error.NotFound || e instanceof error.BadAuth)
            {
                response.status (http.STATUS_UNAUTHORIZED);
                response.end ();
                return;
            }
            log.error (e);
            response.status (http.STATUS_SERVICE_UNAVAILABLE);
            response.end ();
        });
    }
    const stepNext = (x: Challenge) =>
    {
        response.status (http.STATUS_OK);
        response.json ({
            "Session": x.raw,
            "SessionIssued": x.issued.getTime (),
            "SessionExpire": x.expired.getTime (),
            "Step": x.authStep,
        });
        response.end ();
    }
    const stepOut = () =>
    {
        response.status (http.STATUS_UNAUTHORIZED);
        response.end ();
    }

    switch (type)
    {
        case model.STEP_CHALLENGE_PASSWORD: stepPassword (); return;
    }

    response.status (http.STATUS_BAD_REQUEST);
    response.end ();
}
content.create = (request: Request, response: Response) =>
{
    let type: number;
    let identifier: string;
    let password: string;
    let email: string;
    
    try
    {
        const reader = objectReader (request.body);

        type = reader.requireInteger ("Type");
        identifier = reader.requireString ("Identifier");
        password = reader.requireString ("Password");
        email = reader.requireString ("Link");
    }
    catch (e: unknown)
    {
        log.warn (e);

        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
        return;
    }

    if (type === 1)
    {
        void model.create (identifier, password, email).then ((x) =>
        {
            response.status (http.STATUS_CREATED);
            response.json ({
                "Session": x.raw,
                "SessionIssued": x.issued.getTime (),
                "SessionExpire": x.expired.getTime (),
                "Step": x.authStep,
            });
            response.end ();
        });
    }
    else
    {
        response.status (http.STATUS_BAD_REQUEST);
        response.end ();
    }
}

/**
 * ตรวจสอบการเข้าถึงระบบก่อนที่จะส่งกระบวนการต่อไป
*/
content.validate = function (config: ValidationSettings)
{
    const allowRole = config.allowedRole ?? 
    [
        modelAct.ROLE_USER,
        modelAct.ROLE_STAFF,
        modelAct.ROLE_MANAGER,
        modelAct.ROLE_DEVELOPER
    ];
    const allowRestriction = 
        config.allowedRestriction ?? model.RESTRICTION_NONE;

    return (
        request: Request,
        response: Response,
        next: NextFunction
    ) =>
    {
        const addr = request.socket.remoteAddress ?? "(unknown)";
        const port = request.socket.remotePort ?? 0;
        const ip = `${addr}:${port ? String (port) : "(??)"}`;

        if (!request.headers.authorization)
        {
            //
            // ขาดข้อมูลการเข้าถึงระบบ
            //
            log.warn (`${ip} ขาดข้อมูลการยืนยันตัวตน`);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }

        const header = request.headers.authorization;
        const headerMap = header.split (" ");

        if (headerMap.length != 2)
        {
            log.warn (`${ip} รูปแบบข้อมูลยืนยันไม่ถูกต้อง`);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        const key = String (headerMap [0]);
        const value = String (headerMap [1]);

        //
        // ตรวจสอบว่าเป็นประเภท Bearer
        // ตัวเล็ก-ตัวใหญ่สำคัญ ระบบไม่รับ: bearer, BeArEr, หรืออื่น ๆ
        //
        if (key !== "Bearer")
        {
            log.warn (`${ip} ประเภทการยืนยันที่ไม่รู้จัก: ${key}`);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        }
        void model.readChallenge (value).then ((x) =>
        {
            const passRole = allowRole.includes (x.role);
            const passRest = 
                (x.restriction & allowRestriction) === allowRestriction;

            if (!passRole || !passRest)
            {
                const role = String (x.role);
                const restr = String (x.restriction);

                log.warn (`${ip} ไม่ผ่านเงื่อนไขการยืนยันตัวตน: ${role}, ${restr}`);

                response.status (http.STATUS_FORBIDDEN);
                response.end ();
                return;
            }
            response.locals ["AuthValidation"] = x;
            next ();
        })
        .catch ((e: unknown) =>
        {
            log.warn (`${ip} ยืนยันตัวตนไม่สำเร็จ`);
            log.warn (e);

            response.status (http.STATUS_UNAUTHORIZED);
            response.end ();
            return;
        });
    }
}
content.validateResult = (response: Response) : Session | Challenge =>
{
    return response.locals ["AuthValidation"] as Session | Challenge;
}
content.validateOnlyAuth = () =>
{
    return content.validate ({
        allowedRole: [modelAct.ROLE_AUTH],
        allowedRestriction: model.RESTRICTION_CHALLENGE
    });
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
 * ตั้งค่าการยืนยันตัวตน
*/
export interface ValidationSettings
{
    allowedRole ?: number [];
    allowedRestriction ?: number;
}
/**
 * ส่งออกตัวแปร
*/
export default content;