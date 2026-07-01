//
// จุดเริ่มต้นของเว็บแอป - ระบบส่วนหน้า
//
import react from "react";
import reactDom from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router-dom";
//
// โหลดหน้าต่างเมื่อจำเป็นเท่านั้น
//
const Init = react.lazy (() => import ("./init.tsx"));
const Home = react.lazy (() => import ("./home.tsx"));
const Doc = react.lazy (() => import ("./doc.tsx"));
const Auth = react.lazy (() => import ("./auth.tsx"));
const Product = react.lazy (() => import ("./product.tsx"));
const Settings = react.lazy (() => import ("./settings.tsx"));



function Main ()
{
  const view = document.getElementById ("app") as HTMLDivElement;
  const root = reactDom.createRoot (view);

  root.render (<>
    <react.StrictMode>
      <react.Suspense fallback={<Splash/>}>
        <HashRouter>
          <Routes>
            <Route Component={() => <Init/>}>
              <Route path="/" index element={<Home/>}/>
              <Route path="/doc" element={<Doc/>}/>
              <Route path="/product" element={<Product/>}/>
              <Route path="/auth" element={<Auth/>}/>
              <Route path="/settings" element={<Settings/>}/>
            </Route>
          </Routes>
        </HashRouter>
      </react.Suspense>
    </react.StrictMode>
  </>);
}
export default function Splash ()
{
  const root: react.CSSProperties =
  {
    position: "absolute", inset: "0px",
    width: "100%", height: "100%",
    backgroundColor: "rgb(16, 16, 24)"
  };
  const center: react.CSSProperties =
  {
    position: "absolute", inset: "0px",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center"
  };

  return <>
    <div style={root}/>
    <div style={center}>
      <h1>The Web Project</h1>
    </div>
  </>;
}

Main ();