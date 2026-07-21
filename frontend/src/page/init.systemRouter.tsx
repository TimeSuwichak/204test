import { lazy, useEffect } from "react";
import { Route, Routes, Outlet } from "react-router";

import InitDebug from "#page/init.debug.tsx";

//
// โหลดหน้าต่างเมื่อจำเป็นเท่านั้น
// I: Initializer
// G: Global
// C: Customer
// S: Staff
// A: Manager || Admin
// V: View
//

const GAuth = lazy (() => import ("#page/auth.tsx"));
const GSettings = lazy (() => import ("#page/settings.tsx"));
const G404 = lazy (() => import ("#page/error.404.tsx"));
const CAbout = lazy (() => import ("#page/customer.about.tsx"));
const CHome = lazy (() => import ("#page/customer.home.tsx"));
const CProd = lazy (() => import ("#page/customer.product.tsx"));
const CProdBrowse = lazy (() => import ("#page/customer.productBrowser.tsx"));
const COrder = lazy (() => import ("#page/customer.order.tsx"));
const SMain = lazy (() => import ("#page/staff.tsx"));
const AMain = lazy (() => import ("#page/admin.tsx"));
const AConsole = lazy (() => import ("#page/console.tsx"));
const VCustomer = lazy (() => import ("#page/customer.tsx"));

const content = function InitSystemRouter (prop: ComponentProperty)
{
  useEffect (() =>
  {
    const onMounted = prop.onMounted;
    const onUnmounted = prop.onUnmounted;

    onMounted ();

    return () =>
    {
      onUnmounted ();
    }
  },
  [prop.onMounted, prop.onUnmounted]);

  return (
    <Routes>
      <Route Component={content.Outlet} caseSensitive>
        {/* Common */}
        <Route>
          <Route path="/auth" element={<GAuth/>}/>
          <Route path="/settings" element={<GSettings/>}/>
        </Route>
        {/* Customer */}
        <Route Component={VCustomer} caseSensitive>
          <Route index Component={CProdBrowse}/>
          <Route path="/about" Component={CAbout}/>
          <Route path="/product" Component={CProd}/>
          <Route path="/product-browser" Component={CProdBrowse}/>
          <Route path="/order" Component={COrder}/>
        </Route>
        {/* Staff && Manager */}
        <Route caseSensitive>
          <Route path="/staff" Component={SMain}/>
          <Route path="/admin" Component={AMain}/>
          <Route path="/console" Component={AConsole}/>
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
  if (import.meta.env.DEV)
  {
    return <>
      <Outlet/>
      <InitDebug/>
    </>;
  }
  return <Outlet/>
}


interface ComponentProperty
{
  onMounted: () => void;
  onUnmounted: () => void;
}

/**
 * ส่งออกตัวแปร
*/
export default content;