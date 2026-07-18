import { Outlet } from "react-router";
import 
{ 
  ShoppingCart, BookMarked, Info, SettingsIcon, LogOut,
  ShoppingBasket, Truck
} 
from "lucide-react";

import ctx        from "#context/common.ts";
import ctxUI      from "#context/common.ui.ts";
import apiAuth    from "#util/api.auth.ts";
import navigation from "#util/common.navigation.ts";
import branding   from "#asset/image/favicon.ico";

import MenuContext from "#component/menu.context.tsx";
import Settings from "#component/settings.tsx";
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

    <MenuContext.Provider/>
    <Settings.Provider/>
  </>
  );
}
content.NavBar = function PresetNavBar ()
{
  const menuCtx = ctxUI.useMenuContext ();
  const settings = ctxUI.useSettings ();
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
      menuCtx.setVisible (false);
      void navigation.toShipping ();
      return;
    }
    const onSettings = () =>
    {
      settings.setClose (() =>
      {
        settings.setVisible (false);
      });
      settings.setVisible (true);
      menuCtx.setVisible (false);
      // void navigation.toSettings ();
      return;
    }
    const onSignOut = () =>
    {
      apiAuth.saveSetPrefered (-1);
      apiAuth.saveWrite ();
      location.reload ();
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
    <NavBar>
      <NavBar.Branding 
        icon={branding} 
        text="ร้านขายแผ่นและตลับเกม" 
        onClick={toHome}/>
      <NavBar.Spacing/>
      <NavBar.Search 
        placeholder="ค้นหา เกมสุดที่รัก ..."
        onClick={toProductBrowser}
        onChange={(v) => {
          void navigation.toProductBrowser (v);
        }}/>
      <NavBar.Menu hideOnWidth={512}>
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