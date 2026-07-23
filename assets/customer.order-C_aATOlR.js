import{r as e,t}from"./react-C1VktWof.js";import{t as n}from"./index-V2cGtSIi.js";import{r}from"./styled-components.browser.esm-BhrFqjok.js";import{t as i}from"./createLucideIcon-AHYuUPOs.js";import{n as a,r as o,t as s}from"./clock-BXsh-8bI.js";import{t as c}from"./truck-b_tbH1bG.js";import{a as l}from"./common-CcV5LtAo.js";import{i as u,n as d}from"./api.account-3eivGuoB.js";var f=i(`box`,[[`path`,{d:`M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z`,key:`hh9hay`}],[`path`,{d:`m3.3 7 8.7 5 8.7-5`,key:`g66t2b`}],[`path`,{d:`M12 22V12`,key:`d0xqtd`}]]),p=i(`chevron-down`,[[`path`,{d:`m6 9 6 6 6-6`,key:`qrunsl`}]]),m=i(`chevron-up`,[[`path`,{d:`m18 15-6-6-6 6`,key:`153udz`}]]),h=i(`hash`,[[`line`,{x1:`4`,x2:`20`,y1:`9`,y2:`9`,key:`4lhtct`}],[`line`,{x1:`4`,x2:`20`,y1:`15`,y2:`15`,key:`vyu0kd`}],[`line`,{x1:`10`,x2:`8`,y1:`3`,y2:`21`,key:`1ggp8o`}],[`line`,{x1:`16`,x2:`14`,y1:`3`,y2:`21`,key:`weycgp`}]]),g=i(`history`,[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`1357e3`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}],[`path`,{d:`M12 7v5l4 2`,key:`1fdv2h`}]]),_=i(`loader-circle`,[[`path`,{d:`M21 12a9 9 0 1 1-6.219-8.56`,key:`13zald`}]]),v=i(`package-x`,[[`path`,{d:`M12 22V12`,key:`d0xqtd`}],[`path`,{d:`m16.5 14.5 5 5`,key:`ozpm51`}],[`path`,{d:`m16.5 19.5 5-5`,key:`syf6b9`}],[`path`,{d:`M21 10.5V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.13-.074`,key:`isw6gs`}],[`path`,{d:`M3.29 7 12 12l8.71-5`,key:`19ckod`}],[`path`,{d:`m7.5 4.27 8.997 5.148`,key:`9yrvtv`}]]),y=e(t(),1),b=n(),x=e=>new Intl.NumberFormat(`th-TH`,{style:`currency`,currency:`THB`,minimumFractionDigits:2}).format(e),S=e=>{if(!e)return`อยู่ระหว่างจัดเตรียม`;let t=new Date(e);return isNaN(t.getTime())?`อยู่ระหว่างจัดเตรียม`:t.toLocaleDateString(`th-TH`,{day:`2-digit`,month:`short`,year:`numeric`})},C=e=>{switch(e){case 1:return{label:`กำลังจัดส่ง`,icon:(0,b.jsx)(c,{size:13}),bg:`#cce5ff`,text:`#004085`};case 2:return{label:`จัดส่งสำเร็จแล้ว`,icon:(0,b.jsx)(a,{size:13}),bg:`#d4edda`,text:`#155724`};case 3:return{label:`ล่าช้า`,icon:(0,b.jsx)(o,{size:13}),bg:`#fff3cd`,text:`#856404`};case 0:case 4:return{label:`ยกเลิกแล้ว`,icon:(0,b.jsx)(v,{size:13}),bg:`#f8d7da`,text:`#721c24`};default:return{label:`รอดำเนินการ`,icon:(0,b.jsx)(s,{size:13}),bg:`#e2e8f0`,text:`#334155`}}},w=({order:e})=>{let[t,n]=(0,y.useState)(!1),r=e.items.length>1,i=C(e.status),a=(0,y.useMemo)(()=>e.items.reduce((e,t)=>e+t.price*t.quantity,0),[e.items]),o=(0,y.useMemo)(()=>{if(e.items.length===0)return`ไม่มีรายการสินค้า`;let t=e.items[0].name;return r?`${t} และอีก ${String(e.items.length-1)} รายการ`:t},[e.items,r]);return(0,b.jsx)(L,{children:(0,b.jsxs)(R,{children:[(0,b.jsxs)(z,{children:[(0,b.jsxs)(B,{children:[(0,b.jsx)(h,{size:14}),(0,b.jsxs)(`span`,{children:[`ORD`,String(e.id).padStart(3,`0`)]})]}),(0,b.jsxs)(V,{$bg:i.bg,$color:i.text,children:[i.icon,(0,b.jsx)(`span`,{children:i.label})]})]}),(0,b.jsxs)(H,{onClick:()=>r&&n(e=>!e),$isClickable:r,children:[(0,b.jsx)(U,{children:o}),r&&(0,b.jsxs)(W,{type:`button`,children:[(0,b.jsx)(`span`,{children:t?`ซ่อนรายละเอียด`:`ดูรายการทั้งหมด`}),t?(0,b.jsx)(m,{size:16}):(0,b.jsx)(p,{size:16})]})]}),(t||!r)&&e.items.length>0&&(0,b.jsx)(G,{children:e.items.map((e,t)=>(0,b.jsxs)(K,{children:[(0,b.jsxs)(`span`,{className:`p-name`,children:[e.name,` `,(0,b.jsxs)(q,{children:[`x`,e.quantity]})]}),(0,b.jsx)(`span`,{className:`p-price`,children:x(e.price*e.quantity)})]},e.productId||t))}),(0,b.jsxs)(J,{children:[(0,b.jsxs)(Y,{children:[(0,b.jsx)(c,{size:14}),(0,b.jsxs)(`span`,{children:[`วันจัดส่ง: `,(0,b.jsx)(`strong`,{children:S(e.deliveryDate)})]})]}),(0,b.jsxs)(X,{children:[(0,b.jsx)(Z,{children:`ยอดรวมสุทธิ`}),(0,b.jsx)(Q,{children:x(a)})]})]})]})})};function T(){let[e,t]=(0,y.useState)([]),[n,r]=(0,y.useState)(!0),[i,a]=(0,y.useState)(null),c=l();(0,y.useEffect)(()=>{(async()=>{try{r(!0),a(null);let e=c.session,[n,i]=await Promise.all([d.getBasicList(e).catch(e=>(console.error(`Order API Error:`,e),[])),u.getBasicList(e).catch(e=>(console.error(`Product API Error:`,e),[]))]),o=new Map;Array.isArray(i)&&i.forEach(e=>o.set(e.id,e));let s=(n||[]).map(e=>{let t=(e.item||[]).map(e=>{let t=o.get(e.productId);return{productId:e.productId,name:t?t.name:`สินค้า ID: ${e.productId}`,price:t?t.price:0,quantity:e.quantity}});return{id:e.orderId,orderDate:new Date(e.created),deliveryDate:e.delivered?new Date(e.delivered):null,status:e.status,items:t}});t(s)}catch(e){console.error(`Failed to load orders:`,e),a(e?.message||`เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ`)}finally{r(!1)}})()},[c.session]);let{activeOrders:p,pastOrders:m}=(0,y.useMemo)(()=>({activeOrders:e.filter(e=>e.status===1||e.status===3),pastOrders:e.filter(e=>e.status===2||e.status===0||e.status===4)}),[e]);return n?(0,b.jsx)(E,{children:(0,b.jsxs)(I,{children:[(0,b.jsx)(_,{className:`spin`,size:36}),(0,b.jsx)(`p`,{children:`กำลังโหลดข้อมูลคำสั่งซื้อ...`})]})}):i?(0,b.jsx)(E,{children:(0,b.jsxs)(F,{style:{color:`#ef4444`},children:[(0,b.jsx)(o,{size:32}),(0,b.jsx)(`p`,{children:i})]})}):(0,b.jsx)(E,{children:(0,b.jsx)(D,{children:(0,b.jsx)(O,{children:(0,b.jsxs)(k,{children:[(0,b.jsxs)(A,{children:[(0,b.jsx)(j,{children:`ประวัติคำสั่งซื้อ`}),(0,b.jsx)(M,{children:`ติดตามสถานะคำสั่งซื้อและเรียกดูประวัติการสั่งซื้อของคุณ`})]}),(0,b.jsxs)(N,{children:[(0,b.jsx)(f,{size:20}),(0,b.jsxs)(`span`,{children:[`กำลังดำเนินการ (`,p.length,`)`]})]}),(0,b.jsx)(P,{children:p.length===0?(0,b.jsxs)(F,{children:[(0,b.jsx)(s,{size:32,color:`#64748b`}),(0,b.jsx)(`p`,{children:`ไม่มีคำสั่งซื้อที่อยู่ระหว่างดำเนินการ`})]}):p.map(e=>(0,b.jsx)(w,{order:e},e.id))}),(0,b.jsxs)(N,{children:[(0,b.jsx)(g,{size:20}),(0,b.jsxs)(`span`,{children:[`ประวัติย้อนหลัง (`,m.length,`)`]})]}),(0,b.jsx)(P,{children:m.length===0?(0,b.jsxs)(F,{children:[(0,b.jsx)(v,{size:32,color:`#64748b`}),(0,b.jsx)(`p`,{children:`ไม่มีประวัติคำสั่งซื้อย้อนหลัง`})]}):m.map(e=>(0,b.jsx)(w,{order:e},e.id))})]})})})})}var E=r.div`
  background: #0b1220;
  min-height: 100vh;
  padding: 24px 0 64px 0;
  color: #ffffff;
  margin-top: 48px;
`,D=r.div`
  width: 100%;
`,O=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`,k=r.div`
  max-width: 720px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`,A=r.div`
  margin-bottom: 28px;
`,j=r.h1`
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #ffffff;
`,M=r.p`
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
`,N=r.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 32px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #38bdf8;
`,P=r.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,F=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #111827;
  border: 1px dashed #334155;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 0.95rem;
  gap: 10px;

  p {
    margin: 0;
  }
`,I=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #38bdf8;
  gap: 16px;

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  p {
    color: #94a3b8;
    margin: 0;
  }
`,L=r.div`
  background: #111827;
  border-radius: 16px;
  border: 1px solid #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #334155;
  }
`,R=r.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`,z=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`,B=r.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-family: monospace;
  font-weight: 600;
  color: #94a3b8;
`,V=r.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${e=>e.$bg};
  color: ${e=>e.$color};
`,H=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${e=>e.$isClickable?`pointer`:`default`};
  user-select: none;
`,U=r.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
`,W=r.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #38bdf8;
  font-size: 0.85rem;
  font-weight: 600;
`,G=r.div`
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`,K=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;

  .p-name {
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .p-price {
    color: #ffffff;
    font-weight: 600;
  }
`,q=r.span`
  font-size: 0.75rem;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
`,J=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px dashed #334155;
`,Y=r.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.825rem;
  color: #94a3b8;

  strong {
    color: #f8fafc;
  }
`,X=r.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`,Z=r.span`
  font-size: 0.8rem;
  color: #94a3b8;
`,Q=r.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: #3b82f6;
`;export{T as default};