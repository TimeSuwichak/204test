
import Logo         from "#asset/image/favicon.ico";
import MenuBar      from "#component/menu.bar.tsx";
import NavBar       from "#component/navbar.tsx";
import MenuContext  from "#component/menu.context.tsx";
import Toast        from "#component/toast.tsx";
import Settings     from "#component/settings.tsx";
import ContentStock from "#component/staff.stock.tsx";
import ContentOrder from "#component/staff.order.tsx";

import apiAuth      from "#util/api.auth.ts";
import cmmNavi      from "#util/common.navigation.ts";

import { styled } from "styled-components";
import { useMenuContext, useSettings } from "#context/common.ui.ts";
import 
{ 
  useState, useEffect, useRef, useCallback,
  Activity,
  type MouseEvent,
  type SetStateAction,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type RefObject,
} 
from "react";
import 
{
  ArrowLeftCircleIcon, XIcon, Cuboid, PackageSearchIcon, ShieldUser,
  SettingsIcon, LogOut
}
from "lucide-react";


/**
 * องค์ประกอบแสดงผลหน้า Console
*/
export default function Console ()
{
  const menuCtx = useMenuContext ();
  const settings = useSettings ();
  
  const toProfile = () => 
  {
    /**
     * เปิดหน้าการตั้งค่า
    */
    const onSettings = () =>
    {
      settings.setClose (() =>
      {
        settings.setVisible (false);
      });
      settings.setVisible (true);
      menuCtx.setVisible (false);
    }
    /**
     * ลงชื่อผู้ใช้ออก 
    */
    const onSignOut = () =>
    {
      apiAuth.saveSetPrefered (-1);
      apiAuth.saveWrite ();
      void cmmNavi.toIndex ();
    }
    menuCtx.setChildren (<>
      <MenuContext.Item 
        text="การตั้งค่า" 
        icon={<SettingsIcon/>}
        onClick={onSettings}/>
      <MenuContext.Item 
        text="ลงชื่อออก" 
        icon={<LogOut/>}
        onClick={onSignOut}/>
    </>);
    menuCtx.setInset ("56px 16px 0px auto");
    menuCtx.setCancel (() => { menuCtx.setVisible (false); });
    menuCtx.setVisible (true);
  }
  
  return (
    <>
      <ComRoot
        visible={true}
        transparent={true}
        width="100%"
        widthMax="100%"
        height="100%"
        heightMax="100%"
        margin="48px 0px 0px 0px"
      />
      <NavBar>
        <NavBar.Branding text="แผนควบคุมระบบ" icon={Logo}/>
        <NavBar.Spacing/>
        <NavBar.Profile onClick={toProfile}/> : 
      </NavBar>
      <Settings.Provider/>
      <Toast.Provider/>
      <MenuContext.Provider/>
    </>
  )
}
function ComRoot ({
  visible, transparent, width, widthMax, height, heightMax, margin, 
  onClose
}:
/**
 * โครงสร้างประกอบสำหรับส่วนประกอบหลัก
*/
{
  visible ?: boolean;
  transparent ?: boolean;
  width ?: string;
  widthMax ?: string;
  height ?: string;
  heightMax ?: string;
  margin ?: string;
  onClose ?: () => void;
})
/**
 * โครงสร้างประกอบสำหรับส่วนประกอบหลัก
*/
{
  const container = useRef<HTMLDivElement> (null);
  const [ctn, setCtn] = useState (PAGE_STOCK);

  const SIZE_SMALL = "256px";
  const SIZE_THEREHOLD = 768;

  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มปิด
  */
  function onButtonClose (event: MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (onClose) { onClose (); }
  }
  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มย้อนกลับ
  */
  function onButtonBack ()
  {
    setMenuSelected (false);
  }
  /**
   * รับค่าความกว้างของรายการเมนู
  */
  const resizeValue = () =>
  {
    if (container.current instanceof HTMLDivElement &&
        container.current != HTMLDivElement.prototype)
    {
      return (container.current.clientWidth) >= 
        SIZE_THEREHOLD ? SIZE_SMALL : "100%";
    }
    return (window.innerWidth) >= 
      SIZE_THEREHOLD ? SIZE_SMALL : "100%";
  }
  
  const [menuWidth, setMenuWidth] = useState (SIZE_SMALL);
  const [menuSelected, setMenuSelected] = useState (false);

  /**
   * ทำงานเมื่อขนาดหน้าต่างมีการเปลี่ยนแปลง
  */
  const onResize = useCallback(() =>
  {
    setMenuWidth (resizeValue ());
  },
  []);
  /**
   * ทำงานเมื่อส่วนประกอบนี้เริ่มทำงาน
  */
  useEffect (() =>
  {
    window.addEventListener ("resize", onResize);

    if (container.current)
    {
      onResize ();
    }
    return () =>
    {
      window.removeEventListener ("resize", onResize);
    }
  },
  [onResize]);

  return (
    <Activity mode={visible ? "visible" : "hidden"}>
      <ComView 
          transparent={transparent ?? true} 
          width={width ?? "100%"}
          widthMax={widthMax ?? "100%"}
          height={height ?? "100%"}
          heightMax={heightMax ?? "100%"}
          margin={margin ?? "0px"}
          container={container}>
        <ComMenu 
          visible={menuWidth === SIZE_SMALL ? true : !menuSelected}
          width={"100%"}
          widthMax={menuWidth}
          content={[ctn, (x) => { 
            setCtn (x);
            setMenuSelected (true);
          }]}/>
        <ComContent 
          visible={menuWidth === SIZE_SMALL ? true : menuSelected}
          content={ctn}
          onBack={menuWidth === SIZE_SMALL ? undefined : onButtonBack}
        />
        <StlBack 
          $visible={onClose ? true : false} 
          onClick={onButtonClose}>
          <XIcon/>
        </StlBack>
      </ComView>
    </Activity>
  );
}
function ComView ({ 
  transparent, width, widthMax, height, heightMax, margin, container, children
}:
/**
 * โครงสร้างประกอบสำหรับส่วนประกอบแสดงองค์ประกอบ
*/
{
  transparent: boolean;
  width: string;
  widthMax: string;
  height: string;
  heightMax: string;
  margin: string;
  container: RefObject<HTMLDivElement | null>;
  children: ReactNode;
})
{
  return (
    <StlRoot ref={container}
      $transparent={transparent}
      $width={width}
      $widthMax={widthMax}
      $height={height}
      $heightMax={heightMax}
      $margin={margin}>
        {children}
    </StlRoot>
  );
}
/**
 * องค์ประกอบแสดงรายการเมนูนำทาง
*/
function ComMenu (prop: PropMenu)
{
  const selectEvent = (value: unknown) =>
  {
    if (prop.content)
    {
      prop.content[1] (value as number);
    }
  }
  const visible = prop.visible ?? true;
  const width = prop.width ?? "100%";
  const widthMax = prop.widthMax ?? "256px";

  return (
    <MenuBar 
        visible={visible}
        direction="column" 
        width={width} widthMax={widthMax} height="100%" 
        align="start" selected={1}
        margin={prop.widthMax != "100%" ? "0px 32px 0px 0px" : "0px"}
        onClick={selectEvent}>
      <MenuBar.Heading text="คอนโซล"/>
      <MenuBar.Item value={PAGE_STOCK} 
        text="สต็อกสินค้า" icon={<Cuboid/>}/>
      <MenuBar.Item value={PAGE_ORDER} 
        text="คำสั่งซื้อ" icon={<PackageSearchIcon/>}/>
      <MenuBar.Item value={PAGE_ACCOUNT} 
        text="ผู้ใช้" icon={<ShieldUser/>}/>
    </MenuBar>
  );
}
function ComContent (prop: PropContent)
{
  const visible = prop.visible ?? true;
  const current = prop.content ?? 0;
  const isStock = visible && current === PAGE_STOCK;
  const isOrder = visible && current === PAGE_ORDER;
  const isAct   = visible && current === PAGE_ACCOUNT;
  const onBack = prop.onBack;


  return (
    <StlContent>
      <ComContentStock visible={isStock} onBack={onBack}/>
      <ComContentOrder visible={isOrder} onBack={onBack}/>
      <ComContentAccount visible={isAct} onBack={onBack}/>
    </StlContent>
  );
}

function ComContentStock (prop: PropContentGeneral) : ReactElement
{
  return (
    <Activity mode={prop.visible ? "visible" : "hidden"}>
      <TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <ContentStock/>
    </Activity>
  );
}
function ComContentOrder (prop: PropContentOrder) : ReactElement
{
  return (
    <Activity mode={prop.visible ? "visible" : "hidden"}>
      <TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <ContentOrder/>
    </Activity>
  );
}
function ComContentAccount (prop: PropContentAccount) : ReactElement
{
  return (
    <Activity mode={prop.visible ? "visible" : "hidden"}>
      <TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <ComContentAccount/>
    </Activity>
  );
}

function TemplateBackButton (prop: PropTemplateBackButton) : ReactElement
{
  const onClick = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }

  return (
    <StlTemplateBackButton onClick={onClick} $visible={prop.visible ?? false}>
      <ArrowLeftCircleIcon/>
      ย้อนกลับ
    </StlTemplateBackButton>
  );
}

/**
 * หน้าจัดการข้อมูลสต็อก
*/
const PAGE_STOCK = 1;
/**
 * หน้าจัดการข้อมูลคำสั่งซื้อ
*/
const PAGE_ORDER = 2;
/**
 * หน้าจัดการข้อมูลบัญชี
*/
const PAGE_ACCOUNT = 3;

interface PropMenu
{
  content ?: [number, Dispatch<SetStateAction<number>>];
  visible ?: boolean;
  width ?: string;
  widthMax ?: string;
}
interface PropContent
{
  visible ?: boolean;
  content ?: number;
  onBack ?: () => void;
}
interface PropContentGeneral
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropContentOrder
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropContentAccount
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropTemplateBackButton
{
  visible ?: boolean;
  onClick ?: () => void;
}

const StlRoot = styled.div<{ 
  $transparent: boolean; 
  $width: string;
  $widthMax: string;
  $height: string;
  $heightMax: string;
  $margin: string;
}>`
  background-color: ${prop => prop.$transparent ? 
    "transparent" : "var(--bg-primary)"};
  border-radius: 8px;
  width: ${prop => prop.$width};
  height: ${prop => prop.$height};
  max-width: ${prop => prop.$widthMax};
  max-height: ${prop => prop.$heightMax};
  margin: ${prop => prop.$margin};
  
  padding: 16px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
`;
const StlBack = styled.button<{ $visible: boolean; }>`
  width: 32px;
  height: 32px;
  border: none;
  position: absolute;
  inset: 16px 16px auto auto;
  margin: 0px;
  padding: 0px;
  display: ${prop => prop.$visible ? "block" : "none"};

  & > img, & > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
  }
`;
const StlContent = styled.div`
  flex-grow: 1;
`;
const StlTemplateBackButton = styled.button<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
  width: 192px;
  height: 40px;
  background-color: transparent;
  text-align: start;

  & > img,
  & > svg
  {
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
  }
`;