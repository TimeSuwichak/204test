import { Outlet } from "react-router";
import {
  ShoppingCart,
  BookMarked,
  Info
}
from "lucide-react";

import NavBar from "#component/navbar.tsx";
import navigation from "#util/common.navigation.ts";
import ctx from "#context/common.ts";
import branding from "#asset/image/favicon.ico";

/**
 * ส่วนประกอบแสดงผลเส้นทางของลูกค้า
*/
const content = function ()
{
  return (
  <>
    <Outlet/>
    <content.NavBar/>
  </>
  );
}
content.NavBar = function PresetNavBar ()
{
  const toHome = () => { void navigation.toIndex (); }
  const toProductBrowser = () => { void navigation.toProductBrowser (); }
  const toDoc = () => { navigation.toDoc (); }
  const toAbout = () => { void navigation.toAbout (); }
  const toSignIn = () => { void navigation.toAuth (); }
  const auth = ctx.useAuth ();
  const authSigned = ctx.authSigned (auth);

  return <>
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
    {authSigned ? <NavBar.Profile/> : <NavBar.SignIn onClick={toSignIn}/> }
  </NavBar>
  </>;
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;