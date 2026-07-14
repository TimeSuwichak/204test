
export type AccountId = number;
export type AccountRole = number;

const content = function ()
{
    return;
}
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
 * ไม่มีข้อจำกัดใด ๆ ในการใช้งานระบบ
*/
content.RESTRICTION_NONE = 0;
/**
 * จำเป็นต้องยืนยันตัวตนก่อนใช้งานระบบ
*/
content.RESTRICTION_CHALLENGE = 1;
/**
 * บัญชีถูกปิดใช้งานชั่วคราว
*/
content.RESTRICTION_DISABLED = 2;
/**
 * บัญชีถูกระงับโดยระบบหรือผู้ดูแล
*/
content.RESTRICTION_SUSPENDED = 4;

content.getBasic = () =>
{
    return;
}
content.getContact = () =>
{
    return;
}
content.putBasic = () =>
{
    return;
}
content.putContact = () =>
{
    return;
}
content.create = () =>
{
    return;
}
content.delete = () =>
{
    return;
}

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;