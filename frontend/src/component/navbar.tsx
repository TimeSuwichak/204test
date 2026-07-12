import react from "react";
import styled from "styled-components";


interface ContentProperty
{
  children ?: react.ReactNode;
}
interface MenuProperty
{
  children ?: react.ReactNode;
}
interface MenuItemProperty
{
  icon ?: string;
  text ?: string;
  onClick ?: () => void;
}
interface SpacingProperty
{
  level ?: number;
}

interface ContentContextProperty
{
  width: number;
}
const ContentContext = react.createContext<ContentContextProperty> ({
  width: 0
});
const content = function NavBar (prop: ContentProperty)
{
  const [width, setWidth] = react.useState (0);
  const reference = react.useRef (HTMLDivElement.prototype);
  const resize = () =>
  {
    setWidth (reference.current.clientWidth);
  }
  react.useEffect (() =>
  {
    window.addEventListener ("resize", resize);
    resize ();

    return () =>
    {
      window.removeEventListener ("resize", resize);
    }
  },
  []);
  react.useEffect (() =>
  {
    console.log (width);
  },
  [width]);

  return <Root ref={reference}>
    <ContentContext value={{ width: width }}>
      {prop.children}
    </ContentContext>
  </Root>;
}
content.Branding = function NavBarBranding ()
{
  const context = react.useContext (ContentContext);
  const readable = context.width >= 768;

  return <Branding>
    <BrandingImg src={undefined}/>
    <BrandingLabel $show={readable}>ร้านขายแผ่นและตลับเกม</BrandingLabel>
  </Branding>;
}
content.Search = function NavBarSearch ()
{
  return <Search placeholder="ค้นหา เกมสุดที่รัก ..."/>
}
content.Profile = function NavBarProfile ()
{
  return <Profile>
    <ProfileImg/>
  </Profile>
}
content.Menu = function NavBarMenu (prop: MenuProperty)
{
  return <Menu>
    {prop.children}
  </Menu>
}
content.MenuItem = function NavBarMenuItem (prop: MenuItemProperty)
{
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }

  return <MenuItem onClick={onClick}>
    {prop.icon ? <MenuItemIcon src={prop.icon}/> : <></>}
    {prop.text ? <MenuItemText>{prop.text}</MenuItemText> : <></>}
  </MenuItem>
}

content.Spacing = function NavBarSpacing (prop: SpacingProperty)
{
  return <Spacing $level={prop.level ?? 1}/>;
}

const Root = styled.div`
  position: absolute;
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
const Branding = styled.div`
  min-width: 32px;
  max-height: 32px;
`;
const BrandingImg = styled.img`
  width: 32px;
  height: 32px;
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
export default content;