import react from "react";
import { lazy } from "react";
import { Route, Routes, Outlet } from "react-router"

const GAuth = lazy (() => import ("#page/auth.tsx"));
const GSettings = lazy (() => import ("#page/settings.tsx"));
const G404 = lazy (() => import ("#page/error.404.tsx"));

const CAbout = lazy (() => import ("#page/customer.about.tsx"));
const CHome = lazy (() => import ("#page/customer.home.tsx"));
const CProd = lazy (() => import ("#page/customer.product.tsx"));
const CProdBrowse = lazy (() => import ("#page/customer.productBrowser.tsx"));
const CShipping = lazy (() => import ("#page/customer.shipping.tsx"));

const SMain = lazy (() => import ("#page/staff.tsx"));

const AConsole = lazy (() => import ("#page/console.tsx"));
const ADashboard = lazy (() => import ("#page/admin.dashboard.tsx"));

const VCustomer = lazy (() => import ("#page/customer.tsx"));

const content = function InitSystemRouter (  
  { onComplete }: { onComplete: () => void; })
{
  react.useEffect (() =>
  {
    onComplete ();
  },
  []);

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
          <Route index Component={CHome}/>
          <Route path="/about" Component={CAbout}/>
          <Route path="/product" Component={CProd}/>
          <Route path="/product-browser" Component={CProdBrowse}/>
          <Route path="/shipping" Component={CShipping}/>
        </Route>
        {/* Staff && Manager */}
        <Route caseSensitive>
          <Route path="/staff" Component={SMain}/>
          <Route path="/admin" Component={ADashboard}/>
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
    </>;
  }
  return <Outlet/>
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;