import react from "react";
import styled from "styled-components";
import context from "#context/common.ui.ts";
import empty from "#asset/image/empty.png";

/**
 * โครงสร้างคุณสมบัติของส่วนประกอบหลัก
*/
interface PropRoot
{
  /**
   * ระบุการแสดงผล
  */
  visible ?: boolean;
  /**
   * ระบุตำแหน่งที่วางของเมนู
  */
  inset ?: string;
  /**
   * ระบุความกว้างของเมนู
  */
  width ?: string;
  /**
   * ระบุความกว้างที่สุดของเมนู
  */
  widthMax ?: string;
  /**
   * ระบุความสูงของเมนู
  */
  height ?: string;
  /**
   * ระบุความสูงที่สุดของเมนู
  */
  heightMax ?: string;
  /**
   * รายการของเมนู
  */
  children ?: react.ReactNode;
  /**
   * ทำงานเมื่อผู้ใช้ต้องการยกเลิกเมนูดังกล่าว
  */
  onCancel ?: () => void;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบเมนู
*/
interface PropItem
{
  /**
   * ไอคอนให้กับเมนู
  */
  icon ?: string | React.ComponentType<unknown> | React.ReactElement;
  /**
   * ข้อความของเมนู
  */
  text ?: string;
  /**
   * ทำงานเมื่อผู้ใช้กดเมนูดังกล่าว
  */
  onClick ?: () => void;
}
/**
 * ส่วนประกอบแสดงผลสำหรับรายการของแต่ละเมนูแบบมีบริบท
*/
const content = function MenuContext (prop: PropRoot)
{
  return <content.Root
    visible={prop.visible}
    inset={prop.inset}
    width={prop.width}
    widthMax={prop.widthMax}
    height={prop.height}
    heightMax={prop.heightMax}
    onCancel={prop.onCancel}>
      {prop.children}
  </content.Root>
}
/**
 * 
*/
content.Root = function MenuContextRoot (prop: PropRoot)
{
  const autoPosition = react.useRef ([ 0, 0 ]);
  const autoPositionX = `${String (autoPosition.current [0])}px`;
  const autoPositionY = `${String (autoPosition.current [1])}px`;
  
  const visible = prop.visible ?? false;
  const inset = prop.inset ?? `${autoPositionY} auto auto ${autoPositionX}`;

  const width = prop.width ?? "256px";
  const widthMax = prop.widthMax ?? "256px";
  const height = prop.height ?? "auto";
  const heightMax = prop.heightMax ?? "384px";

  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onCancel) {
      prop.onCancel ();
    }
  }
  const onClickContainer = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();
  }

  const onTrackPosition = (event: MouseEvent) =>
  {
    autoPosition.current = [event.clientX, event.clientY];
  }

  react.useEffect (() =>
  {
    window.addEventListener ("mousemove", onTrackPosition);

    return () =>
    {
      window.removeEventListener ("mousemove", onTrackPosition);
    }
  },
  []);

  return (
    <react.Activity mode={visible ? "visible" : "hidden"}>
      <StyleRoot>
        <StyleRootInner onClick={onClick}>
          <StyledPlacement
            $inset={inset}
            $width={width}
            $widthMax={widthMax}
            $height={height}
            $heightMax={heightMax}>
            <StyleContainer
              onClick={onClickContainer}
              $inset={inset}
              $width={width}
              $height={height}>
              {prop.children}
            </StyleContainer>
          </StyledPlacement>
        </StyleRootInner>
      </StyleRoot>
    </react.Activity>
  );
}
content.Item = function MenuContextItem (prop: PropItem)
{
  const source = prop.icon;
  const Image = () =>
  {
    if (typeof source === 'string') 
    {
      return <img src={source} alt={""}/>;
    }
    if (react.isValidElement(source)) 
    {
      return source;
    }

    if (typeof source === 'function' || typeof source === 'object') 
    {
      const Component = source as React.ComponentType;
      return <Component />;
    }
    return <img src={empty} alt={""}/>;;
  }

  return (
    <StyleItem>
      <Image/>
      {prop.text}
    </StyleItem>
  );
}
content.Provider = function MenuContextProvider ()
{
  const ctx = react.useContext (context.ProviderMenuContext);
  const [visible, setVisible] = react.useState (false);
  const [child, setChild] = react.useState<react.ReactNode> (<></>);
  const [inset, setInset] = react.useState<string | undefined> (undefined);
  const onCancel = react.useRef<(() => void) | undefined> (undefined);

  react.useEffect (() =>
  {
    ctx.setVisible = (value: boolean) => { setVisible (value); }
    ctx.setChildren = (value: react.ReactNode) => { setChild (value); };
    ctx.setInset = (value ?: string) => { setInset (value); }
    ctx.setCancel  =(value ?: () => void) => { onCancel.current = value; }

    return () =>
    {
      ctx.setVisible = () => { return ;}
      ctx.setChildren = () => { return; }
      ctx.setInset = () => { return; }
    };
  },
  []);


  return (
    <content.Root 
      visible={visible} 
      inset={inset}
      onCancel={onCancel.current}>
      {child}
    </content.Root>
  );
}

const StyleRoot = styled.div`
  overflow: hidden;
  overscroll-behavior: none;
  pointer-events: all;
  position: fixed;
  inset: 0px;
`;
const StyleRootInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const StyledPlacement = styled.div<{
  $inset: string;
  $width: string;
  $widthMax: string;
  $height: string;
  $heightMax: string;
}>`
  position: absolute;
  inset: ${prop => prop.$inset};
  width: ${prop => prop.$width};
  height: ${prop => prop.$height};
  max-width: ${prop => prop.$widthMax};
  max-height: ${prop => prop.$heightMax};
`;
const StyleContainer = styled.div<{
  $inset: string;
  $width: string;
  $height: string;
}>`
  inset: ${prop => prop.$inset};
  width: ${prop => prop.$width};
  height: ${prop => prop.$height};
  max-width: 100%;
  max-height: 100%;

  background-color: var(--bg-primary);
  border: 2px solid var(--bg-primary-border);
  border-radius: 4px;
`;
const StyleItem = styled.button`
  background-color: transparent;
  color: var(--text-primary);
  display: block;
  width: 100%;
  text-align: start;

  & > img,
  & > svg
  {
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
    width: 24px;
    height: 24px;
  }
`;

export default content;
