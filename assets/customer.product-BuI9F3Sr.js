import{r as e,t}from"./react-C1VktWof.js";import{n,t as r}from"./index-V2cGtSIi.js";import{r as i}from"./styled-components.browser.esm-BhrFqjok.js";import{t as a}from"./createLucideIcon-AHYuUPOs.js";import{t as o}from"./shopping-basket-C4Thn0t1.js";import{t as s}from"./shopping-cart-B0OfAdL7.js";import{d as c,g as l}from"./common.ui-Ca9FJCyu.js";import{t as u}from"./menu.bar-BrleDA_T.js";import{a as d,c as f,d as p,l as m,m as h,o as g,r as _,s as v}from"./customer-DD1YOHcU.js";import{a as ee}from"./common-CcV5LtAo.js";import{t as te}from"./api.account-3eivGuoB.js";var ne=a(`heart`,[[`path`,{d:`M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`,key:`mvr1a0`}]]),y=a(`message-square`,[[`path`,{d:`M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z`,key:`18887p`}]]),b=a(`monitor-cog`,[[`path`,{d:`M12 17v4`,key:`1riwvh`}],[`path`,{d:`m14.305 7.53.923-.382`,key:`1mlnsw`}],[`path`,{d:`m15.228 4.852-.923-.383`,key:`82mpwg`}],[`path`,{d:`m16.852 3.228-.383-.924`,key:`ln4sir`}],[`path`,{d:`m16.852 8.772-.383.923`,key:`1dejw0`}],[`path`,{d:`m19.148 3.228.383-.924`,key:`192kgf`}],[`path`,{d:`m19.53 9.696-.382-.924`,key:`fiavlr`}],[`path`,{d:`m20.772 4.852.924-.383`,key:`1j8mgp`}],[`path`,{d:`m20.772 7.148.924.383`,key:`zix9be`}],[`path`,{d:`M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7`,key:`1tnzv8`}],[`path`,{d:`M8 21h8`,key:`1ev6f3`}],[`circle`,{cx:`18`,cy:`6`,r:`3`,key:`1h7g24`}]]),x=a(`share-2`,[[`circle`,{cx:`18`,cy:`5`,r:`3`,key:`gq8acd`}],[`circle`,{cx:`6`,cy:`12`,r:`3`,key:`w7nqdw`}],[`circle`,{cx:`18`,cy:`19`,r:`3`,key:`1xt0gg`}],[`line`,{x1:`8.59`,x2:`15.42`,y1:`13.51`,y2:`17.49`,key:`47mynk`}],[`line`,{x1:`15.41`,x2:`8.59`,y1:`6.51`,y2:`10.49`,key:`1n3mei`}]]),S=a(`star`,[[`path`,{d:`M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z`,key:`r04s7s`}]]),C=a(`text-align-start`,[[`path`,{d:`M21 5H3`,key:`1fi0y6`}],[`path`,{d:`M15 12H3`,key:`6jk70r`}],[`path`,{d:`M17 19H3`,key:`z6ezky`}]]),w=e(t(),1),T=r(),E=function(){let[e]=n(),t=e.get(`id`),r=v(Number(t)).data,i=r?h.getUrlStream(r.background):void 0;return(0,T.jsx)(T.Fragment,{children:(0,T.jsxs)(D,{children:[(0,T.jsx)(O,{src:i,$visible:i!=null&&i.length>0}),(0,T.jsx)(E.Main,{}),(0,T.jsx)(E.Comment,{}),(0,T.jsx)(E.Cart,{})]})})};E.Cart=function(){let e=d(),t=g(),n=_(),r=t=>{t.preventDefault(),t.stopPropagation(),e.setVisible(!0),e.setClose(()=>{e.setVisible(!1)})},i=t.data,a=i?i.reduce((e,t)=>e+=t.quantity,0):0;return(0,T.jsxs)(re,{onClick:r,$visible:n.data!==void 0,children:[(0,T.jsx)(ie,{children:a}),(0,T.jsx)(o,{})]})},E.Main=function(){let[e]=n(),t=e.get(`id`),r=ee(),i=l(),a=v(Number(t)),o=p(Number(t)),d=_(),f=a.data,m=o.data,[g,y]=(0,w.useState)(1),[S]=c(),E=e=>{if(e.preventDefault(),e.stopPropagation(),d.data!==void 0){let e=a.data,t=e?e.id:NaN;te.createCart(r.session,{productId:t,quantity:1}).then(()=>{i.setDuration(5e3),i.setText(`เพิ่ม ${f?f.name:``} ลงในตะกร้าเรียบร้อย`),i.setVisible(!0)}).catch(()=>{i.setDuration(5e3),i.setText(`เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง`),i.setVisible(!0)})}else i.setDuration(5e3),i.setText(`คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถเพิ่มสินค้าได้`),i.setVisible(!0)},D=e=>{e.preventDefault(),e.stopPropagation(),d.data===void 0&&(i.setDuration(5e3),i.setText(`คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถเพิ่มรายการโปรดได้`),i.setVisible(!0))},O=e=>{e.preventDefault(),e.stopPropagation(),navigator.clipboard.writeText(window.location.href).then(()=>{i.setDuration(5e3),i.setText(`คัดลอกลิงค์แชร์เรียบร้อย`),i.setVisible(!0)}).catch(()=>{S.reset(),S.setTitle(`คัดลอกลิงค์แชร์ผิดพลาด`),S.setMessage(`เกิดข้อผิดพลาดบางอย่าง โปรดทำการลองใหม่อีกครั้ง`),S.setPrimary(`เข้าใจแล้ว`,()=>{S.setVisible(!1)}),S.setVisible(!0)})},B=f?f.name:``,V=f?f.description:``,H=f?f.price.toFixed(2):``,U=f?h.getUrlStream(f.cover):void 0;return(0,T.jsxs)(k,{children:[(0,T.jsx)(A,{src:U}),(0,T.jsxs)(j,{children:[(0,T.jsxs)(`header`,{children:[(0,T.jsx)(M,{children:B}),(0,T.jsx)(N,{children:``})]}),(0,T.jsxs)(`main`,{children:[(0,T.jsxs)(u,{direction:`row`,selected:g,margin:`0px 0px 16px 0px`,onClick:e=>{y(e)},children:[(0,T.jsx)(u.Item,{icon:(0,T.jsx)(C,{}),width:`192px`,text:`รายละเอียด`,value:1}),(0,T.jsx)(u.Item,{icon:(0,T.jsx)(b,{}),width:`192px`,text:`ข้อมูลจำเพาะ`,value:2})]}),g===1?(0,T.jsx)(P,{children:V}):(0,T.jsx)(T.Fragment,{}),g===2?(0,T.jsxs)(X,{children:[(0,T.jsxs)(Z,{children:[(0,T.jsx)(Q,{children:`ผู้ผลิต`}),(0,T.jsx)($,{children:`—`})]}),(0,T.jsxs)(Z,{children:[(0,T.jsx)(Q,{children:`แพลตฟอร์ม`}),(0,T.jsx)($,{children:`PlayStation 5`})]}),(0,T.jsxs)(Z,{children:[(0,T.jsx)(Q,{children:`ประเภท`}),(0,T.jsx)($,{children:`Action`})]}),(0,T.jsxs)(Z,{children:[(0,T.jsx)(Q,{children:`ภาษา`}),(0,T.jsx)($,{children:`ไทย / อังกฤษ`})]}),(0,T.jsxs)(Z,{children:[(0,T.jsx)(Q,{children:`ปีที่ออก`}),(0,T.jsx)($,{children:`2024`})]})]}):(0,T.jsx)(T.Fragment,{}),g===3?(0,T.jsx)(P,{children:`จัดส่งทั่วประเทศไทยผ่าน Kerry / Flash ภายใน 1-3 วันทำการ สั่งซื้อครบ 1,500 ฿ ขึ้นไป จัดส่งฟรี สามารถรับสินค้าที่หน้าร้านได้เช่นกัน`}):(0,T.jsx)(T.Fragment,{}),(0,T.jsx)(F,{children:m?m.map(e=>{if(e.mime===`text/html`)return(0,T.jsx)(`iframe`,{src:e.link,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share`,referrerPolicy:`strict-origin-when-cross-origin`,allowFullScreen:!0,style:{aspectRatio:`16 / 9 `}},e.reviewId);if(e.mime===`image/jpeg`||e.mime===`image/png`)return(0,T.jsx)(`img`,{src:e.link,style:{aspectRatio:`16 / 9 `}},e.reviewId)}):(0,T.jsx)(T.Fragment,{})}),(0,T.jsxs)(I,{children:[(0,T.jsxs)(L,{children:[(0,T.jsx)(R,{children:`99%`}),(0,T.jsxs)(`span`,{children:[H,` ฿`]})]}),(0,T.jsxs)(z,{children:[(0,T.jsxs)(`button`,{onClick:E,children:[(0,T.jsx)(s,{}),(0,T.jsx)(`span`,{children:`เพิ่มลงในตะกร้า`})]}),(0,T.jsxs)(`button`,{onClick:D,children:[(0,T.jsx)(ne,{}),(0,T.jsx)(`span`,{children:`เพิ่มรายการโปรด`})]}),(0,T.jsxs)(`button`,{onClick:O,children:[(0,T.jsx)(x,{}),(0,T.jsx)(`span`,{children:`แชร์`})]})]})]})]})]})]})},E.Comment=function(){let[e]=n(),t=e.get(`id`),r=m(Number(t)),i=_(),a=r.data,o=l(),s=(a&&a.length>0?a.reduce((e,t)=>e+=t.rating,0)/a.length:0).toFixed(1),c=a?a.length:0,u=a?a.length===0:!0;return(0,T.jsxs)(B,{children:[(0,T.jsx)(V,{children:`ความคิดเห็น`}),(0,T.jsxs)(H,{children:[(0,T.jsxs)(W,{children:[(0,T.jsx)(S,{}),(0,T.jsx)(S,{}),(0,T.jsx)(S,{}),(0,T.jsx)(S,{}),(0,T.jsx)(S,{})]}),(0,T.jsxs)(`p`,{children:[s,` / 5.0 จากทั้งหมด `,c,` คน`]}),(0,T.jsxs)(G,{onClick:e=>{e.preventDefault(),e.stopPropagation(),i.data===void 0&&(o.setDuration(5e3),o.setText(`คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถแสดงความคิดเห็นได้`),o.setVisible(!0))},children:[(0,T.jsx)(y,{size:24}),(0,T.jsx)(`span`,{children:`ให้คะแนนเลย`})]})]}),(0,T.jsxs)(U,{children:[u?(0,T.jsx)(`p`,{children:`สินค้ายังไม่ใครรีวิวเลย เป็นคนแรกที่รีวิวเลย`}):(0,T.jsx)(T.Fragment,{}),a?a.map(e=>(0,T.jsx)(E.CommentItem,{id:e.commentId},e.commentId)):(0,T.jsx)(T.Fragment,{})]})]})},E.CommentItem=function({id:e}){let t=f(e),n=_(),r=t.data,i=n.data,a=i?i.icon:``,o=i?i.name:``,s=r?r.text:``;return(0,T.jsxs)(K,{children:[(0,T.jsx)(q,{src:h.getUrlStream(a)}),(0,T.jsx)(J,{children:o}),(0,T.jsx)(Y,{children:s})]})};var D=i.div`
  margin: 96px 0px 64px 0px;
  display: block;
`,O=i.img`
  display: ${e=>e.$visible?`block`:`none`};
  position: fixed;
  inset: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  z-index: -1;
`,k=i.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 64px;
  position: relative;

  @media (max-width: 960px)
  {
    height: 100%;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
`,A=i.img`
  display: block;
  width: 550px;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 3 / 4;

  @media (max-width: 1268px)
  {
    width: 412px;
    height: 75%;
  }
  @media (max-width: 1024px)
  {
    width: 275px;
    height: 50%;
  }
`,j=i.div`
  display: block;
  width: 40%;
  height: 100%;

  @media (max-width: 960px)
  {
    width: 100%;
    padding: 0px 96px;
  }
  @media (max-width: 768px)
  {
    width: 100%;
    padding: 0px 64px;
  }
  @media (max-width: 680px)
  {
    width: 100%;
    padding: 0px 16px;
  }
`,M=i.h1`
  font-size: 2.5rem;
  font-weight: normal;
`,N=i.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 32px;
`,P=i.p`
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 32px;
  min-height: 256px;
`,F=i.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  max-height: 256px;
  margin-bottom: 32px;
  overflow: hidden;
  gap: 8px;

  & > iframe
  {
    min-width: 384px;
    min-height: 256px;
    max-width: 384px;
    max-height: 256px;
  }

  @media (max-width: 768px)
  {
    flex-direction: column;

    & > iframe
    {
      min-width: 100%;
      min-height: 324px;
      max-width: 100%;
      max-height: 324px;
    }
  }
`,I=i.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  min-height: 40px;
  align-items: center;
  gap: 48px;

  @media (max-width: 1024px)
  {
    flex-direction: column;
  }
`,L=i.label`
  display: block;
  position: relative;
  font-size: 1.5rem;
  width: 128px;
`,R=i.label`
  font-size: 1.25rem;
  position: absolute;
  inset: auto 16px -32px auto;
  background-color: #FF7373;
  border-radius: 16px;
  padding: 0px 16px;
`,z=i.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;

  width: 100%;
  height: 40px;

    & > button
  {
    display: inline-block;
    min-width: 192px;
    min-height: 40px;
  }
  & > button > img,
  & > button > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
`,B=i.div`
  width: 100%;
  min-height: 256px;
  padding: 32px 580px;

  @media (max-width: 1600px)
  {
    padding: 32px 512px;
  }
  @media (max-width: 1440px)
  {
    padding: 32px 384px;
  }
  @media (max-width: 1280px)
  {
    padding: 32px 256px;
  }
  @media (max-width: 1024px)
  {
    padding: 32px 128px;
  }
  @media (max-width: 860px)
  {
    padding: 32px 64px;
  }
  @media (max-width: 680px)
  {
    padding: 32px 16px;
  }
`,V=i.label`
  display: block;
  font-size: 2rem;
  font-weight: normal;
  color: var(--text-primary);
`,H=i.div`
  width: 100%;
  height: 256px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
`,U=i.div`
  margin: 8px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;
`,W=i.div`
  display: inline-block;
  color: var(--text-primary);
  margin: 4px 0px;

  & > img, & > svg
  {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin: 0px 8px;
  }
`,G=i.button`
  & > img, & > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
`,K=i.div`
  width: 100%;
  height: 100%;
  min-height: 64px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  position: relative;
`,q=i.img`
  display: block;
  position: absolute;
  background-color: var(--bg-secondary);
  border-radius: 100%;
  inset: 16px auto auto 16px;
  width: 32px;
  height: 32px;
`,J=i.label`
  display: block;
  position: absolute;
  inset: 20px auto auto 64px;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  font-weight: normal
`,Y=i.p`
  padding: 48px 0px 16px 64px;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  font-weight: normal
`,X=i.dl`
    margin: 0;
    display: grid;
    grid-template-columns: 180px 1fr;
    row-gap: 0;
    min-height: 256px;
    margin-bottom: 32px;
    color: var(--text-primary);
`,Z=i.div`
    display: contents;
    & > * { padding: 12px 0; border-bottom: 1px solid var(--bg-hairline); }
`,Q=i.dt`
    color: var(--text-muted);
    font-size: 1rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
`,$=i.dd`
    margin: 0;
    color: #fff;
    font-size: 0.92rem;
`,re=i.button`
  display: ${e=>e.$visible?`block`:`none`};
  position: fixed;
  inset: auto 64px 64px auto;
  width: 64px;
  height: 64px;
  padding: 0px;
  margin: 0px;
  border-radius: 100%;

  & > img,
  & > svg
  {
    display: inline-block;
    min-width: 32px;
    min-height: 32px;
    vertical-align: middle;
  }
  @media (max-width: 1024px)
  {
    bottom: 24px;
    right: 32px;
  }
`,ie=i.label`
  position: absolute;
  inset: auto -16px 0px auto;
  font-size: 1rem;

  min-width: 24px;
  min-height: 24px;
  padding: 0px 4px;
  text-align: center;

  background-color: #FF7373;
  border-radius: 4px;
`;export{E as default};