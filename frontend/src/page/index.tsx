//
// จุดเริ่มต้นของเว็บแอป - ระบบส่วนหน้า
//
import React from "react";
import ReactDOM from "react-dom/client";
import Component from "#page/init.tsx";

const domElement = document.getElementById ("app") as HTMLDivElement;
const domReact = ReactDOM.createRoot (domElement);

domReact.render (
  <React.StrictMode>
    <Component/>
  </React.StrictMode>
);