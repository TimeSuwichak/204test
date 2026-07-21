
import ctx          from "#context/common.ts";
import ctxUI        from "#context/common.ui.ts";
import ctxCustomer  from "#context/customer.ts";
import apiAuth      from "#util/api.auth.ts";
import apiAccount   from "#util/api.account.ts";
import navigation   from "#util/common.navigation.ts";
import branding     from "#asset/image/favicon.ico";

import MenuContext  from "#component/menu.context.tsx";
import Toast        from "#component/toast.tsx";
import Settings     from "#component/settings.tsx";
import NavBar       from "#component/navbar.tsx";
import Cart         from "#component/customer.cart";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import 
{ 
  ShoppingCart, BookMarked, Info, SettingsIcon, LogOut,
  ShoppingBasket, Truck,
  SquareChevronRight
} 
from "lucide-react";


/**
 * ส่วนประกอบแสดงผลเส้นทางของลูกค้า
*/
const content = function Customer ()
{
  const cart = useRef (ctxCustomer.defCart ());

  return (
  <>
    <ctxCustomer.ProviderCart value={cart.current}>
      <Outlet/>
      <content.NavBar/>

      <Cart.Provider/>
      <Settings.Provider/>
      <Toast.Provider/>
      <MenuContext.Provider/>
    </ctxCustomer.ProviderCart>
  </>
  );
}
content.NavBar = function PresetNavBar ()
{
  const menuCtx = ctxUI.useMenuContext ();
  const cartCtx = ctxCustomer.useCart ();
  const settings = ctxUI.useSettings ();
  const auth = ctx.useAuth ();
  const authSigned = ctx.authSigned (auth);

  const { data: accountData } = useQuery ({
    queryKey: ["Account", "Basic"],
    queryFn: () => apiAccount.getBasic (auth.session),
    enabled: apiAuth.checkSession ({
      secret: auth.session,
      issued: auth.sessionIssued,
      expire: auth.sessionExpire
    })
  });
  
  const toHome = () => { void navigation.toIndex (); }
  const toProductBrowser = () => { void navigation.toProductBrowser (); }
  const toDoc = () => { navigation.toDoc (); }
  const toAbout = () => { void navigation.toAbout (); }
  const toSignIn = () => { void navigation.toAuth (); }
  const toProfile = () => 
  {
    /**
     * เปิดตะกร้า
    */
    const onCart = () =>
    {
      menuCtx.setVisible (false);
      cartCtx.setVisible (true);
      cartCtx.setClose (() => { cartCtx.setVisible (false); });
      return;
    }
    /**
     * เปิดประวัติการสั่งซื้อ
    */
    const onShipping = () =>
    {
      menuCtx.setVisible (false);
      void navigation.toOrder ();
      return;
    }
    /**
     * เปิดระบบคอนโซล
    */
    const onConsole = () =>
    {
      menuCtx.setVisible (false);
      void navigation.toConsole ();
      return;
    }
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
      location.reload ();
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
      { 
      (accountData && 
      (accountData.role == apiAccount.ROLE_STAFF ||
        accountData.role == apiAccount.ROLE_MANAGER ||
        accountData.role == apiAccount.ROLE_DEVELOPER)) ?
        <MenuContext.Item 
          text="คอนโซล" 
          icon={<SquareChevronRight/>}
          onClick={onConsole}/> :
         <></>
      }
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
 * ส่งออกตัวแปร
*/
export default content;