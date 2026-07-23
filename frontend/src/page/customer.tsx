import apiAuth from "#util/api.auth.ts";
import apiAccount from "#util/api.account.ts";
import cmmNavi from "#util/common.navigation.ts";

import Branding from "#asset/image/favicon.ico";
import MenuContext  from "#component/menu.context.tsx";
import Toast        from "#component/toast.tsx";
import Settings     from "#component/settings.tsx";
import NavBar       from "#component/navbar.tsx";
import CartUI       from "#component/customer.cart";

import { useDialog, useMenuContext, useSettings } from "#context/common.ui.ts";
import { defaultCart, Cart, useCart, useAccountBasic } 
from "#context/customer.ts";

import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import 
{ 
  ShoppingCart, BookMarked, SettingsIcon, LogOut,
  ShoppingBasket, Truck, SquareChevronRight
} 
from "lucide-react";
import { DialogProvider } from "#component/common.tsx";
import { useAuth } from "#context/common.ts";


/**
 * ส่วนประกอบแสดงผลเส้นทางของลูกค้า
*/
const content = function Customer ()
{
  const cart = useRef (defaultCart ());

  return (
  <>
    <Cart.Provider value={cart.current}>
      <Outlet/>
      <content.NavBar/>

      <CartUI.Provider/>
      <Settings.Provider/>
      <Toast.Provider/>
      <DialogProvider/>
      <MenuContext.Provider/>
    </Cart.Provider>
  </>
  );
}
content.NavBar = function PresetNavBar ()
{
  const menuCtx = useMenuContext ();
  const cartCtx = useCart ();
  const settings = useSettings ();
  const account = useAccountBasic ();
  const auth = useAuth ();
  const [dialog] = useDialog ();

  const toHome = () => { void cmmNavi.toIndex (); }
  const toProductBrowser = () => { void cmmNavi.toProductBrowser (); }
  const toDoc = () => { cmmNavi.toDoc (); }
  const toSignIn = () => { void cmmNavi.toAuth (); }
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
      void cmmNavi.toOrder ();
      return;
    }
    /**
     * เปิดระบบคอนโซล
    */
    const onConsole = () =>
    {
      menuCtx.setVisible (false);

      if (account.data && account.data.role == apiAccount.ROLE_STAFF)
      {
        void cmmNavi.toConsole ();        
      }
      if (account.data && account.data.role == apiAccount.ROLE_MANAGER)
      {
        void cmmNavi.toAdmin ();
      }
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
        text="ประวัติคำสั่งซื้อ" 
        icon={<Truck/>}
        onClick={onShipping}/>
      <MenuContext.Item 
        text="การตั้งค่า" 
        icon={<SettingsIcon/>}
        onClick={onSettings}/>
      { 
      (account.data && 
      (account.data.role == apiAccount.ROLE_STAFF ||
        account.data.role == apiAccount.ROLE_MANAGER ||
        account.data.role == apiAccount.ROLE_DEVELOPER)) ?
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

  useEffect (() =>
  {
    const intervalId = setInterval (() =>
    {
      const signed = auth.session.length > 0;
      const valid = apiAuth.checkSession ({
        secret: auth.session,
        issued: auth.sessionIssued,
        expire: auth.sessionExpire
      });

      if (signed && valid) {
        return;
      }
      if (signed && !valid)
      {
        clearInterval (intervalId);

        dialog.reset ();
        dialog.setTitle ("หมดเวลาการเชื่อมต่อแล้ว");
        dialog.setMessage ("คุณอาจจะต้องลงชื่อเข้าใช้ใหม่อีกครั้ง");
        dialog.setPrimary ("ดำเนินการต่อ", () =>
        {
          void cmmNavi.toAuth ({
            reason: 4
          })
        });
        dialog.setSecondary ("ลงชื่อออก", () =>
        {
          apiAuth.saveSetPrefered (-1);
          apiAuth.saveWrite ();
          location.reload ();
        });
      }
    },
    1000);

    return () =>
    {
      clearInterval (intervalId);
    }
  },
  []);

  return (
  <>
    <NavBar>
      <NavBar.Branding 
        icon={Branding} 
        text="ร้านขายแผ่นและตลับเกม" 
        onClick={toHome}/>
      <NavBar.Spacing/>
      <NavBar.Search 
        placeholder="ค้นหา เกมสุดที่รัก ..."
        onClick={(v) => {
          void cmmNavi.toProductBrowser (v); 
        }}
        onChange={(v) => {
          void cmmNavi.toProductBrowser (v);
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
        {/* <NavBar.MenuItem 
          icon={<Info/>}
          text="เกี่ยวกับ"
          onClick={toAbout}
          hideOnWidth={768}
        /> */}
      </NavBar.Menu>
      {account.data ? 
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