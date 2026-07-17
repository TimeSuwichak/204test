import { Outlet } from "react-router";
import 
{ 
  ShoppingCart, BookMarked, Info, Settings, LogOut,
  ShoppingBasket, Truck
} 
from "lucide-react";

import ctx        from "#context/common.ts";
import ctxUI      from "#context/common.ui.ts";
import navigation from "#util/common.navigation.ts";
import branding   from "#asset/image/favicon.ico";

import Auth from "#component/auth.tsx";
import MenuContext from "#component/menu.context.tsx";
import NavBar from "#component/navbar.tsx";


/**
 * ส่วนประกอบแสดงผลเส้นทางของลูกค้า
*/
const content = function ()
{
  return (
  <>

    <Outlet/>
    <content.NavBar/>
    <Auth.Provider/>
    <MenuContext.Provider/>
  </>
  );
}
content.NavBar = function PresetNavBar ()
{
  const menuCtx = ctxUI.useMenuContext ();
  const auth = ctx.useAuth ();
  const authSigned = ctx.authSigned (auth);

  const toHome = () => { void navigation.toIndex (); }
  const toProductBrowser = () => { void navigation.toProductBrowser (); }
  const toDoc = () => { navigation.toDoc (); }
  const toAbout = () => { void navigation.toAbout (); }
  const toSignIn = () => { void navigation.toAuth (); }
  const toProfile = () => 
  {
    const onCart = () =>
    {
      return;
    }
    const onShipping = () =>
    {
      return;
    }
    const onSettings = () =>
    {
      return;
    }
    const onSignOut = () =>
    {
      return;
    }

    menuCtx.setChildren (<>
      <MenuContext.Item 
        text="ตะกร้าสินค้า" 
        icon={<ShoppingBasket/>}
        onClick={onCart}/>
      <MenuContext.Item 
        text="สถานะการจัดส่ง" 
        icon={<Truck/>}
        onClick={onShipping}/>
      <MenuContext.Item 
        text="การตั้งค่า" 
        icon={<Settings/>}
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
    <NavBar>
      <NavBar.Branding 
        icon={branding} 
        text="ร้านขายแผ่นและตลับเกม" 
        onClick={toHome}/>
      <NavBar.Spacing/>
      <NavBar.Search 
        placeholder="ค้นหา เกมสุดที่รัก ..."
        onClick={toProductBrowser}/>
      <NavBar.Menu>
        <NavBar.MenuItem 
          icon={<ShoppingCart/>}
          text="สินค้า" 
          onClick={toProductBrowser}
          hideOnWidth={512}/>
        <NavBar.MenuItem 
          icon={<BookMarked/>}
          text="ช่วยเหลือ" 
          onClick={toDoc}
          hideOnWidth={640}/>
        <NavBar.MenuItem 
          icon={<Info/>}
          text="เกี่ยวกับ"
          onClick={toAbout}
          hideOnWidth={768}
        />
      </NavBar.Menu>
      {authSigned ? 
        <NavBar.Profile onClick={toProfile}/> : 
        <NavBar.SignIn onClick={toSignIn}/> 
      }
    </NavBar>
  </>);
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;