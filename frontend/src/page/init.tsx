import { useState, useEffect, lazy } from "react";
import { HashRouter, Routes, Route, Outlet } from "react-router";

//
// โหลดหน้าต่างเมื่อจำเป็นเท่านั้น
//
const Home = lazy (() => import ("./home.tsx"));
const Auth = lazy (() => import ("./auth.tsx"));
const Product = lazy (() => import ("./product.tsx"));
const Settings = lazy (() => import ("./settings.tsx"));

/**
 * หน้าต่างที่ไม่มีการแสดงผลเป็นของตัวเอง
 * แต่ใช้สำหรับการโหลดโค็ดและเริ่มการทำงานระบบส่วนต่าง ๆ
*/
export default function Init ()
{
  const [completed, setCompleted] = useState (false);

  useEffect (() =>
  {
    void new Promise (() =>
    {
      const initAuth = () => { return; }
      const initAccount = () => { return; }

      try
      {
          initAuth ();
          initAccount ();
          setCompleted (true);
      }
      catch (except)
      {
        console.error (except);
      }
    });
  },
  []);
  useEffect (() =>
  {
    const element = document.getElementById ("app-splash");

    if (element)
    {
      element.style.opacity = (completed ? "0.0" : "1.0");
      element.style.pointerEvents = (completed ? "none" : "all");
    }
  },
  [completed]);

  const View = () =>
  {
    return <>
      {completed ? <Outlet/> : <></>}
    </>
  };

  return <>
    <HashRouter>
      <Routes>
        <Route Component={() => <View/>}>
          <Route path="/" index element={<Home/>}/>
          <Route path="/product" element={<Product/>}/>
          <Route path="/auth" element={<Auth/>}/>
          <Route path="/settings" element={<Settings/>}/>
        </Route>
      </Routes>
    </HashRouter>
  </>;
}