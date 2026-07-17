import react from "react";

export interface MenuContext
{
    setVisible: (value: boolean) => void;
    setChildren: (value: react.ReactNode) => void;
    setInset: (value ?: string) => void;
    setCancel: (value ?: () => void) => void;
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

const defIrMenuBar = () : IrMenuBar =>
{
    return {
        direction: "row",
        align: "center",
        selected: undefined,

        onClick: () => { return; }
    }
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
const ContextIrMenuBar = react.createContext (defIrMenuBar ());
const ContextIrNavBar = react.createContext (defIrNavBar ());

Content.ProviderMenuContext = ContextMenuContext;

Content.defMenuContext = defMenuContext;
Content.useMenuContext = useMenuContext;

Content.ProviderIrMenuBar = ContextIrMenuBar.Provider;
Content.ProviderIrNavBar = ContextIrNavBar.Provider;

Content.defIrMenuBar = defIrMenuBar;
Content.defIrNavBar = defIrNavBar;
Content.useIrMenuBar = useIrMenuBar;
Content.useIrNavBar = useIrNavBar;

export default Content;