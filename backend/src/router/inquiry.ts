import http             from "#core/http.ts";
import control          from "#controller/inquiry.ts";
import controlAuth      from "#controller/auth.ts";

const content = () =>
{
    //
    // ไม่มีคุณสมบัติในตอนนี้
    //
    return;
}

content.getRoute = () =>
{
    const router = http.router ();
    const authUser = controlAuth.validateLeastUser ();
    const authStaff = controlAuth.validateLeastStaff ();
    const authManager = controlAuth.validateOnlyManager ();

    // ดึงรายการคำร้องเรียนทั้งหมด (เจ้าหน้าที่ขึ้นไป)
    router.get ("/", authStaff, control.getBasicList);

    // ดึงรายการคำร้องเรียนตาม Order ID (ผู้ใช้อย่างน้อยที่สุด)
    router.get ("/order/:orderId", authUser, control.getListByOrder);

    // ดึงข้อมูลคำร้องเรียนตาม ID (ผู้ใช้อย่างน้อยที่สุด)
    router.get ("/:id", authUser, control.getBasic);

    // สร้างคำร้องเรียนใหม่ (ผู้ใช้อย่างน้อยที่สุด)
    router.post ("/", authUser, control.postBasic);

    // แก้ไขคำร้องเรียน เช่น อัปเดตสถานะ (เจ้าหน้าที่ขึ้นไป)
    router.put ("/:id", authStaff, control.putBasic);

    // ลบคำร้องเรียน (เฉพาะผู้จัดการ)
    router.delete ("/:id", authManager, control.deleteBasic);

    return router;
}

/**
 * ส่งออกตัวแปร
 */
export default content;