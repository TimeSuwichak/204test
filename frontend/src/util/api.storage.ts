/**
 * โมดูลหลักที่ใช้ในการสื่อสารระหว่างส่วนติดต่อผู้ใช้และเซิร์ฟเวอร์
 * ที่เกี่ยวข้องกับข้อมูลบัญชีผู้ใช้
*/
const content = () =>
{
    return;
}
content.getUrlMetadata = (id: string) =>
{
    return `${content.NET_URL_METADATA}/${id}`;
}
content.getUrlStream = (id: string) =>
{
    if (id.startsWith ("http://") || 
        id.startsWith ("https://")) {
        return id;
    }
    return `${content.NET_URL}/${id}`;
}
content.getMeta = async (id: string) =>
{
    void id;
    return Promise.resolve ();
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
content.NET_PREFIX = "/storage";
/**
 * เส้นทางนำหน้าหลังจากที่อยู่ของเซิร์ฟเวอร์ สำหรับสอบถามทรัพยากร
*/
content.NET_PREFIX_METADATA = "/storage-metadata";
/**
 * ระหว่างเวลาการเชื่อมต่อกับเซิร์ฟเวอร์ก่อนที่จะตัดขาด
*/
content.NET_TIMEOUT = 10000;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์
*/
content.NET_URL = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX}`;
/**
 * ลิงค์เต็มของที่อยู่เซิร์ฟเวอร์ สำหรับสอบถามทรัพยากร
*/
content.NET_URL_METADATA = `${content.NET_PROTOCOL}://${content.NET_ADDRESS}:${String (content.NET_PORT)}${content.NET_PREFIX_METADATA}`;
/**
 * ส่งออกตัวแปร
*/
export default content;