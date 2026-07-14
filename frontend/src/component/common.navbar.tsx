import react from "react";
import styled from "styled-components";

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
 * โครงสร้างคุณสมบัติของส่วนประกอบ Menu
*/
interface PropMenu
{
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
}
/**
 * โครงสร้างคุณสมบัติของส่วนประกอบ MenuItem
*/
interface PropMenuItem
{
  /**
   * รูปไอคอนเมนู
  */
  icon ?: string;
  /**
   * ข้อความ
  */
  text ?: string;
  /**
   * คำสั่งที่ทำงานเมื่อผู้ใช้กด
  */
  onClick ?: () => void;
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
 * โครงสร้างข้อมูลบริบทของเมนูนำทาง
*/
interface ContextContent
{
  /**
   * ความกว้างของหน้าจอ ณ ปัจจุบัน
  */
  width: number;
}

const CtxContent = react.createContext<ContextContent> ({
  width: 0
});

/**
 * ส่วนประกอบแสดงผลสำหรับเมนูนำทาง
*/
const content = function NavBar (prop: PropContent)
{
  const reference = react.useRef (HTMLDivElement.prototype);
  const [context, setContext] = react.useState<ContextContent> 
  ({
    width: 0
  });

  /**
   * ทำงานตอนหน้าต่างขนาดเปลี่ยนแปลง
  */
  const onResize = () =>
  {
    setContext ({
      width: reference.current.clientWidth
    });
  }
  /**
   * ทำงานหนึ่งครั้งที่ส่วนประกอบนี้เริ่มแสดงผล
  */
  react.useLayoutEffect (() =>
  {
    onResize ();
  },
  []);
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
    <Root ref={reference}>
      <CtxContent value={context}>
        {prop.children}
      </CtxContent>
    </Root>
  );
}
/**
 * ส่วนประกอบแสดงผลแบรนด์
*/
content.Branding = function NavBarBranding (prop: PropBranding)
{
  const context = react.useContext (CtxContent);
  const readable = context.width >= 768;

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
content.Search = function NavBarSearch ()
{
  return (
    <Search placeholder="ค้นหา เกมสุดที่รัก ..."/>
  );
}
/**
 * ส่วนประกอบแสดงผลรูปโปรไฟล์
*/
content.Profile = function NavBarProfile ()
{
  return (
    <Profile>
      <ProfileImg/>
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
  return (
    <Menu>{prop.children}</Menu>
  );
}
/**
 * ส่วนประกอบแสดงผลปุ่มกดสำหรับรายการเมนูปุ่มกด
*/
content.MenuItem = function NavBarMenuItem (prop: PropMenuItem)
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
    <MenuItem onClick={onClick}>
      {prop.icon ? <MenuItemIcon src={prop.icon}/> : <></>}
      {prop.text ? <MenuItemText>{prop.text}</MenuItemText> : <></>}
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
`;
const Branding = styled.button`
  min-width: 32px;
  max-height: 32px;
  padding: 0px 8px;
  background-color: transparent;
  border: transparent;
`;
const BrandingImg = styled.img`
  width: 32px;
  height: 32px;
  vertical-align: middle;
`;
const BrandingLabel = styled.label<{ $show: boolean }>`
  width: auto;
  height: 32px;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0px 16px;
  visibility: ${prop => prop.$show ? "visible": "hidden"};
  pointer-events: ${prop => prop.$show ? "all" : "none"};
`;
const Search = styled.input`
  display: block;
  width: 256px;
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
const Profile = styled.div`
  width: 32px;
  min-height: 32px;
`;
const ProfileImg = styled.img`
  display: block;
  width: 32px;
  height: 32px;
  border: 0px solid var(--bg-primary-border);
  border-radius: 100%;
  transition: border-width 66ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover
  {
    border-width: 2px;
  }
`;
const SignIn = styled.button`
  min-width: 32px;
  min-height: 32px;
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
`;
const Menu = styled.div`
  margin: 0px 8px;
  height: 32px;
`;
const MenuItem = styled.button`
  width: 96px;
  height: 32px;
  background-color: transparent;
  border: transparent;
`;
const MenuItemIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 16px;
`;
const MenuItemText = styled.span`
  color: var(--text-primary);
  font-size: 1rem;
  height: 32px;
  // margin: 0px 16px;
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