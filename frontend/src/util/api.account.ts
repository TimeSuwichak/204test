/**
 * 
 * ทำหน้าที่เป็นตัวกลางในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับข้อมูลบัญชีผู้ใช้ ข้อมูลบัญชีผู้ใช้ที่จัดการโดยโมดูลนี้
 * จะรวมไปถึงข้อมูลพื้นฐาน, ข้อมูลติดต่อ, และอื่น ๆ ที่เกี่ยวข้องกับบัญชีผู้ใช้
 * 
 * สำหรับการดำเนินการที่เกี่ยวข้องกับการเข้าสู่ระบบ
 * และการลงทะเบียนผู้ใช้โปรดดูที่โมดูล: api.auth.ts
 * 
*/
import reader   from "#util/common.objectReader.ts";
import error    from "#util/common.error.ts";

/**
 * โมดูลหลักที่ใช้ในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับข้อมูลบัญชีผู้ใช้
*/
const content = () => 
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
};
/**
 * กุญแจหลักของบัญชี
*/
export type Key = number;
/**
 * รายการบัญชีผู้ใช้ทั้งหมดในระบบ
*/
export interface List
{
    /**
     * รายการบัญชีผู้ใช้
    */
    item: ListItem [];
}
/**
 * ข้อมูลพื้นฐานของบัญชีผู้ใช้ที่แสดงในรายการบัญชี
*/
export interface ListItem
{
    /**
     * รหัสบัญชี
    */
    id: Key;
    /**
     * ไอคอน
    */
    icon: string;
    /**
     * ชื่อของผู้ใช้
     */
    name: string;
    /**
     * บทบาท
    */
    role: number;
}
/**
 * เก็บรวบรวมข้อมูลพื้นฐานเกี่ยวกับบัญชีผู้ใช้
*/
export interface Basic
{
    /**
     * รหัสบัญชี
    */
    id: Key;
    /**
     * ไอคอน
    */
    icon: string;
    /**
     * บทบาทของผู้ใช้
    */
    role: number;
    /**
     * ชื่อผู้ใช้
    */
    name: string;
}
/**
 * ข้อมูลพื้นฐานที่ใช้ในการปรับเปลี่ยนข้อมูลบัญชีผู้ใช้
*/
export interface BasicUpdate
{
    /**
     * บทบาทของผู้ใช้
    */
    role: Key | undefined;
    /**
     * ชื่อของผู้ใช้
    */
    name: string | undefined;
}
/**
 * ข้อมูลติดต่อของผู้ใช้
*/
export interface Contact
{
    /**
     * หมายเลขโทรศัพท์
    */
    phone: string [];
    /**
     * อีเมล
    */
    email: string [];
}
/**
 * ข้อมูลติดต่อที่ใช้ในการปรับเปลี่ยนข้อมูลบัญชีผู้ใช้
*/
export interface ContactUpdate
{
    /**
     * หมายเลขโทรศัพท์
    */
    phone: string [] | undefined;
    /**
     * อีเมล
    */
    email: string [] | undefined;
}
/**
 * โปรโตอลที่ใช้ในการสื่อสารระหว่างเซิร์ฟเวอร์
*/
content.NET_PROTOCOL = "http";
/**
 * ที่อยู่ของเซิร์ฟเวอร์
*/
content.NET_ADDRESS = location.hostname;
/**
 * พอร์ตการเชื่อมต่อกับเซิร์ฟเวอร์
*/
content.NET_PORT = 51000;
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์
*/
content.NET_PREFIX = "/account";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 10000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;

/**
 * บทบาทบัญชี: ผู้ใช้
*/
content.ROLE_USER = 1;
/**
 * บทบาทบัญชี: ผู้ดูแล
*/
content.ROLE_STAFF = 2;
/**
 * บทบาทบัญชี:ผู้ดูแลระบบ
*/
content.ROLE_MANAGER = 3;
/**
 * บทบาทบัญชี:ผู้พัฒนาระบบ
*/
content.ROLE_DEVELOPER = 4;


/**
 * โหลดตัวระบบบัญชี
*/
content.init = () : Promise<void> =>
{
    return Promise.resolve ();
}
/**
 * ดึงรายการบัญชีทั้งหมดที่มีอยู่ในระบบ
*/
content.getList = async (session: string) : Promise<List> =>
{
    const endpoint = `${content.NET_URL}/account`;    
    const init: RequestInit =
    {
        method: "GET",
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        headers: 
        [ 
            ["Authorization", `Bearer ${session}`] 
        ],
        cache: "default",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        body: undefined
    };
    const response = await fetch (endpoint, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });

    switch (response.status)
    {
        case 200: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    const data = await (response.json ()
        .then ((x) => reader (x))
        .catch ((e: unknown) => 
    {
        throw new error.BadFormat (e);
    }));

    try
    {
        const item = data.requireArrayObject ("Item").map ((x) =>
        {
            const inner = reader (x);
            const innerResult: ListItem =
            {
                id:         inner.requireInteger ("Id"),
                icon:       inner.requireString ("Icon"),
                name:       inner.requireString ("Name"),
                role:       inner.requireInteger ("Role"),
            }
            return innerResult;
        });
        return { item: item };
    }
    catch (e: unknown)
    {
        throw new error.BadData (e);
    }
}
/**
 * รับข้อมูลพื้นฐานเกี่ยวบัญชีผู้ใช้
*/
content.getBasic = async (session: string, id ?: Key) : Promise<Basic> =>
{
    id = id ?? 0;

    const endpoint = `${content.NET_URL}/account/${String (id)}`;    
    const init: RequestInit =
    {
        method: "GET",
        mode: "cors",
        referrerPolicy: "strict-origin",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        headers: 
        [ 
            ["Authorization", `Bearer ${session}`],
        ],
        cache: "default",
        body: undefined
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) => 
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    const data = await (response.json ()
        .then ((x) => reader (x))
        .catch ((e: unknown) => 
    {
        throw new error.BadFormat (e);
    }));

    try
    {
        const id = data.requireInteger ("Id");
        const icon = data.requireString ("Icon");
        const role = data.optionalInteger ("Role", 0);
        const name = data.requireString ("Name");
    
        return {
            id: id,
            icon: icon,
            role: Number (role),
            name: name,
        }
    }
    catch (e: unknown)
    {
        throw new error.BadData (e);
    }
}
/**
 * รับข้อมูลติดต่อเกี่ยวบัญชีผู้ใช้
*/
content.getContact = async (session: string, id ?: Key) : Promise<Contact> =>
{
    id = id ?? 0;

    const endpoint = `${content.NET_URL}/account/${String (id)}/contact`;    
    const init: RequestInit =
    {
        method: "GET",
        mode: "cors",
        referrerPolicy: "strict-origin",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        headers: 
        [ 
            ["Authorization", `Bearer ${session}`],
        ],
        cache: "default",
        body: undefined
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) => 
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 200: break;
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
    const data = await (response.json ()
        .then ((x) => reader (x))
        .catch ((e: unknown) => 
    {
        throw new error.BadFormat (e);
    }));

    try
    {
        const phone = data.requireArrayString ("Phone");
        const email = data.requireArrayString ("Email");

        return {
            phone: phone,
            email: email,
        }
    }
    catch (e: unknown)
    {
        throw new error.BadData (e);
    }
}
/**
 * ปรับเปลี่ยนข้อมูลบัญชีของผู้ใช้ดังกล่าว
 * คำสั่งอาจต้องใช้บัญชีสิทธิ์ขั้นสูงในการปรับตัวแปรบางตัวแปร
*/
content.setBasic = async (session: string, data: BasicUpdate, id ?: number) =>
{
    id = id ?? 0;

    const endpoint = `${content.NET_URL}/account/${String (id)}`;
    const init: RequestInit =
    {
        method: "PUT",
        mode: "cors",
        referrerPolicy: "strict-origin",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        headers: 
        [ 
            ["Authorization", `Bearer ${session}`],
            ["Content-Type", "application/json"]
        ],
        cache: "default",
        body: JSON.stringify ({
            "Role": data.role,
            "Name": data.name,
        })
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) => 
    {
        throw new error.Network (e);
    });

    switch (response.status)
    {
        case 204: break;
        case 401: throw new error.NotAuthorized ();
        case 402: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
}
/**
 * สร้างอัพโหลดไอคอนให้กับบัญชี
*/
content.setIcon = async (session: string, data: Blob, id ?: number) =>
{
    id = id ?? 0;

    const form = new FormData ();

    form.append ("Source", data);

    const endpoint = `${content.NET_URL}/account/${String (id)}/icon`;
    const option: RequestInit = 
    {
        method: "PUT",
        mode: "cors",
        referrerPolicy: "strict-origin",
        cache: "default",
        headers:
        [
            ["Authorization", `Bearer ${session}`],
        ],
        body: form,
        signal: AbortSignal.timeout (content.NET_TIMEOUT)
    }
    const response = await fetch (endpoint, option).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });

    switch (response.status)
    {
        case 200: break;
        case 400: throw new error.BadData ();
        case 401: throw new error.NotAuthorized ();
        case 403: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default:
            throw new error.Unknown ();
    }
}
/**
 * ปรับเปลี่ยนข้อมูลติดต่อของบัญชีดังกล่าวที่ระบุไว้
*/
content.setContact = async (
    session: string, 
    data: ContactUpdate, 
    id ?: number
) =>
{
    id = id ?? 0;

    const endpoint = `${content.NET_URL}/account/${String (id)}/contact`;    
    const init: RequestInit =
    {
        method: "PUT",
        mode: "cors",
        referrerPolicy: "strict-origin",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        headers: 
        [ 
            ["Authorization", `Bearer ${session}`],
            ["Content-Type", "application/json"]
        ],
        cache: "default",
        body: JSON.stringify ({
            "Phone": data.phone,
            "Email": data.email,
        })
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) => 
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 204: break;
        case 401: throw new error.NotAuthorized ();
        case 402: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
    }
}
/**
 * ลบข้อมูลบัญชีดังกล่าวออกจากระบบ ซึ่งรวมไปถึงข้อมูลการเข้าสู่ระบบเช่นกัน
*/
content.delete = async (auth: string, id ?: number, password?: string) =>
{
    const endpoint = `${content.NET_URL}/account/${id ? String (id) : "me"}`;
    const init: RequestInit =
    {
        method: "DELETE",
        mode: "cors",
        referrerPolicy: "strict-origin",
        signal: AbortSignal.timeout (content.NET_TIMEOUT),
        headers: 
        [ 
            ["Authorization", `Bearer ${auth}`],
            ["Content-Type", "application/json"]
        ],
        cache: "default",
        body: JSON.stringify (
        {
            "Password": password
        })
    }
    const response = await fetch (endpoint, init).catch ((e: unknown) =>
    {
        throw new error.Network (e);
    });
    switch (response.status)
    {
        case 204: break;
        case 401: throw new error.NotAuthorized ();
        case 402: throw new error.Forbidden ();
        case 404: throw new error.NotFound ();
        case 429: throw new error.NetworkLimit ();
        case 500: throw new error.NotAvailable ();
        case 503: throw new error.NotAvailable ();
        default: throw new error.Unknown ();
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