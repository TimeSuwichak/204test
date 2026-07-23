import error from "#util/common.error";
import objectReader from "#util/common.objectReader.ts";

/**
 * ส่วนทั่วไปที่เกี่ยวข้องกับการเชื่อมต่อ API
*/
const content = () =>
{
    return;
}
/**
 * ส่งคำสั่ง GET ไปยังระบบปลายทางเพื่อรับข้อมูล JSON
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param endpoint ที่อยู่ของปลายทาง
*/
content.getJson = async (session: string, endpoint: string) =>
{
    const header = new Headers ();

    header.append ("Accept", "application/json");
    header.append ("Accept-Encoding", "*");

    if (session.length > 0)
    {
        header.append ("Authorization", `Bearer ${session}`);
    }

    const path = endpoint;
    const init: RequestInit =
    {
        method: "GET",
        mode: "cors",
        cache: "default",
        referrerPolicy: "strict-origin",
        headers: header
    };
    const response = await fetch (path, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 410: throw new error.Gone ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    return content.toJson (response);
}
/**
 * ส่งคำสั่ง PUT ไปยังระบบปลายทางพร้อมชุดข้อมูล JSON ที่กำหนดไว้
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param endpoint ที่อยู่ของปลายทาง
*/
content.putJson = async (
    session: string, 
    endpoint: string, 
    body: Record<string, unknown>
) : Promise<Response> =>
{
    const header = new Headers ();

    header.append ("Content-Type", "application/json");
    header.append ("Accept-Encoding", "*");

    if (session.length > 0)
    {
        header.append ("Authorization", `Bearer ${session}`);
    }

    const path = endpoint;
    const init: RequestInit =
    {
        method: "PUT",
        mode: "cors",
        cache: "default",
        referrerPolicy: "strict-origin",
        headers: header,
        body: JSON.stringify (body)
    };
    const response = await fetch (path, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 204: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 410: throw new error.Gone ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    return response;
}
/**
 * ส่งคำสั่ง PUT ไปยังระบบปลายทางพร้อมชุดข้อมูลฟอร์มที่กำหนดไว้
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param endpoint ที่อยู่ของปลายทาง
*/
content.putForm = async (
    session: string, 
    endpoint: string, 
    body: FormData
) : Promise<Response> =>
{
    const header = new Headers ();

    header.append ("Accept-Encoding", "*");

    if (session.length > 0)
    {
        header.append ("Authorization", `Bearer ${session}`);
    }

    const path = endpoint;
    const init: RequestInit =
    {
        method: "PUT",
        mode: "cors",
        cache: "default",
        referrerPolicy: "strict-origin",
        headers: header,
        body: body
    };
    const response = await fetch (path, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 204: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 410: throw new error.Gone ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    return response;
}
/**
 * ส่งคำสั่ง POST ไปยังระบบปลายทางพร้อมชุดข้อมูล JSON ที่กำหนดไว้
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param endpoint ที่อยู่ของปลายทาง
*/
content.postJson = async (
    session: string, 
    endpoint: string, 
    body: Record<string, unknown>
) : Promise<Response> =>
{
    const header = new Headers ();

    header.append ("Content-Type", "application/json");
    header.append ("Accept-Encoding", "*");

    if (session.length > 0)
    {
        header.append ("Authorization", `Bearer ${session}`);
    }

    const path = endpoint;
    const init: RequestInit =
    {
        method: "POST",
        mode: "cors",
        cache: "default",
        referrerPolicy: "strict-origin",
        headers: header,
        body: JSON.stringify (body)
    };
    const response = await fetch (path, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 201: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 410: throw new error.Gone ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    return response;
}
/**
 * ส่งคำสั่ง POST ไปยังระบบปลายทางพร้อมชุดข้อมูลฟอร์มที่กำหนดไว้
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param endpoint ที่อยู่ของปลายทาง
*/
content.postForm = async (
    session: string, 
    endpoint: string, 
    body: FormData
) : Promise<Response> =>
{
    const header = new Headers ();

    header.append ("Accept-Encoding", "*");

    if (session.length > 0)
    {
        header.append ("Authorization", `Bearer ${session}`);
    }

    const path = endpoint;
    const init: RequestInit =
    {
        method: "POST",
        mode: "cors",
        cache: "default",
        referrerPolicy: "strict-origin",
        headers: header,
        body: body
    };
    const response = await fetch (path, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 201: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 410: throw new error.Gone ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    return response;
}
/**
 * ส่งคำสั่ง DELETE ไปยังระบบปลายทางพร้อมชุดข้อมูล JSON ที่กำหนดไว้
 * 
 * @param session ชุดรหัสยืนยันตัวตน
 * @param endpoint ที่อยู่ของปลายทาง
*/
content.delete = async (
    session: string, 
    endpoint: string
) : Promise<Response> =>
{
    const header = new Headers ();

    if (session.length > 0)
    {
        header.append ("Authorization", `Bearer ${session}`);
    }

    const path = endpoint;
    const init: RequestInit =
    {
        method: "DELETE",
        mode: "cors",
        cache: "default",
        referrerPolicy: "strict-origin",
        headers: header,
        body: undefined
    };
    const response = await fetch (path, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 201: break;
        case 204: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 410: throw new error.Gone ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    return response;
}
content.toJson = (response: Response) =>
{
    return response.json ().then ((x) =>
    {
        return objectReader (x);
    })
    .catch ((e: unknown) => 
    {
        throw new error.BadFormat (e);
    }) ;
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;