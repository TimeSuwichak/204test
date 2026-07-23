import{r as e,t}from"./react-C1VktWof.js";import{t as n}from"./index-V2cGtSIi.js";import{r}from"./styled-components.browser.esm-BhrFqjok.js";import{a as i}from"./common-CcV5LtAo.js";import{i as a,n as o}from"./api.account-3eivGuoB.js";var s=e(t(),1),c=n();function l(){let[e,t]=(0,s.useState)([]),[n,r]=(0,s.useState)(``),[o,l]=(0,s.useState)({}),[E,D]=(0,s.useState)(!0),[O,k]=(0,s.useState)(!1),[A,j]=(0,s.useState)(!1),[M,N]=(0,s.useState)([]),[P,F]=(0,s.useState)(0),I=i(),L=async()=>{try{D(!0);let e=I.session,n=await a.getBasicList(e);t(n);let r={};await Promise.all(n.map(async t=>{try{let n=await a.getStock(e,t.id);r[t.id]=n.quantity}catch{r[t.id]=0}})),l(r)}catch(e){console.error(`Failed to load products or stocks:`,e)}finally{D(!1)}};(0,s.useEffect)(()=>{L()},[]);let R=e=>{N(e?V.map(e=>e.id):[])},z=e=>{N(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])},B=async e=>{if(M.length===0){alert(`กรุณาเลือกอย่างน้อย 1 รายการ`);return}if(P<=0){alert(`ตัวเลขต้องมากกว่า 0`);return}let t=I.session;k(!0);try{await Promise.all(M.map(async n=>{let r=o[n]??0,i=e===`add`?P:-P,s=Math.max(0,r+i);await a.updateStock(t,{productId:n,quantity:s}),l(e=>({...e,[n]:s}))})),alert(`อัปเดตสต็อกเรียบร้อยแล้ว`),N([]),F(0)}catch(e){console.error(`Bulk update failed:`,e),alert(`เกิดข้อผิดพลาดในการอัปเดตบางรายการ`)}finally{k(!1)}},V=e.filter(e=>e.name.toLowerCase().includes(n.toLowerCase()));return(0,c.jsxs)(u,{children:[(0,c.jsxs)(d,{children:[(0,c.jsxs)(f,{children:[(0,c.jsx)(`h1`,{children:`Stock Section`}),(0,c.jsx)(p,{$active:A,onClick:()=>{j(!A),N([])},children:A?`Cancel Edit`:`Edit Stock`})]}),A&&(0,c.jsxs)(m,{children:[(0,c.jsxs)(h,{children:[`เลือกอยู่ `,(0,c.jsx)(`span`,{children:M.length}),` รายการ`]}),(0,c.jsxs)(g,{children:[(0,c.jsx)(`label`,{children:`จำนวนที่ต้องการปรับ:`}),(0,c.jsx)(_,{type:`number`,min:`1`,value:P||``,onChange:e=>F(Number(e.target.value)),placeholder:`ระบุตัวเลข...`})]}),(0,c.jsxs)(v,{children:[(0,c.jsx)(y,{$color:`#10b981`,disabled:O||M.length===0,onClick:()=>void B(`add`),children:`+ เพิ่มสต็อก`}),(0,c.jsx)(y,{$color:`#ef4444`,disabled:O||M.length===0,onClick:()=>void B(`subtract`),children:`- ลดสต็อก`})]})]}),(0,c.jsx)(b,{children:(0,c.jsxs)(x,{children:[(0,c.jsx)(`label`,{htmlFor:`search-input`,children:`Search Product :`}),(0,c.jsx)(S,{id:`search-input`,type:`text`,placeholder:`Search...`,value:n,onChange:e=>r(e.target.value)})]})})]}),(0,c.jsx)(C,{children:(0,c.jsxs)(w,{children:[(0,c.jsx)(`thead`,{children:(0,c.jsxs)(`tr`,{children:[A&&(0,c.jsx)(`th`,{style:{width:`40px`},children:(0,c.jsx)(`input`,{type:`checkbox`,checked:V.length>0&&M.length===V.length,onChange:e=>R(e.target.checked)})}),(0,c.jsx)(`th`,{children:`ID`}),(0,c.jsx)(`th`,{children:`Name`}),(0,c.jsx)(`th`,{children:`Platform`}),(0,c.jsx)(`th`,{children:`Stock`}),(0,c.jsx)(`th`,{children:`Price`})]})}),(0,c.jsx)(`tbody`,{children:E?(0,c.jsx)(`tr`,{children:(0,c.jsx)(`td`,{colSpan:A?6:5,style:{textAlign:`center`},children:`กำลังโหลดข้อมูล...`})}):V.length===0?(0,c.jsx)(`tr`,{children:(0,c.jsx)(`td`,{colSpan:A?6:5,style:{textAlign:`center`},children:`ไม่พบข้อมูลสินค้า`})}):V.map(e=>{let t=M.includes(e.id);return(0,c.jsxs)(`tr`,{className:t?`selected-row`:``,children:[A&&(0,c.jsx)(`td`,{children:(0,c.jsx)(`input`,{type:`checkbox`,checked:t,onChange:()=>z(e.id)})}),(0,c.jsx)(`td`,{children:e.id}),(0,c.jsx)(`td`,{children:e.name}),(0,c.jsx)(`td`,{children:e.platform}),(0,c.jsx)(`td`,{children:(o[e.id]??0)===0?(0,c.jsx)(T,{children:`Out of Stock`}):o[e.id]}),(0,c.jsx)(`td`,{children:e.price})]},e.id)})})]})})]})}var u=r.div`
  background: #0b1220;
  min-height: 100vh;
  padding: 28px;
  color: #fff;
`,d=r.div`
  margin-bottom: 24px;
`,f=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 2.3rem;
    font-weight: 800;
    color: white;
  }
`,p=r.button`
  padding: 10px 20px;
  background: ${e=>e.$active?`#ef4444`:`#3b82f6`};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`,m=r.div`
  margin-top: 16px;
  padding: 16px;
  background: #1e293b;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #334155;
  flex-wrap: wrap;
`,h=r.div`
  font-size: 14px;
  color: #94a3b8;

  span {
    color: #3b82f6;
    font-weight: bold;
    font-size: 16px;
  }
`,g=r.div`
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-size: 14px;
    color: #cbd5e1;
  }
`,_=r.input`
  width: 120px;
  padding: 8px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  color: white;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`,v=r.div`
  display: flex;
  gap: 10px;
`,y=r.button`
  padding: 8px 16px;
  background: ${e=>e.$color};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,b=r.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`,x=r.div`
  flex: 1;
`,S=r.input`
  width: 100%;
  padding: 14px 18px;
  background: #111827;
  color: white;
  border: 1px solid #334155;
  border-radius: 10px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }

  &::placeholder {
    color: #64748b;
  }
`,C=r.div`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 16px;
  overflow: hidden;
`,w=r.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #0f172a;
  }

  th {
    color: #94a3b8;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 18px;
    border-bottom: 1px solid #1e293b;
    text-align: left;
  }

  td {
    padding: 18px;
    color: white;
    border-bottom: 1px solid #1e293b;
    vertical-align: middle;
  }

  tbody tr:hover {
    background: #1e293b;
  }

  tbody tr.selected-row {
    background: rgba(59, 130, 246, 0.1);
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`,T=r.span`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: inline-block;
`;function E(){let[e,t]=(0,s.useState)([]),[n,r]=(0,s.useState)(!0),[l,u]=(0,s.useState)(null),[d,f]=(0,s.useState)(``),[p,m]=(0,s.useState)(`All`),[h,g]=(0,s.useState)(null),_=i(),v=e=>{switch(e){case 1:return`กำลังจัดส่ง`;case 2:return`ส่งแล้ว`;case 3:return`ล่าช้า`;case 0:return`ยกเลิก`;default:return`กำลังจัดส่ง`}},y=e=>{switch(e){case`กำลังจัดส่ง`:return 1;case`ส่งแล้ว`:return 2;case`ล่าช้า`:return 3;case`ยกเลิก`:return 0;default:return 1}},b=[`กำลังจัดส่ง`,`ส่งแล้ว`,`ล่าช้า`,`ยกเลิก`],x=[`All`,...b],S=async()=>{try{r(!0),u(null);let e=_.session,n=await o.getBasicList(e),i=await Promise.all(n.map(async t=>{let n=await Promise.all(t.item.map(async t=>{try{let n=await a.getBasic(e,t.productId);return{productId:t.productId,name:n.name,price:n.price,quantity:t.quantity}}catch{return{productId:t.productId,name:`สินค้า ID: ${t.productId}`,price:0,quantity:t.quantity}}}));return{id:t.orderId,orderDate:new Date(t.created),deliveryDate:t.delivered?new Date(t.delivered):null,status:t.status,items:n}}));t(i)}catch(e){console.error(`Failed to load orders:`,e),u(e.message||`เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ`)}finally{r(!1)}};(0,s.useEffect)(()=>{S()},[]);let C=e.find(e=>e.id===h)||null,w=e.filter(e=>{let t=v(e.status);return(`ORD${String(e.id).padStart(3,`0`)}`.toLowerCase().includes(d.toLowerCase())||e.items.some(e=>e.name.toLowerCase().includes(d.toLowerCase())))&&(p===`All`||t===p)}),T=e=>e.reduce((e,t)=>e+t.quantity,0),E=e=>e.reduce((e,t)=>e+t.price*t.quantity,0),q=async(e,n)=>{try{let r=_.session,i=y(n),a=i===2?new Date:null;await o.updateBasic(r,{orderId:e,status:i,delivered:a}),t(t=>t.map(t=>t.id===e?{...t,status:i,deliveryDate:a}:t))}catch(e){console.error(`Failed to update status:`,e),alert(e.message||`เกิดข้อผิดพลาดในการอัปเดตสถานะ`)}},J=e=>{switch(e){case`ส่งแล้ว`:return{bg:`#d4edda`,text:`#155724`};case`กำลังจัดส่ง`:return{bg:`#cce5ff`,text:`#004085`};case`ล่าช้า`:return{bg:`#fff3cd`,text:`#856404`};case`ยกเลิก`:return{bg:`#f8d7da`,text:`#721c24`};default:return{bg:`#e2e8f0`,text:`#334155`}}},Y=e=>{if(!e)return`-`;let t=new Date(e);return isNaN(t.getTime())?`-`:t.toISOString().split(`T`)[0]};return(0,c.jsxs)(D,{children:[(0,c.jsxs)(O,{children:[(0,c.jsx)(`h1`,{style:{color:`var(--text-primary, #ffffff)`},children:`Order Section`}),(0,c.jsxs)(k,{children:[(0,c.jsxs)(A,{children:[(0,c.jsx)(`label`,{htmlFor:`search-input`,children:`Search Order: `}),(0,c.jsx)(j,{id:`search-input`,type:`text`,placeholder:`ค้นหา ID หรือ ชื่อสินค้า...`,value:d,onChange:e=>f(e.target.value)})]}),(0,c.jsxs)(M,{children:[(0,c.jsx)(`label`,{htmlFor:`status-select`,children:`Filter by Status: `}),(0,c.jsx)(N,{id:`status-select`,value:p,onChange:e=>m(e.target.value),children:x.map(e=>(0,c.jsx)(`option`,{value:e,children:e},e))})]})]})]}),(0,c.jsx)(P,{children:(0,c.jsxs)(F,{children:[(0,c.jsx)(`thead`,{children:(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`Order ID`}),(0,c.jsx)(`th`,{children:`วันที่สั่ง`}),(0,c.jsx)(`th`,{children:`วันที่ส่งถึง`}),(0,c.jsx)(`th`,{style:{textAlign:`center`},children:`สถานะ`})]})}),(0,c.jsx)(`tbody`,{children:n?(0,c.jsx)(`tr`,{children:(0,c.jsx)(`td`,{colSpan:4,style:{textAlign:`center`,padding:`2rem`},children:`กำลังโหลดข้อมูลคำสั่งซื้อ...`})}):l?(0,c.jsx)(`tr`,{children:(0,c.jsx)(`td`,{colSpan:4,style:{textAlign:`center`,padding:`2rem`,color:`#ef4444`},children:l})}):w.length===0?(0,c.jsx)(`tr`,{children:(0,c.jsx)(`td`,{colSpan:4,style:{textAlign:`center`,padding:`2rem`},children:`ไม่พบข้อมูลคำสั่งซื้อในระบบ`})}):w.map(e=>{let t=v(e.status),n=J(t);return(0,c.jsxs)(`tr`,{onClick:()=>g(e.id),children:[(0,c.jsxs)(`td`,{children:[`ORD`,String(e.id).padStart(3,`0`)]}),(0,c.jsx)(`td`,{children:Y(e.orderDate)}),(0,c.jsx)(`td`,{children:Y(e.deliveryDate)}),(0,c.jsx)(`td`,{style:{textAlign:`center`},children:(0,c.jsx)(I,{bg:n.bg,color:n.text,children:t})})]},e.id)})})]})}),C&&(0,c.jsx)(L,{onClick:()=>g(null),children:(0,c.jsxs)(R,{onClick:e=>e.stopPropagation(),children:[(0,c.jsxs)(z,{children:[(0,c.jsxs)(`h2`,{children:[`Order Details (ORD`,String(C.id).padStart(3,`0`),`)`]}),(0,c.jsx)(B,{onClick:()=>g(null),children:`×`})]}),(0,c.jsxs)(V,{children:[(0,c.jsxs)(H,{children:[(0,c.jsx)(`span`,{className:`label`,children:`Order ID:`}),(0,c.jsx)(`span`,{className:`value`,children:(0,c.jsxs)(`strong`,{children:[`ORD`,String(C.id).padStart(3,`0`)]})})]}),(0,c.jsxs)(H,{children:[(0,c.jsx)(`span`,{className:`label`,children:`จำนวนสินค้าทั้งหมด:`}),(0,c.jsxs)(`span`,{className:`value`,children:[T(C.items),` ชิ้น`]})]}),(0,c.jsxs)(U,{children:[(0,c.jsx)(`div`,{className:`list-title`,children:`List สินค้าและราคา:`}),C.items.map((e,t)=>(0,c.jsxs)(W,{children:[(0,c.jsxs)(`span`,{className:`p-name`,children:[e.name,` (x`,e.quantity,`)`]}),(0,c.jsxs)(`span`,{className:`p-price`,children:[`฿`,(e.price*e.quantity).toLocaleString()]})]},e.productId||t))]}),(0,c.jsxs)(H,{className:`highlight-row`,children:[(0,c.jsx)(`span`,{className:`label`,children:`ราคารวม:`}),(0,c.jsxs)(`span`,{className:`value total-price`,children:[`฿`,E(C.items).toLocaleString()]})]}),(0,c.jsxs)(H,{children:[(0,c.jsx)(`span`,{className:`label`,children:`วันที่สั่ง:`}),(0,c.jsx)(`span`,{className:`value`,children:Y(C.orderDate)})]}),(0,c.jsxs)(H,{children:[(0,c.jsx)(`span`,{className:`label`,children:`วันที่ส่งถึง:`}),(0,c.jsx)(`span`,{className:`value`,children:Y(C.deliveryDate)})]}),(0,c.jsxs)(G,{children:[(0,c.jsx)(`span`,{className:`label`,children:`สถานะ (กดเพื่อแก้ไข):`}),(0,c.jsx)(`select`,{value:v(C.status),onChange:e=>q(C.id,e.target.value),style:{backgroundColor:J(v(C.status)).bg,color:J(v(C.status)).text},children:b.map(e=>(0,c.jsx)(`option`,{value:e,children:e},e))})]})]}),(0,c.jsx)(K,{onClick:()=>g(null),children:`ปิดหน้าต่าง`})]})})]})}var D=r.div`
  background: #0b1220;
  min-height: 100vh;
  padding: 28px;
  color: #fff;
`,O=r.div`
  margin-bottom: 24px;
`,k=r.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`,A=r.div`
  flex: 1;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #cbd5e1;
  }
`,j=r.input`
  width: 100%;
  padding: 14px 18px;
  background: #111827;
  color: white;
  border: 1px solid #334155;
  border-radius: 10px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }

  &::placeholder {
    color: #64748b;
  }
`,M=r.div`
  width: 240px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #cbd5e1;
  }
`,N=r.select`
  width: 100%;
  padding: 14px 18px;
  background: #111827;
  color: white;
  border: 1px solid #334155;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }

  option {
    background: #111827;
    color: white;
  }
`,P=r.div`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 16px;
  overflow: hidden;
`,F=r.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #0f172a;
  }

  th {
    color: #94a3b8;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 18px;
    border-bottom: 1px solid #1e293b;
    text-align: left;
  }

  td {
    padding: 18px;
    color: white;
    border-bottom: 1px solid #1e293b;
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.2s ease;
    cursor: pointer;
  }

  tbody tr:hover {
    background: #1e293b;
  }
`,I=r.span`
  background: ${e=>e.bg};
  color: ${e=>e.color};
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
`,L=r.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`,R=r.div`
  width: 100%;
  max-width: 560px;
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      transform: translateY(-12px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`,z=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #334155;

  h2 {
    margin: 0;
    font-size: 22px;
    color: white;
  }
`,B=r.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 28px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: white;
  }
`,V=r.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`,H=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    color: #94a3b8;
    font-size: 14px;
  }

  .value {
    color: white;
    font-weight: 600;
  }

  .total-price {
    color: #3b82f6;
    font-size: 18px;
    font-weight: 700;
  }

  &.highlight-row {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 12px 14px;
  }
`,U=r.div`
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .list-title {
    color: white;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
  }
`,W=r.div`
  display: flex;
  justify-content: space-between;

  .p-name {
    color: #e2e8f0;
  }

  .p-price {
    color: white;
    font-weight: 600;
  }
`,G=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;

  .label {
    color: #94a3b8;
    font-size: 14px;
  }

  select {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    outline: none;
  }
`,K=r.button`
  width: 100%;
  margin-top: 24px;
  padding: 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;export{l as n,E as t};