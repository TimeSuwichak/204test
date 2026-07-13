
const content = () => 
{
    //
    // ไม่มีคุณสมบัติดังนั้นอย่าเรียกใช้งาน
    //
    return;
};

content.create = () =>
{
    return;
}
content.createCategory = () =>
{
    return;
}
content.createVendor = () => 
{
    return;
};

content.update = () =>
{
    return;
}
content.updateCategory = () =>
{
    return;
}
content.updateVendor = () =>
{
    return;
}
content.updateVendorIcon = () =>
{
    return;
}

content.delete = () =>
{
    return;
}
content.deleteCategory = () =>
{
    return;
}
content.deleteVendor = () =>
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