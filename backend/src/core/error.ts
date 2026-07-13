/**
 * คำสั่งว่างเปล่าไม่ได้ใช้งาน
*/
const content = function () { return; }
/**
 * คลาสข้อผิดพลาด จากสาเหตุที่ระบุไม่ได้
*/
content.Unknown = class extends Error {};
/**
 * คลาสข้อผิดพลาด จากสาเหตุที่ไม่ได้ระบุ
*/
content.Unspecified = class extends Error {};
/**
 * คลางข้อผิดพลาด จากสาเหตุทางด้านเครือข่าย
*/
content.Network = class extends Error {};
/**
 * คลางข้อผิดพลาด จากสาเหตุปลายทางกำลังปิดระบบเครือข่าย
*/
content.NetworkGone = class extends Error {};
/**
 * คลางข้อผิดพลาด จากสาเหตุปลายทางไม่สามารถรองรับการเชื่อมต่อได้
*/
content.NetworkLimit = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่เป็นข้อมูล JSON ถูกต้องหรือสมบูรณ์
*/
content.BadJson = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่เป็นข้อมูลที่ถูกรูปแบบ
*/
content.BadFormat = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่เป็นข้อมูล XML ถูกต้องหรือสมบูรณ์
*/
content.BadXml = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่ถูกต้องหรือสมบูรณ์
*/
content.BadData = class extends Error {};
/**
 * ข้อผิดพลาดเนื่องจากข้อมูลประเภทไม่ถูกต้องตามที่ระบบต้องการ
*/
content.BadType = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่พบข้อมูล
*/
content.NotFound = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่พร้อมใช้งาน
*/
content.NotAvailable = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบยังไม่มีตรรกะในการทำงาน
*/
content.NotImplemented = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบยังไม่สามารถยืนยันตัวตนได้
*/
content.NotAuthorized = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ยังไม่ถึงเวลาการทำงาน
*/
content.NotBefore = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่หมดอายุการใช้งาน
*/
content.Expired = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธคำร้องเนื่องสิทธิ์เข้าถึง
*/
content.Forbidden = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบพบข้อมูลซ้ำกัน
*/
content.Duplicate = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบพบข้อมูลซ้ำซ้อนกัน
*/
content.Conflict = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธการทำงานเนื่องจากข้อจำกัด
*/
content.Constraint = class extends Error {};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธการทำงานเนื่องจากคำสั่งไม่ถูกต้อง
*/
content.Command = class extends Error {};
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * รายการข้อผิดพลาดทั้งหมดที่ใช้โดยทั่วไป
*/
export default content;
