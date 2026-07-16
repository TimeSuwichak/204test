/**
 * ระบบจัดการวิธีการสร้างบัญชีใหม่
*/
const content = function ()
{
    return;
}
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = () =>
{
    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ
 */
content.terminate = () =>
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