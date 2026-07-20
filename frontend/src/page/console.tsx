import react        from "react";
import styled       from "styled-components";
import MenuBar      from "#component/menu.bar.tsx";
import NavBar       from "#component/navbar.tsx";
import Logo         from "#asset/image/favicon.ico";

import ContentStock from "#component/staff.stock.tsx";
import ContentOrder from "#component/staff.order.tsx";

import
{
  UserIcon,
  UserLock,
  Container,
  Coins,
  ArrowLeftCircleIcon,
  XIcon,
  Cuboid,
  PackageSearchIcon
}
from "lucide-react";

interface PropRoot
{
  visible ?: boolean;
  transparent ?: boolean;
  width ?: string;
  widthMax ?: string;
  height ?: string;
  heightMax ?: string;
  margin ?: string;

  onClose ?: () => void;
}
interface PropView
{
  transparent ?: boolean;
  width ?: string;
  widthMax ?: string;
  height ?: string;
  heightMax ?: string;
  margin ?: string;

  container ?: react.Ref<HTMLDivElement> | undefined;
  children ?: react.ReactNode;
}
interface PropMenu
{
  content ?: [number, react.Dispatch<react.SetStateAction<number>>];
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
interface PropContentSecurity
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropContentShipping
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropContentPayment
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropTemplateBackButton
{
  visible ?: boolean;
  onClick ?: () => void;
}

/**
 * องค์ประกอบแสดงผลหน้า Console
*/
const content = function Console ()
{
  return (
    <>
      <content.Root
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
        <NavBar.Menu>
          <NavBar.MenuItem text="หน้าแรก"/>
          <NavBar.MenuItem text="เอกสาร"/>
        </NavBar.Menu>
        <NavBar.Profile/> : 
      </NavBar>
    </>
  )
}
content.Root = function ConsoleRoot (prop: PropRoot)
{
  const visible = prop.visible ?? false;
  const container = react.useRef<HTMLDivElement> (HTMLDivElement.prototype);
  const [ctn, setCtn] = react.useState (content.CONTENT_STOCK);

  const SIZE_SMALL = "256px";
  const SIZE_THEREHOLD = 768;

  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มปิด
  */
  const onClose = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClose) {
      prop.onClose ();
    }
  }
  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มย้อนกลับ
  */
  const onBack = () =>
  {
    setMenuSelected (false);
  }
  /**
   * ทำงานเมื่อขนาดหน้าต่างมีการเปลี่ยนแปลง
  */
  const onResize = () =>
  {
    setMenuWidth (resizeValue ());
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
  const [menuWidth, setMenuWidth] = react.useState (resizeValue ());
  const [menuSelected, setMenuSelected] = react.useState (false);

  /**
   * ทำงานเมื่อส่วนประกอบนี้เริ่มทำงาน
  */
  react.useEffect (() =>
  {
    window.addEventListener ("resize", onResize);

    return () =>
    {
      window.removeEventListener ("resize", onResize);
    }
  },
  []);

  return (
    <react.Activity mode={visible ? "visible" : "hidden"}>
      <content.View 
          transparent={prop.transparent} 
          width={prop.width}
          widthMax={prop.widthMax}
          height={prop.height}
          heightMax={prop.heightMax}
          margin={prop.margin}
          container={container}>
        <content.Menu 
          visible={menuWidth === SIZE_SMALL ? true : !menuSelected}
          width={"100%"}
          widthMax={menuWidth}
          content={[ctn, (x) => { 
            setCtn (x);
            setMenuSelected (true);
          }]}/>
        <content.Content 
          visible={menuWidth === SIZE_SMALL ? true : menuSelected}
          content={ctn}
          onBack={menuWidth === SIZE_SMALL ? undefined : onBack}
        />
        <StyleBack 
          $visible={prop.onClose ? true : false} 
          onClick={onClose}>
          <XIcon/>
        </StyleBack>
      </content.View>
    </react.Activity>
  );
}
content.View = function ConsoleView (prop: PropView)
{
  const transparent = prop.transparent ?? true;
  const width = prop.width ?? "100%";
  const widthMax = prop.widthMax ?? "1024px";
  const height = prop.height ?? "100%";
  const heightMax = prop.heightMax ?? "512px";
  const margin = prop.margin ?? "0px";

  return (
    <StyleRoot ref={prop.container}
      $transparent={transparent}
      $width={width}
      $widthMax={widthMax}
      $height={height}
      $heightMax={heightMax}
      $margin={margin}>
      {prop.children}
    </StyleRoot>
  );
}
/**
 * องค์ประกอบแสดงรายการเมนูนำทาง
*/
content.Menu = function ConsoleMenu (prop: PropMenu)
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
      <MenuBar.Item value={content.CONTENT_STOCK} 
        text="สต็อกสินค้า" icon={<Cuboid/>}/>
      <MenuBar.Item value={content.CONTENT_ORDER} 
        text="คำสั่งซื้อ" icon={<PackageSearchIcon/>}/>
    </MenuBar>
  );
}
content.Content = function ConsoleContent (prop: PropContent)
{
  const visible = prop.visible ?? true;
  const current = prop.content ?? 0;
  const isStock = visible && current === content.CONTENT_STOCK;
  const isOrder = visible && current === content.CONTENT_ORDER;
  const onBack = prop.onBack;


  return (
    <StyleContent>
      <content.ContentStock visible={isStock} onBack={onBack}/>
      <content.ContentOrder visible={isOrder} onBack={onBack}/>
    </StyleContent>
  );
}

content.ContentStock = function ConsoleContentStock
  (prop: PropContentGeneral) : react.ReactElement
{
  return (
    <react.Activity mode={prop.visible ? "visible" : "hidden"}>
      <content.TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <ContentStock/>
    </react.Activity>
  );
}
content.ContentOrder = function ConsoleContentOrder
  (prop: PropContentSecurity) : react.ReactElement
{
  return (
    <react.Activity mode={prop.visible ? "visible" : "hidden"}>
      <content.TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <ContentOrder/>
    </react.Activity>
  );
}

content.TemplateBackButton = function ConsoleTemplateBackButton 
  (prop: PropTemplateBackButton) : react.ReactElement
{
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }

  return (
    <StyleTemplateBackButton onClick={onClick} $visible={prop.visible ?? false}>
      <ArrowLeftCircleIcon/>
      ย้อนกลับ
    </StyleTemplateBackButton>
  );
}

content.CONTENT_UNDEFINED = 0;
content.CONTENT_STOCK = 1;
content.CONTENT_ORDER = 2;
content.CONTENT_SHIPPING = 3;
content.CONTENT_PAYMENT = 4;

const StyleRoot = styled.div<{ 
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
const StyleBack = styled.button<{ $visible: boolean; }>`
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
const StyleContent = styled.div`
  flex-grow: 1;
`;

const StyleTemplateHeader = styled.h1`
  font-size: 2rem;
  font-weight: normal;
  margin: 0px 0px 16px 0px;
`;
const StyleTemplateHeader2 = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 16px 0px 16px 0px;
`;
const StyleTemplateField = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 48px;

  @media (max-width: 768px) 
  {
    min-height: 48px;
    height: auto;
  }

  & > div:nth-child(1)
  {
    width: 100%;
    flex-grow: 1;
    /* background-color: var(--bg-secondary); */
  }
  & > div:nth-child(2)
  {
    display: inline-flex;
    align-items: center;
    justify-content: end;
    width: 100%;
    max-width: 324px;
    gap: 16px;
  }
  & > div:nth-child(2) > button
  {
    width: 128px;
  }
`;
const StyleTemplateBackButton = styled.button<{ $visible: boolean; }>`
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

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;