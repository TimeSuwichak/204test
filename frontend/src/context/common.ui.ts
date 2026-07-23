import 
{ 
    createContext, useContext, 
    type ReactNode,
    type ReactElement
} 
from "react";

/**
 * โครงสร้างข้อมูลบริบทแสดงหน้าเมนูบริบท
*/
export interface MenuContext
{
    setVisible: (value: boolean) => void;
    setChildren: (value: ReactNode) => void;
    setInset: (value ?: string) => void;
    setCancel: (value ?: () => void) => void;
}
/**
 * โครงสร้างข้อมูลบริบทแสดงกหน้าตั้งค่าระบบ
*/
export interface Settings
{
    setVisible: (value: boolean) => void;
    setClose: (value ?: () => void) => void;
}
/**
 * โครงสร้างข้อมูลบริบทแสดงกล่าวข้อความขนาดเล็ก ๆ
 * ตรงขอบหน้าจอของผู้ใช้งาน
*/
export interface Toast
{
    setIcon: (value: string | ReactElement) => void;
    setText: (value: string) => void;
    setDuration: (value: number) => void;
    setVisible: (value: boolean) => void;
}
/**
 * โครงสร้างข้อมูลบริบทแสดงกล่องข้อความหรือหน้าต่างป๊อปอัป
 * ที่ปรากฏขึ้นบนหน้าจอเพื่อแจ้งเตือน, ขอข้อมูล, หรือให้ผู้ใช้งานตัดสินใจ
*/
export interface Dialog
{
    setVisible: (value: boolean) => void;
    setTitle: (value: string) => void;
    setMessage: (value: string) => void;
    setPrimary: (text: string, callback: () => void) => void;
    setSecondary: (text: string, callback: () => void) => void;
    reset: () => void;
}
/**
 * โครงสร้างข้อมูลบริบทแสดงกล่องข้อความหรือหน้าต่างป๊อปอัป
 * ที่ปรากฏขึ้นบนหน้าจอเพื่อแจ้งเตือน, ขอข้อมูล, หรือให้ผู้ใช้งานตัดสินใจ
*/
export interface DialogInput
{
    setVisible: (value: boolean) => void;
    setTitle: (value: string) => void;
    setMessage: (value: string) => void;
    setPrimary: (text: string, callback: (value: string) => void) => void;
    setSecondary: (text: string, callback: (value: string) => void) => void;
    reset: () => void;
}
/**
 * โครงสร้างข้อมูลบริบทการแสดงเนื้อหาตัวอย่าง
*/
export interface Preview
{
    setVisible: (value: boolean) => void;
    setSource: (value: string) => void;
    reset: () => void;
}

/**
 * โครงสร้างข้อมูลบริบทเมนูนำทางขนาดเล็ก (ข้อมูลใช้งานภายในส่วนประกอบ)
*/
export interface IrMenuBar
{
    /**
     * ทิศทางการแสดงผล
    */
    direction: "row" | "column";
    /**
     * การจัดวางข้อความ
    */
    align: "start" | "center" | "end";
    /**
     * ค่าที่กำลังเลือก
    */
    selected: unknown;
    /**
     * คำสั่งที่ทำงานเมื่อผู้ใช้กดปุ่ม
    */
    onClick: (value: unknown, handled: boolean) => void;
}
/**
 * โครงสร้างข้อมูลบริบทของเมนูนำทาง ข้อมูลใช้งานภายในส่วนประกอบ)
*/
export interface IrNavBar
{
    /**
    * ความกว้างของหน้าจอ ณ ปัจจุบัน
    */
    width: number;
}


export function defaultMenuContext () : MenuContext
{
    return {
        setVisible: () => { return; },
        setChildren: () => { return; },
        setInset: () => { return; },
        setCancel: () => { return; }
    }
}
export function defaultSettings () : Settings
{
    return {
        setVisible: () => { return; },
        setClose: () => { return; }
    }
}
export function defaultToast () : Toast
{
    return {
        setIcon: () => { return; },
        setText: () => { return; },
        setDuration: () => { return; },
        setVisible: () => { return; },
    }
}
export function defaultDialog () : Dialog
{
    return {
        setVisible: () => { return; },
        setTitle: () => { return; },
        setMessage: () => { return; },
        setPrimary: () => { return; },
        setSecondary: () => { return; },
        reset: () => { return; },
    }
}
export function defaultDialogInput () : DialogInput
{
    return {
        setVisible: () => { return; },
        setTitle: () => { return; },
        setMessage: () => { return; },
        setPrimary: () => { return; },
        setSecondary: () => { return; },
        reset: () => { return; },
    }
}
export function defaultPreview () : Preview
{
    return {
        setVisible: () => { return; },
        setSource: () => { return; },
        reset: () => { return; },
    }
}
export function defaultIrMenuBar () : IrMenuBar
{
    return {
        direction: "row",
        align: "center",
        selected: undefined,

        onClick: () => { return; }
    }
}
export function defaultIrNavBar () : IrNavBar
{
    return {
        width: 0
    }
}

/**
 * เรียกใช้งานบริบท: เมนูบริบท
*/
export function useMenuContext ()
{
    return useContext (CtxMenuContext);
}
/**
 * เรียกใช้งานบริบท: หน้าต่างการตั้งค่า
*/
export function useSettings ()
{
    return useContext (CtxSettings);
}
/**
 * เรียกใช้งานบริบท: การแจ้งเตือนขนาดเล็ก
*/
export function useToast ()
{
    return useContext (CtxToast);
}
/**
 * เรียกใช้งานบริบท: การแจ้งเตือนขนาดใหญ่
*/
export function useDialog ()
{
    return useContext (CtxDialog);
}
export function usePreview ()
{
    return useContext (CtxPreview);
}
export function useIrMenuBar ()
{
    return useContext (CtxIrMenuBar);
}
export function useIrNavBar ()
{
    return useContext (CtxIrNavBar)
}

type CtxType<T> = [T, (V: T) => void];

export const CtxMenuContext = createContext (defaultMenuContext ());
export const CtxSettings = createContext (defaultSettings ());
export const CtxToast = createContext (defaultToast ());
export const CtxDialog = createContext<CtxType<Dialog>> ([
    defaultDialog (),
    function (value: Dialog) { void value; }
]);
export const CtxDialogInput = createContext<CtxType<DialogInput>> ([
    defaultDialogInput (),
    function (value: DialogInput) { void value; }
]);
export const CtxPreview = createContext<CtxType<Preview>> ([
    defaultPreview (),
    function (value: Preview) { void value; }
]);
export const CtxIrMenuBar = createContext (defaultIrMenuBar ());
export const CtxIrNavBar = createContext (defaultIrNavBar ());