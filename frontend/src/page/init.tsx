import react from "react";
import commonCtx from "#context/common.ts";
import commonLog from "#util/common.log.ts";
import commonNav from "#util/common.navigation.ts";
import apiAuth from "#util/api.auth.ts";

import { lazy } from "react";
import { HashRouter, Routes, Route, Outlet, useNavigate } from "react-router";

interface PropSplash
{
  visible: boolean;
}

//
// โหลดหน้าต่างเมื่อจำเป็นเท่านั้น
//
const GAuth = lazy (() => import ("#page/auth.tsx"));
const GSettings = lazy (() => import ("#page/settings.tsx"));
const G404 = lazy (() => import ("#page/error.404.tsx"));

const CAbout = lazy (() => import ("#page/customer.about.tsx"));
const CHome = lazy (() => import ("#page/customer.home.tsx"));
const CProd = lazy (() => import ("#page/customer.product.tsx"));
const CProdBrowse = lazy (() => import ("#page/customer.productBrowser.tsx"));
const CShipping = lazy (() => import ("#page/customer.shipping.tsx"));

const ADashboard = lazy (() => import ("#page/admin.dashboard.tsx"));

const VCustomer = lazy (() => import ("#page/customer.tsx"));

/**
 * หน้าต่างที่ไม่มีการแสดงผลเป็นของตัวเอง
 * แต่ใช้สำหรับการโหลดโค็ดและเริ่มการทำงานระบบส่วนต่าง ๆ
*/
const content = function Init ()
{
  return (
    <>
      <content.Splash visible={false}/>
      <commonCtx.ProviderAuth value={commonCtx.initAuth ()}>
        <HashRouter>
          <content.System/>
        </HashRouter>
      </commonCtx.ProviderAuth>
    </>
  );
}
content.System = function InitSystem ()
{
  const navigate = useNavigate ();
  const [completed, setCompleted] = react.useState (false);
  const auth = commonCtx.useAuth ();

  function onInit ()
  {
    commonLog.init ();
    commonNav.init (navigate);

    apiAuth.saveLoad ();

    const saved = apiAuth.saveGetItemPrefered ();

    if (saved)
    {
      auth.name = saved.name;
      auth.session = saved.secret;
      auth.sessionIssued = saved.issued;
      auth.sessionExpire = saved.expired;
    }
  }
  function onTerminate ()
  {
    commonNav.terminate ();
    commonLog.terminate ();
  }
  const onComplete = () =>
  {
    return;
  }
  const onError = () =>
  {
    return;
  }
  react.useLayoutEffect (() =>
  {
    try
    {
      onInit ();
      onComplete ();
      setCompleted (true);
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

  if (!completed)
  {
    return (<></>);
  }
  return (
    <Routes>
      <Route Component={content.Outlet}>
        {/* Common */}
        <Route>
          <Route path="/auth" element={<GAuth/>}/>
          <Route path="/settings" element={<GSettings/>}/>
        </Route>
        {/* Customer */}
        <Route Component={VCustomer}>
          <Route index Component={CHome}/>
          <Route path="/about" Component={CAbout}/>
          <Route path="/product/:id" Component={CProd}/>
          <Route path="/product-browser" Component={CProdBrowse}/>
          <Route path="/shipping" Component={CShipping}/>
        </Route>
        {/* Staff && Manager */}
        <Route>
          <Route path="/admin/dashboard" Component={ADashboard}/>
        </Route>
        <Route>
          <Route path="/*" Component={G404}/>
        </Route>
      </Route>
    </Routes>
  );
}
content.Outlet = function InitOutlet ()
{
  const navigate = useNavigate ();

  function onInit ()
  {
    commonLog.init ();
    commonNav.init (navigate);
  }
  function onTerminate ()
  {
    commonNav.terminate ();
    commonLog.terminate ();
  }
  const onComplete = () =>
  {
    return;
  }
  const onError = () =>
  {
    return;
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

  if (import.meta.env.DEV)
  {
    return <>
      <Outlet/>
    </>;
  }
  return <Outlet/>
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

  return (<></>);
}
export default content;