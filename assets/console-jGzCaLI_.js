import{r as e,t}from"./react-C1VktWof.js";import{t as n}from"./index-V2cGtSIi.js";import{r}from"./styled-components.browser.esm-BhrFqjok.js";import{t as i}from"./api.auth-BVGiUq4E.js";import{t as a}from"./createLucideIcon-AHYuUPOs.js";import{r as o,t as s}from"./settings-DMuM_l_F.js";import{a as c,i as l,n as u,r as d,t as f}from"./toast-DED3BoM1.js";import{t as p}from"./settings-B0OrHZIa.js";import{t as m}from"./shield-user-D_1lttQr.js";import{t as h}from"./x-CbaDagQ9.js";import{h as g,m as _}from"./common.ui-Ca9FJCyu.js";import{t as v}from"./menu.bar-BrleDA_T.js";import{n as y,t as b}from"./staff.order-rdialeTi.js";import{t as x}from"./common.navigation-CVoe_2SQ.js";var S=a(`cuboid`,[[`path`,{d:`M10 22v-8`,key:`1f8443`}],[`path`,{d:`M2.336 8.89 10 14l11.715-7.029`,key:`1qnufy`}],[`path`,{d:`M22 14a2 2 0 0 1-.971 1.715l-10 6a2 2 0 0 1-2.138-.05l-6-4A2 2 0 0 1 2 16v-6a2 2 0 0 1 .971-1.715l10-6a2 2 0 0 1 2.138.05l6 4A2 2 0 0 1 22 8z`,key:`670npk`}]]),C=a(`package-search`,[[`path`,{d:`M12 22V12`,key:`d0xqtd`}],[`path`,{d:`M20.27 18.27 22 20`,key:`er2am`}],[`path`,{d:`M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559`,key:`tok1h1`}],[`path`,{d:`M3.29 7 12 12l8.71-5`,key:`19ckod`}],[`path`,{d:`m7.5 4.27 8.997 5.148`,key:`9yrvtv`}],[`circle`,{cx:`18.5`,cy:`16.5`,r:`2.5`,key:`ke13xx`}]]),w=e(t(),1),T=n();function E(){let e=_(),t=g();return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(D,{visible:!0,transparent:!0,width:`100%`,widthMax:`100%`,height:`100%`,heightMax:`100%`,margin:`48px 0px 0px 0px`}),(0,T.jsxs)(d,{children:[(0,T.jsx)(d.Branding,{text:`แผนควบคุมระบบ`,icon:l}),(0,T.jsx)(d.Spacing,{}),(0,T.jsx)(d.Profile,{onClick:()=>{e.setChildren((0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(u.Item,{text:`การตั้งค่า`,icon:(0,T.jsx)(p,{}),onClick:()=>{t.setClose(()=>{t.setVisible(!1)}),t.setVisible(!0),e.setVisible(!1)}}),(0,T.jsx)(u.Item,{text:`ลงชื่อออก`,icon:(0,T.jsx)(c,{}),onClick:()=>{i.saveSetPrefered(-1),i.saveWrite(),x.toIndex()}})]})),e.setInset(`56px 16px 0px auto`),e.setCancel(()=>{e.setVisible(!1)}),e.setVisible(!0)}}),` :`]}),(0,T.jsx)(s.Provider,{}),(0,T.jsx)(f.Provider,{}),(0,T.jsx)(u.Provider,{})]})}function D({visible:e,transparent:t,width:n,widthMax:r,height:i,heightMax:a,margin:o,onClose:s}){let c=(0,w.useRef)(null),[l,u]=(0,w.useState)(F),d=`256px`;function f(e){e.preventDefault(),e.stopPropagation(),s&&s()}function p(){y(!1)}let m=()=>c.current instanceof HTMLDivElement&&c.current!=HTMLDivElement.prototype?c.current.clientWidth>=768?d:`100%`:window.innerWidth>=768?d:`100%`,[g,_]=(0,w.useState)(d),[v,y]=(0,w.useState)(!1),b=(0,w.useCallback)(()=>{_(m())},[]);return(0,w.useEffect)(()=>(window.addEventListener(`resize`,b),c.current&&b(),()=>{window.removeEventListener(`resize`,b)}),[b]),(0,T.jsx)(w.Activity,{mode:e?`visible`:`hidden`,children:(0,T.jsxs)(O,{transparent:t??!0,width:n??`100%`,widthMax:r??`100%`,height:i??`100%`,heightMax:a??`100%`,margin:o??`0px`,container:c,children:[(0,T.jsx)(k,{visible:g===d?!0:!v,width:`100%`,widthMax:g,content:[l,e=>{u(e),y(!0)}]}),(0,T.jsx)(A,{visible:g===d?!0:v,content:l,onBack:g===d?void 0:p}),(0,T.jsx)(z,{$visible:!!s,onClick:f,children:(0,T.jsx)(h,{})})]})})}function O({transparent:e,width:t,widthMax:n,height:r,heightMax:i,margin:a,container:o}){return(0,T.jsx)(R,{ref:o,$transparent:e,$width:t,$widthMax:n,$height:r,$heightMax:i,$margin:a})}function k(e){return(0,T.jsxs)(v,{visible:e.visible??!0,direction:`column`,width:e.width??`100%`,widthMax:e.widthMax??`256px`,height:`100%`,align:`start`,selected:1,margin:e.widthMax==`100%`?`0px`:`0px 32px 0px 0px`,onClick:t=>{e.content&&e.content[1](t)},children:[(0,T.jsx)(v.Heading,{text:`คอนโซล`}),(0,T.jsx)(v.Item,{value:F,text:`สต็อกสินค้า`,icon:(0,T.jsx)(S,{})}),(0,T.jsx)(v.Item,{value:I,text:`คำสั่งซื้อ`,icon:(0,T.jsx)(C,{})}),(0,T.jsx)(v.Item,{value:L,text:`ผู้ใช้`,icon:(0,T.jsx)(m,{})})]})}function A(e){let t=e.visible??!0,n=e.content??0,r=t&&n===F,i=t&&n===I,a=t&&n===L,o=e.onBack;return(0,T.jsxs)(B,{children:[(0,T.jsx)(j,{visible:r,onBack:o}),(0,T.jsx)(M,{visible:i,onBack:o}),(0,T.jsx)(N,{visible:a,onBack:o})]})}function j(e){return(0,T.jsxs)(w.Activity,{mode:e.visible?`visible`:`hidden`,children:[(0,T.jsx)(P,{visible:e.onBack!=null,onClick:e.onBack}),(0,T.jsx)(y,{})]})}function M(e){return(0,T.jsxs)(w.Activity,{mode:e.visible?`visible`:`hidden`,children:[(0,T.jsx)(P,{visible:e.onBack!=null,onClick:e.onBack}),(0,T.jsx)(b,{})]})}function N(e){return(0,T.jsxs)(w.Activity,{mode:e.visible?`visible`:`hidden`,children:[(0,T.jsx)(P,{visible:e.onBack!=null,onClick:e.onBack}),(0,T.jsx)(N,{})]})}function P(e){return(0,T.jsxs)(V,{onClick:t=>{t.preventDefault(),t.stopPropagation(),e.onClick&&e.onClick()},$visible:e.visible??!1,children:[(0,T.jsx)(o,{}),`ย้อนกลับ`]})}var F=1,I=2,L=3,R=r.div`
  background-color: ${e=>e.$transparent?`transparent`:`var(--bg-primary)`};
  border-radius: 8px;
  width: ${e=>e.$width};
  height: ${e=>e.$height};
  max-width: ${e=>e.$widthMax};
  max-height: ${e=>e.$heightMax};
  margin: ${e=>e.$margin};
  
  padding: 16px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
`,z=r.button`
  width: 32px;
  height: 32px;
  border: none;
  position: absolute;
  inset: 16px 16px auto auto;
  margin: 0px;
  padding: 0px;
  display: ${e=>e.$visible?`block`:`none`};

  & > img, & > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
  }
`,B=r.div`
  flex-grow: 1;
`,V=r.button`
  display: ${e=>e.$visible?`block`:`none`};
  width: 192px;
  height: 40px;
  background-color: transparent;
  text-align: start;

  & > img,
  & > svg
  {
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
  }
`;export{E as default};