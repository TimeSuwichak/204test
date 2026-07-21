import react from "react";

export interface MenuContext
{
    setVisible: (value: boolean) => void;
    setChildren: (value: react.ReactNode) => void;
    setInset: (value ?: string) => void;
    setCancel: (value ?: () => void) => void;
}
export interface Settings
{
    setVisible: (value: boolean) => void;
    setClose: (value ?: () => void) => void;
}
export interface Toast
{
    setIcon: (
        value:  string | React.ComponentType<unknown> | React.ReactElement
    ) => void;
    setText: (value: string) => void;
    setDuration: (value: number) => void;
    setVisible: (value: boolean) => void;
}

export interface IrMenuBar
{
  direction: "row" | "column";
  align: "start" | "center" | "end";
  selected: unknown;

  onClick: (value: unknown, handled: boolean) => void;
}
/**
 * โครงสร้างข้อมูลบริบทของเมนูนำทาง
*/
export interface IrNavBar
{
    /**
    * ความกว้างของหน้าจอ ณ ปัจจุบัน
    */
    width: number;
}


const defMenuContext = () : MenuContext =>
{
    return {
        setVisible: () => { return; },
        setChildren: () => { return; },
        setInset: () => { return; },
        setCancel: () => { return; }
    }
}
const defSettings = () : Settings =>
{
    return {
        setVisible: () => { return; },
        setClose: () => { return; }
    }
}
const defToast = () : Toast =>
{
    return {
        setIcon: () => { return; },
        setText: () => { return; },
        setDuration: () => { return; },
        setVisible: () => { return; },
    }
}
const defIrMenuBar = () : IrMenuBar =>
{
    return {
        direction: "row",
        align: "center",
        selected: undefined,

        onClick: () => { return; }
    }
}
const defIrNavBar = () : IrNavBar =>
{
    return {
        width: 0
    }
}


const useMenuContext = () =>
{
    return react.useContext (ContextMenuContext);
}
const useSettings = () =>
{
    return react.useContext (ContextSettings);
}
const useToast = () =>
{
    return react.useContext (ContextToast);
}
const useIrMenuBar = () =>
{
    return react.useContext (ContextIrMenuBar);
}
const useIrNavBar = () =>
{
    return react.useContext (ContextIrNavBar)
}

const Content = () => { return; }
const ContextMenuContext = react.createContext (defMenuContext ());
const ContextSettings = react.createContext (defSettings ());
const ContextToast = react.createContext (defToast ());
const ContextIrMenuBar = react.createContext (defIrMenuBar ());
const ContextIrNavBar = react.createContext (defIrNavBar ());

Content.ProviderMenuContext = ContextMenuContext;
Content.ProviderSettings = ContextSettings;
Content.ProviderToast = ContextToast;

Content.defMenuContext = defMenuContext;
Content.defSettings = defSettings;
Content.defToast = defToast;
Content.useMenuContext = useMenuContext
Content.useSettings = useSettings;
Content.useToast = useToast;

Content.ProviderIrMenuBar = ContextIrMenuBar.Provider;
Content.ProviderIrNavBar = ContextIrNavBar.Provider;

Content.defIrMenuBar = defIrMenuBar;
Content.defIrNavBar = defIrNavBar;
Content.useIrMenuBar = useIrMenuBar;
Content.useIrNavBar = useIrNavBar;

export default Content;