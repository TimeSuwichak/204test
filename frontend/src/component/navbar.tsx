import react from "react";
import styled from "styled-components";
import ctx from "#context/common.ts";
import ctxUI from "#context/common.ui.ts";

import apiAccount from "#util/api.account.ts";
import apiStorage from "#util/api.storage.ts";

import { useQuery } from "@tanstack/react-query";

import { type IrNavBar } from "#context/common.ui.ts";
import { CircleUser } from "lucide-react";

/**
 * โครงสร้างคุณสมบัติของส่วนประกอบหลัก
*/
interface PropContent
{
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบ Branding
*/
interface PropBranding
{
  /**
   * รูปภาพสำหรับแบรนด์
  */
  icon ?: string;
  /**
   * ตัวอักษรแบรนด์
  */
  text ?: string;
  /**
   * คำสั่งที่ทำงานเมื่อผู้ใช้กด
  */
  onClick ?: () => void;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบช่องค้นหา
*/
interface PropSearch
{
  /**
   * ข้อความตัวอย่าง
  */
  placeholder ?: string;
  /**
   * ทำงานเมื่อผู้ใช้กดช่องค้นหา
  */
  onClick ?: () => void;
  /**
   * ทำงานเมื่อผู้ใช้เสร็จสิ้นป้อนคำค้นหา
  */
  onChange ?: (value: string) => void;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบ Menu
*/
interface PropMenu
{
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
  /**
   * ซ่อนถ้าความกว้างน้อยกว่าที่กำหนดไว้
  */
  hideOnWidth ?: number;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบ MenuItem
*/
interface PropMenuItem
{
  /**
   * รูปไอคอนเมนู
  */
  icon ?:  string | React.ComponentType<unknown> | React.ReactElement;
  /**
   * ข้อความ
  */
  text ?: string;
  /**
   * คำสั่งที่ทำงานเมื่อผู้ใช้กด
  */
  onClick ?: () => void;
  /**
   * ซ่อนถ้าความกว้างน้อยกว่าที่กำหนดไว้
  */
  hideOnWidth ?: number;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบ SignIn
*/
interface PropSignIn
{
  /**
   * คำสั่งที่ทำงานเมื่อผู้ใช้กด
  */
  onClick ?: () => void;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบ Profile
*/
interface PropProfile
{
  /**
   * รูปโปรไฟล์
  */
  icon ?:  string | undefined;
  /**
   * คำสั่งที่ทำงานเมื่อผู้ใช้กด
  */
  onClick ?: () => void;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบ Spacing
*/
interface PropSpacing
{
  /**
   * ระดับความกว้าง
  */
  level ?: number;
}

/**
 * ส่วนประกอบแสดงผลสำหรับเมนูนำทาง
*/
const content = function NavBar (prop: PropContent)
{
  /**
   * ทำงานตอนหน้าต่างขนาดเปลี่ยนแปลง
  */
  const resizeEvent = () =>
  {
    setContext ({
      width: resizeValue ()
    });
  }
  /**
   * รับค่าความกว้างของรายการ
  */
  const resizeValue = () =>
  {
    if ((reference.current instanceof HTMLDivElement) &&
        (reference.current != HTMLDivElement.prototype))
    {
      return (reference.current.clientWidth);
    }
    return 0;
  }
  const reference = react.useRef (HTMLDivElement.prototype);
  const [context, setContext] = react.useState<IrNavBar> 
  ({
    width: resizeValue ()
  });

  /**
   * ทำงานหนึ่งครั้งที่ส่วนประกอบนี้เริ่มแสดงผล
  */
  react.useLayoutEffect (() =>
  {
    resizeEvent ();
  },
  []);
  react.useEffect (() =>
  {
    window.addEventListener ("resize", resizeEvent);

    return () =>
    {
      window.removeEventListener ("resize", resizeEvent);
    }
  },
  []);

  return (
    <Root ref={reference}>
      <ctxUI.ProviderIrNavBar value={context}>
        {prop.children}
      </ctxUI.ProviderIrNavBar>
    </Root>
  );
}
/**
 * ส่วนประกอบแสดงผลแบรนด์
*/
content.Branding = function NavBarBranding (prop: PropBranding)
{
  const context = ctxUI.useIrNavBar ();
  const readable = context.width >= 1268;

  /**
   * ทำงานทุกครั้งทุกผู้ใช้กดปุ่ม
  */
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }

  return (
    <Branding onClick={onClick}>
      <BrandingImg src={prop.icon}/>
      <BrandingLabel $show={readable}>{prop.text}</BrandingLabel>
    </Branding>
  );
}
/**
 * ส่วนประกอบแสดงผลช่องค้นหา
*/
content.Search = function NavBarSearch (prop: PropSearch)
{
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }
  const onChange = (event: react.ChangeEvent<HTMLInputElement>) =>
  {
    if (prop.onChange) {
      prop.onChange (event.target.value);
    }
  }
  return (
    <Search 
      placeholder={prop.placeholder}
      onClick={onClick}
      onChange={onChange}/>
  );
}
/**
 * ส่วนประกอบแสดงผลรูปโปรไฟล์
*/
content.Profile = function NavBarProfile (prop: PropProfile)
{
  const auth = ctx.useAuth ();
  const { data } = useQuery ({
    queryKey: ["Account", "Basic"],
    queryFn: () => apiAccount.getBasic (auth.session),
    enabled: () =>  auth.session.length > 0
  });

  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }

  return (
    <Profile onClick={onClick}>
      { !prop.icon && !data ? <CircleUser/> : <></>}
      { !prop.icon && data ? 
        data.icon.length > 0 ?
        <img src={apiStorage.getUrlStream (data.icon)}/> : 
        <CircleUser/>
        : <></>
      }
      {prop.icon ? <img src={prop.icon}/> : <></>}
    </Profile>
  );
}
/**
 * ส่วนประกอบแสดงผลปุ่มลงชื่อเข้าใช้
*/
content.SignIn = function NavBarSignIn (prop: PropSignIn)
{
  /**
   * ทำงานทุกครั้งทุกผู้ใช้กดปุ่ม
  */
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }
  return (
    <SignIn onClick={onClick}>
      ลงชื่อเข้าใช้
    </SignIn>
  );
}
/**
 * ส่วนประกอบแสดงผลเมนูปุ่มกด
*/
content.Menu = function NavBarMenu (prop: PropMenu)
{
  const context = ctxUI.useIrNavBar ();
  const visible = prop.hideOnWidth ? (prop.hideOnWidth <= context.width) : true;

  return (
    <Menu $visible={visible}>{prop.children}</Menu>
  );
}
/**
 * ส่วนประกอบแสดงผลปุ่มกดสำหรับรายการเมนูปุ่มกด
*/
content.MenuItem = function NavBarMenuItem (prop: PropMenuItem)
{
  const context = ctxUI.useIrNavBar ();
  const visible = prop.hideOnWidth ? (prop.hideOnWidth <= context.width) : true;
  const source = prop.icon;

  /**
   * ทำงานทุกครั้งทุกผู้ใช้กดปุ่ม
  */
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }
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
    return null;
  }

  return (
    <MenuItem $visible={visible} onClick={onClick}>
      <Image/>
      {context.width >= 768 ? prop.text : ""}
    </MenuItem>
  );
}
/**
 * ส่วนประกอบแสดงผลสำหรับเว้นระยะความกว้าง
*/
content.Spacing = function NavBarSpacing (prop: PropSpacing)
{
  return (
    <Spacing $level={prop.level ?? 1}/>
  );
}

const Root = styled.div`
  position: fixed;
  inset: 0px 0px auto 0px;
  height: 48px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;

  align-items: center;

  background-color: var(--bg-primary);
  border-color: var(--bg-primary-border);
  border-width: 0px 0px 2px 0px;
  border-style: solid;

  & > *:first-child { margin: 0px 0px 0px 32px; }
  & > *:last-child { margin: 0px 32px 0px 0px; }

  @media (max-width: 768px)
  {
    & > *:first-child { margin: 0px 0px 0px 16px; }
    & > *:last-child { margin: 0px 16px 0px 0px;; }
  }
`;
const Branding = styled.button`
  min-width: 32px;
  max-height: 32px;
  padding: 0px 8px;
  background-color: transparent;
  border: transparent;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  margin: 0px;
  padding: 0px;
`;
const BrandingImg = styled.img`
  width: 32px;
  height: 32px;
  vertical-align: middle;
  display: inline-block;
`;
const BrandingLabel = styled.label<{ $show: boolean }>`
  width: auto;
  font-size: 1.25rem;
  font-weight: normal;
  padding: 0px 16px;
  display: ${prop => prop.$show ? "block" : "none"};
  visibility: ${prop => prop.$show ? "visible": "hidden"};
  pointer-events: ${prop => prop.$show ? "all" : "none"};
`;
const Search = styled.input`
  display: block;
  max-width: 256px;
  min-height: 32px;

  font-size: 1rem;
  background-color: #418C94;
  border-radius: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 0px 16px;

  &::placeholder
  {
    color: #9ad3cb; 
  }
`;
const Profile = styled.button`
  display: block;
  margin: 0px;
  padding: 0px;
  width: 32px;
  min-height: 32px;

  background-color: transparent;
  color: var(--text-primary);

  &:hover, &:focus
  {
    background-color: transparent;
    color: var(--text-primary);
  }
  &:active
  {
    background-color: transparent;
    color: var(--text-primary);
  }

  & > img,
  & > svg
  {
    display: block;
    width: 32px;
    height: 32px;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    border: 0px solid var(--bg-primary-border);
    border-radius: 100%;
    transition: border-width 66ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  & > img:hover,
  & > svg:hover
  {
    border-width: 2px;
  }
`;
const SignIn = styled.button`
  min-height: 32px;
  max-height: 32px;
  font-size: 1rem;
  padding: 0px 16px;
  background-color: var(--btn-primary);
  border-radius: 4px;
  border: none;
  outline: none;
  color: var(--btn-primary-text);

  &:hover, &:focus {
    background-color: var(--btn-primary-hover);
    color: var(--btn-primary-hover-text);
  }
  &:active {
    background-color: var(--btn-primary-active);
    color: var(--btn-primary-active-text);
  }
  @media (max-width: 1024px)
  {
    min-width: 128px;
  }
`;
const Menu = styled.div<{ $visible: boolean; }>`
  margin: 0px 8px;
  max-height: 32px;
  display: ${prop => prop.$visible ? " inline-flex" : "none"};
`;
const MenuItem = styled.button<{ $visible: boolean; }>`
  min-width: 32px;
  min-height: 32px;
  max-height: 32px;
  background-color: transparent;
  border: transparent;
  display: ${prop => prop.$visible ? "flex" : "none"};
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 16px;
  align-items: center;
  justify-content: center;

  &:hover, &:focus
  {
    background-color: transparent;
    color: var(--text-primary-hover);
  }
  &:active
  {
    background-color: transparent;
    color: var(--text-primary-active);
  }

  & > img,
  & > svg
  {
    min-width: 24px;
    min-height: 24px;
    max-width: 24px;
    max-height: 24px;
  }
  color: var(--text-primary);
  font-size: 1rem;
`;
const Spacing = styled.div<{ $level: number }>`
  min-height: 32px;
  flex-grow: ${prop => prop.$level}
`;
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;