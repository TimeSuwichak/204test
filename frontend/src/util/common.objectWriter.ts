/**
 * 
 * ทำหน้าที่เป็นตัวแทนในการเขียนข้อมูลจากวัตถุซึ่งได้จากการสร้างด้วยตัวเอง, 
 * หรือใช้ JSON.parse(...), ระบบนี้เน้นเรื่องความปลอดภัยในการอ่านข้อมูลที่ได้รับ
 * เป็นหลักโดยผู้ใช้งานต้องระบุคำสั่งที่ชัดเจนเพื่อระบุข้อมูลที่ต้องการให้แน่ชัด
 * 
*/

/**
 * ระบบเขียนข้อมูลวัตถุและแปลงเป็นข้อมูล JSON (JavaScript Object)
*/
const content = function (data ?: Record<string, unknown>)
{
    let instance = data ?? {};
    const init = () => { return; };

    init.toJson = () => JSON.stringify (instance, undefined, undefined);
    init.toObject = () => instance;
    init.requireString = (name: string, value: string) =>
    {
        instance = Object.defineProperty (instance, name, 
        {
            configurable: false,
            enumerable: true,
            writable: false,
            value: value,
        });
    }
    init.requireInteger = (name: string, value: number) =>
    {
        instance = Object.defineProperty (instance, name, 
        {
            configurable: false,
            enumerable: true,
            writable: false,
            value: Math.trunc (value),
        });
    }
    init.requireFloat = (name: string, value: number) =>
    {
        instance = Object.defineProperty (instance, name, 
        {
            configurable: false,
            enumerable: true,
            writable: false,
            value: value,
        });
    }
    init.requireDate = (name: string, value: Date) =>
    {
        instance = Object.defineProperty (instance, name, 
        {
            configurable: false,
            enumerable: true,
            writable: false,
            value: value.getTime (),
        });
    }
    init.requireDateISO = (name: string, value: Date) =>
    {
        instance = Object.defineProperty (instance, name, 
        {
            configurable: false,
            enumerable: true,
            writable: false,
            value: value.toISOString (),
        });
    }
    return init;
} 
Object.freeze (content);
export default content;