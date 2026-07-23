/**
 * คำสั่งว่างเปล่าไม่ได้ใช้งาน
*/
const content = () => 
{
    // (ไม่มีอะไรเลย) 
    return; 
}
content.Base = class extends Error 
{
    constructor (error ?: unknown)
    {
        if (error instanceof Error) 
        {
            super (error.message, { cause: error });
            return;
        }
        if (typeof error === "string" || typeof error === "number")
        {
            super (String (error), { cause: error });
            return;
        }
        super (JSON.stringify (error), { cause: error });
    }
};
/**
 * คลาสข้อผิดพลาด จากสาเหตุที่ระบุไม่ได้
*/
content.Unknown = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด จากสาเหตุที่ไม่ได้ระบุ
*/
content.Unspecified = class extends content.Base {};
/**
 * คลางข้อผิดพลาด จากสาเหตุทางด้านเครือข่าย
*/
content.Network = class extends content.Base {};
/**
 * คลางข้อผิดพลาด จากสาเหตุปลายทางกำลังปิดระบบเครือข่าย
*/
content.NetworkGone = class extends content.Base {};
/**
 * คลางข้อผิดพลาด จากสาเหตุปลายทางไม่สามารถรองรับการเชื่อมต่อได้
*/
content.NetworkLimit = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่เป็นข้อมูล JSON ถูกต้องหรือสมบูรณ์
*/
content.BadJson = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่เป็นข้อมูลที่ถูกรูปแบบ
*/
content.BadFormat = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่เป็นข้อมูล XML ถูกต้องหรือสมบูรณ์
*/
content.BadXml = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่ถูกต้องหรือสมบูรณ์
*/
content.BadData = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลมีประเภทข้อมูลที่ไม่ถูกต้อง
*/
content.BadType = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่พบข้อมูล
*/
content.NotFound = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่พร้อมใช้งาน
*/
content.NotAvailable = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบยังไม่มีตรรกะในการทำงาน
*/
content.NotImplemented = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบยังไม่สามารถยืนยันตัวตนได้
*/
content.NotAuthorized = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ยังไม่ถึงเวลาการทำงาน
*/
content.NotBefore = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่หมดอายุการใช้งาน
*/
content.Expired = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธคำร้องเนื่องสิทธิ์เข้าถึง
*/
content.Forbidden = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบพบข้อมูลซ้ำกัน
*/
content.Duplicate = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบพบข้อมูลซ้ำซ้อนกัน
*/
content.Conflict = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธการทำงานเนื่องจากข้อจำกัด
*/
content.Constraint = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธการทำงานเนื่องจากคำสั่งไม่ถูกต้อง
*/
content.Command = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบถูกยกเลิก
*/
content.Cancelled = class extends content.Base {};
/**
 * ข้อผิดพลาดเนื่องระบบไม่สามารถยืนยันตัวตนได้
*/
content.BadAuth = class extends content.Base {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไมพบทรัพยากรอีกต่อไปแล้ว
*/
content.Gone = class extends content.Base {};
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * รายการข้อผิดพลาดทั้งหมดที่ใช้โดยทั่วไป
*/
export default content;
