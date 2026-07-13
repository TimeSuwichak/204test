import Self from "#component/auth.tsx";

/**
 * ส่วนประกอบแสดงผลสำหรับหน้าจอลงชื่อเข้าใช้งานบัญชี
*/
const content = function Auth ()
{
  return <>
    <Self/>
  </>;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;