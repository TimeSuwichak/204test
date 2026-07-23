import{r as e,t}from"./react-C1VktWof.js";import{t as n}from"./index-V2cGtSIi.js";import{r}from"./styled-components.browser.esm-BhrFqjok.js";import{t as i}from"./createLucideIcon-AHYuUPOs.js";import{t as a}from"./user-lock-Cisi-UFr.js";import{t as o}from"./user-DE1zXFWB.js";import{t as s}from"./x-CbaDagQ9.js";import{d as c,g as l,h as u}from"./common.ui-Ca9FJCyu.js";import{t as d}from"./menu.bar-BrleDA_T.js";import{i as f,m as p,r as m}from"./customer-DD1YOHcU.js";import{a as h}from"./common-CcV5LtAo.js";import{t as g}from"./api.account-3eivGuoB.js";var _=i(`circle-arrow-left`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m12 8-4 4 4 4`,key:`15vm53`}],[`path`,{d:`M16 12H8`,key:`1fr5h0`}]]),v=i(`circle-user`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`circle`,{cx:`12`,cy:`10`,r:`3`,key:`ilqhr7`}],[`path`,{d:`M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662`,key:`154egf`}]]),y=i(`container`,[[`path`,{d:`M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z`,key:`1t2lqe`}],[`path`,{d:`M10 21.9V14L2.1 9.1`,key:`o7czzq`}],[`path`,{d:`m10 14 11.9-6.9`,key:`zm5e20`}],[`path`,{d:`M14 19.8v-8.1`,key:`159ecu`}],[`path`,{d:`M18 17.5V9.4`,key:`11uown`}]]),b=e(t(),1),x=n(),S=function(e){return(0,x.jsx)(S.Root,{visible:e.visible,transparent:e.transparent,width:e.width,widthMax:e.widthMax,height:e.height,heightMax:e.heightMax})};S.Root=function(e){let t=`256px`,n=b.useRef(HTMLDivElement.prototype),r=(0,b.useCallback)(()=>n.current instanceof HTMLDivElement&&n.current!=HTMLDivElement.prototype?n.current.clientWidth>=768?t:`100%`:window.innerWidth>=768?t:`100%`,[n]),i=e.visible??!1,[a,o]=(0,b.useState)(S.CONTENT_GENERAL),[c,l]=(0,b.useState)(r()),[u,d]=(0,b.useState)(!1),f=t=>{t.preventDefault(),t.stopPropagation(),e.onClose&&e.onClose()},p=()=>{d(!1)},m=(0,b.useCallback)(()=>{l(r())},[r]);return(0,b.useEffect)(()=>(window.addEventListener(`resize`,m),()=>{window.removeEventListener(`resize`,m)}),[m]),(0,x.jsx)(b.Activity,{mode:i?`visible`:`hidden`,children:(0,x.jsxs)(S.View,{transparent:e.transparent,width:e.width,widthMax:e.widthMax,height:e.height,heightMax:e.heightMax,container:n,children:[(0,x.jsx)(S.Menu,{visible:c===t?!0:!u,width:`100%`,widthMax:c,content:[a,e=>{o(e),d(!0)}]}),(0,x.jsx)(S.Content,{visible:c===t?!0:u,content:a,onBack:c===t?void 0:p}),(0,x.jsx)(w,{$visible:!!e.onClose,onClick:f,children:(0,x.jsx)(s,{})})]})})},S.View=function(e){let t=e.transparent??!0,n=e.width??`100%`,r=e.widthMax??`1024px`,i=e.height??`100%`,a=e.heightMax??`512px`;return(0,x.jsx)(C,{ref:e.container,$transparent:t,$width:n,$widthMax:r,$height:i,$heightMax:a,children:e.children})},S.Menu=function(e){return(0,x.jsxs)(d,{visible:e.visible??!0,direction:`column`,width:e.width??`100%`,widthMax:e.widthMax??`256px`,height:`100%`,align:`start`,selected:1,margin:e.widthMax==`100%`?`0px`:`0px 32px 0px 0px`,onClick:t=>{e.content&&e.content[1](t)},children:[(0,x.jsx)(d.Heading,{text:`การตั้งค่า`}),(0,x.jsx)(d.Item,{value:S.CONTENT_GENERAL,text:`ทั่วไป`,icon:(0,x.jsx)(o,{})}),(0,x.jsx)(d.Item,{value:S.CONTENT_SECURITY,text:`ความปลอดภัย`,icon:(0,x.jsx)(a,{})}),(0,x.jsx)(d.Item,{value:S.CONTENT_SHIPPING,text:`การจัดส่ง`,icon:(0,x.jsx)(y,{})})]})},S.Content=function(e){let t=e.visible??!0,n=e.content??0,r=t&&n===S.CONTENT_GENERAL,i=t&&n===S.CONTENT_SECURITY,a=t&&n===S.CONTENT_SHIPPING,o=t&&n===S.CONTENT_PAYMENT,s=e.onBack;return(0,x.jsxs)(T,{children:[(0,x.jsx)(S.ContentGeneral,{visible:r,onBack:s}),(0,x.jsx)(S.ContentSecurity,{visible:i,onBack:s}),(0,x.jsx)(S.ContentShipping,{visible:a,onBack:s}),(0,x.jsx)(S.ContentPayment,{visible:o,onBack:s})]})},S.ContentGeneral=function(e){let t=h(),n=l(),r=(0,b.useRef)(HTMLInputElement.prototype),[i]=c(),[a,o]=(0,b.useState)(!1),s=m(),u=f(),d=e=>{e.preventDefault(),e.stopPropagation(),r.current instanceof HTMLInputElement&&r.current!=HTMLInputElement.prototype&&r.current.click()},_=e=>{if(e.preventDefault(),e.stopPropagation(),o(!0),!e.target.files)return;let r=e.target.files[0];g.updateBasic(t.session,{icon:r}).then(()=>s.refetch()).then(()=>{n.setText(`เปลี่ยนรูปโปรไฟล์ใหม่เรียบร้อย`),n.setDuration(5e3),n.setVisible(!0),o(!1)}).catch(()=>{i.reset(),i.setTitle(`เกิดข้อผิดพลาด`),i.setMessage(`เกิดข้อผิดพลาดในการเปลี่ยนรูปโปรไฟล์ กรุณาลองใหม่อีกครั้ง`),i.setPrimary(`เข้าใจแล้ว`,()=>{i.setVisible(!1)}),i.setVisible(!0),o(!1)})},y=e=>{e.preventDefault(),e.stopPropagation()},C=e=>{e.preventDefault(),e.stopPropagation()},w=e=>{e.preventDefault(),e.stopPropagation()},T=s.data,E=u.data,A=T?p.getUrlStream(T.icon):``,M=T?T.name:``,N=E?E.email:``;return(0,x.jsxs)(b.Activity,{mode:e.visible?`visible`:`hidden`,children:[(0,x.jsx)(`input`,{disabled:a,type:`file`,style:{display:`none`},ref:r,onChange:_,accept:`image/png, image/jpeg`,multiple:!1}),(0,x.jsx)(S.TemplateBackButton,{visible:e.onBack!=null,onClick:e.onBack}),(0,x.jsx)(k,{children:`ข้อมูลบัญชี`}),(0,x.jsxs)(D,{children:[A.length>0?(0,x.jsx)(`img`,{src:A}):(0,x.jsx)(v,{}),(0,x.jsx)(O,{children:(0,x.jsx)(`button`,{disabled:a,onClick:d,children:`เปลี่ยนรูป`})})]}),(0,x.jsxs)(j,{children:[(0,x.jsx)(`div`,{children:(0,x.jsx)(`label`,{children:`ชื่อผู้ใช้`})}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:M}),(0,x.jsx)(`button`,{disabled:a,onClick:y,children:`เปลี่ยนชื่อ`})]})]}),(0,x.jsxs)(j,{children:[(0,x.jsx)(`div`,{children:(0,x.jsx)(`label`,{children:`อีเมล`})}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:N}),(0,x.jsx)(`button`,{disabled:a,onClick:C,children:N.length>0?`เปลี่ยนอีเมล`:`เพิ่มอีเมล`})]})]}),(0,x.jsx)(j,{children:(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{disabled:a,onClick:w,children:`ลงชื่อออก`})})})]})},S.ContentSecurity=function(e){return(0,x.jsxs)(b.Activity,{mode:e.visible?`visible`:`hidden`,children:[(0,x.jsx)(S.TemplateBackButton,{visible:e.onBack!=null,onClick:e.onBack}),(0,x.jsx)(k,{children:`ความปลอดภัย`}),(0,x.jsxs)(j,{children:[(0,x.jsx)(`div`,{children:(0,x.jsx)(`label`,{children:`รหัสผ่าน`})}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:`เปลี่ยน`})})]}),(0,x.jsxs)(j,{children:[(0,x.jsx)(`div`,{children:(0,x.jsx)(`label`,{children:`ยืนยันสองชั้นด้วย รหัสผ่านใช้ครั้งเดียวแบบกำหนดเวลา`})}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:`เปิด`})})]}),(0,x.jsxs)(j,{children:[(0,x.jsx)(`div`,{children:(0,x.jsx)(`label`,{children:`ยืนยันสองชั้นด้วย อีเมล`})}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:`เปิด`})})]})]})},S.ContentShipping=function(e){let t=f().data,n=t?t.address:``,r=t?t.phone:``;return(0,x.jsxs)(b.Activity,{mode:e.visible?`visible`:`hidden`,children:[(0,x.jsx)(S.TemplateBackButton,{visible:e.onBack!=null,onClick:e.onBack}),(0,x.jsx)(k,{children:`การจัดส่ง`}),(0,x.jsx)(`p`,{style:{padding:`16px`,backgroundColor:`var(--bg-secondary)`,borderRadius:`4px`,marginBottom:`8px`},children:`ชุดข้อมูลนี้จะเป็นข้อมูลเริ่มต้นเมื่อคุณดำเนินการชำระเงิน`}),(0,x.jsxs)(j,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`ที่อยู่เริ่มต้น`}),(0,x.jsx)(`br`,{}),(0,x.jsx)(`label`,{children:n})]}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:n.length>0?`แก้ไข`:`เพิ่ม`})})]}),(0,x.jsxs)(j,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`ชื่อผู้รับ`}),(0,x.jsx)(`br`,{}),(0,x.jsx)(`label`,{children:``})]}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:`เพิ่ม`})})]}),(0,x.jsxs)(j,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`เบอร์โทรศัพท์`}),(0,x.jsx)(`br`,{}),(0,x.jsx)(`label`,{children:r})]}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:r.length>0?`แก้ไข`:`เพิ่ม`})})]})]})},S.ContentPayment=function(e){return(0,x.jsxs)(b.Activity,{mode:e.visible?`visible`:`hidden`,children:[(0,x.jsx)(S.TemplateBackButton,{visible:e.onBack!=null,onClick:e.onBack}),(0,x.jsx)(k,{children:`การชำระเงิน`}),(0,x.jsxs)(j,{children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{children:`วิธีเริ่มต้น`}),(0,x.jsx)(`br`,{}),(0,x.jsx)(`label`,{children:`0000-0000-0000-0000`})]}),(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:`เลือก`})})]}),(0,x.jsx)(A,{children:`รายการบันทึกที่อยู่`}),(0,x.jsx)(j,{children:(0,x.jsx)(`div`,{children:(0,x.jsx)(`button`,{children:`เพิ่ม`})})})]})},S.Provider=function(){let e=u(),t=b.useRef(void 0),[n,r]=b.useState(!1);return b.useEffect(()=>(e.setVisible=e=>{r(e)},e.setClose=e=>{t.current=e},()=>{e.setClose=()=>{},e.setVisible=()=>{}}),[]),(0,x.jsx)(E,{$visible:n,children:(0,x.jsx)(S.Root,{visible:n,transparent:!1,onClose:t.current})})},S.TemplateBackButton=function(e){return(0,x.jsxs)(M,{onClick:t=>{t.preventDefault(),t.stopPropagation(),e.onClick&&e.onClick()},$visible:e.visible??!1,children:[(0,x.jsx)(_,{}),`ย้อนกลับ`]})},S.CONTENT_UNDEFINED=0,S.CONTENT_GENERAL=1,S.CONTENT_SECURITY=2,S.CONTENT_SHIPPING=3,S.CONTENT_PAYMENT=4;var C=r.div`
  background-color: ${e=>e.$transparent?`transparent`:`var(--bg-primary)`};
  border-radius: 8px;
  width: ${e=>e.$width};
  height: ${e=>e.$height};
  max-width: ${e=>e.$widthMax};
  max-height: ${e=>e.$heightMax};
  
  padding: 16px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
`,w=r.button`
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
`,T=r.div`
  flex-grow: 1;
`,E=r.div`
  position: fixed;
  pointer-events: ${e=>e.$visible?`all`:`hidden`};
  inset: 0px;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  overscroll-behavior: none;
  padding: 16px;

  background-color: rgba(0,0,0,0.5);
  display: ${e=>e.$visible?`flex`:`none`};
  align-items: center;
  justify-content: center;
`,D=r.div`
  width: 100%;
  min-height: 160px;
  max-height: 160px;
  position: relative;

  background-color: var(--bg-secondary);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 8px;

  & > img,
  & > svg
  {
    display: block;
    min-width: 128px;
    min-height: 128px;
    max-width: 128px;
    max-height: 128px;
    border-radius: 100%;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
`,O=r.div`
  position: absolute;
  inset: 16px 16px 16px 192px;

  & > button
  {
    display: block;
    width: 128px;
    margin-bottom: 4px;
  }
`,k=r.h1`
  font-size: 2rem;
  font-weight: normal;
  margin: 0px 0px 16px 0px;
`,A=r.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 16px 0px 16px 0px;
`,j=r.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 48px;

  @media (max-width: 768px) 
  {
    min-height: 48px;
    height: auto;
  }

  & > div:nth-child(1)
  {
    width: 100%;
    flex-grow: 1;
    /* background-color: var(--bg-secondary); */
  }
  & > div:nth-child(2)
  {
    display: inline-flex;
    align-items: center;
    justify-content: end;
    width: 100%;
    max-width: 324px;
    gap: 16px;
  }
  & > div:nth-child(2) > button
  {
    width: 128px;
  }
`,M=r.button`
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
`;export{v as n,_ as r,S as t};