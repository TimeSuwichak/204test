import react from "react";
import 
{
  useNavigate,
  HashRouter,
  Outlet,
  Route,
  Routes
} 
from "react-router";

import log from "#util/common.log.ts";
import navigation from "#util/common.navigation.ts";

//
// โหลดหน้าต่างเมื่อจำเป็นเท่านั้น
//
const CoAuth 
  = react.lazy (() => import ("./auth.tsx"));
const CoSettings 
  = react.lazy (() => import ("./settings.tsx"));
const CoDebug 
  = react.lazy (() => import ("./initDebug.tsx"));
const CoNavBarCustomer 
  = react.lazy (() => import ("../component/customer.navbar.tsx"));

const CoError404
  = react.lazy (() => import ("./error.404.tsx"));

const CsAbout
  = react.lazy (() => import ("./about.tsx"));
const CsHome 
  = react.lazy (() => import ("./customer.home.tsx"));
const CsProduct 
  = react.lazy (() => import ("./customer.product.tsx"));
const CsProductBrowser 
  = react.lazy (() => import ("./customer.productBrowser.tsx"));
const CsShipping
  = react.lazy (() => import ("./customer.shipping.tsx"));

interface PropSplash
{
  visible: boolean;
}
interface PropBootstrap
{
  onComplete: () => void;
  onError: () => void;
}

/**
 * หน้าต่างที่ไม่มีการแสดงผลเป็นของตัวเอง
 * แต่ใช้สำหรับการโหลดโค็ดและเริ่มการทำงานระบบส่วนต่าง ๆ
*/
const content = function Init ()
{
  const [completed, setCompleted] = react.useState (false);

  function onComplete ()
  {
    setCompleted (true);
    return;
  }
  function onError ()
  {
    return;
  }
  return <>
    <HashRouter>
      <content.Splash visible={!completed}/>
      <content.Bootstrap onComplete={onComplete} onError={onError}/>
    </HashRouter>
  </>;
}
content.Splash = function InitSplash (prop: PropSplash)
{
  const root = react.useRef (document.getElementById ("app-splash"));
  const text = react.useRef (document.getElementById ("app-splash-text"));

  react.useEffect (() =>
  {
    if (text.current)
    {
      const comment = [
        "ยินดีต้อนรับ",
        "กำลังโหลด ...",
        "ถล่มให้ยับเลย!",
        "วันนี้ฉันมาทำอะไรนะะ"
      ];
      const random = Math.trunc (Math.random () * comment.length);
      const selected = comment[random];

      text.current.textContent = selected;
    }
  },
  []);
  react.useEffect (() =>
  {
    if (root.current)
    {
      root.current.style.opacity = (prop.visible ? "1.0" : "0.0");
      root.current.style.pointerEvents = (prop.visible ? "all" : "none");
    }
  },
  [prop]);

  return <></>;
}
content.Bootstrap = function InitBootstrap (prop: PropBootstrap)
{
  const navigator = useNavigate ();

  function onInit ()
  {
    log.init ();
    navigation.init (navigator);
  }
  function onTerminate ()
  {
    navigation.terminate ();
    log.terminate ();
  }
  function onComplete ()
  {
    prop.onComplete ();
  }
  function onError ()
  {
    prop.onError ();
  }
  react.useEffect (() =>
  {
    try
    {
      onInit ();
      onComplete ();
    }
    catch (except)
    {
      console.error (except);
      onTerminate ();
      onError ();
      return;
    }
    return () =>
    {
      onTerminate ();
    }
  },
  []);
  return (
  <Routes>
    <Route caseSensitive Component={content.Outlet}>
      <Route path="/auth" element={<CoAuth/>}/>
      <Route path="/settings" element={<CoSettings/>}/>
    </Route>
    <Route caseSensitive Component={content.OutletCustomer}>
      <Route index element={<CsHome/>}/>
      <Route path="/about" element={<CsAbout/>}/>
      <Route path="/product" element={<CsProduct/>}/>
      <Route path="/product-browser" element={<CsProductBrowser/>}/>
      <Route path="/shipping" element={<CsShipping/>}/>
    </Route>;
    <Route>
      <Route path="*" element={<CoError404/>}/>
    </Route>
  </Routes>
  );
}
content.Outlet = function InitOutlet ()
{
  if (import.meta.env.DEV)
  {
    return <>
      <Outlet/>
      <CoDebug/>
    </>;
  }
  return <Outlet/>
}
content.OutletCustomer = function InitOutletCustomer ()
{
  if (import.meta.env.DEV)
  {
    return <>
      <Outlet/>
      <CoNavBarCustomer/>
      <CoDebug/>
    </>;
  }
  return <>
    <Outlet/>
    <CoNavBarCustomer/>
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