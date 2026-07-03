
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่เป็นข้อมูล JSON ถูกต้องหรือสมบูรณ์
*/
export class ErrorBadJson extends Error
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่สามารถประมวลข้อมูลได้
 * เนื่องจากชุดข้อมูลดังกล่าวไม่ถูกต้องหรือสมบูรณ์
*/
export class ErrorBadData extends Error
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่พบข้อมูล
*/
export class ErrorNotFound extends Error 
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบไม่พร้อมใช้งาน
*/
export class ErrorNotAvailable extends Error 
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบยังไม่มีตรรกะในการทำงาน
*/
export class ErrorNotImplemented extends Error 
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบยังไม่สามารถยืนยันตัวตนได้
*/
export class ErrorNotAuthorized extends Error
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธคำร้องเนื่องสิทธิ์เข้าถึง
*/
export class ErrorForbidden extends Error
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบพบข้อมูลซ้ำกัน
*/
export class ErrorDuplicate extends Error
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธการทำงานเนื่องจากข้อจำกัด
*/
export class ErrorConstraint extends Error
{
    /* ไม่ระบุ */
};
/**
 * คลาสข้อผิดพลาด ในกรณีที่ระบบปฎิเสธการทำงานเนื่องจากคำสั่งไม่ถูกต้อง
*/
export class ErrorCommand extends Error
{
    /* ไม่ระบุ */
};
/**
 * คลางข้อผิดพลาด จากสาเหตุที่ระบุไม่ได้
*/
export class ErrorUnknown extends Error
{
    /* ไม่ระบุ */
};