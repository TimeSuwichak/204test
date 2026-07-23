import{r as e,t}from"./react-C1VktWof.js";import{n,t as r}from"./index-V2cGtSIi.js";import{n as i,r as a}from"./styled-components.browser.esm-BhrFqjok.js";import{t as o}from"./createLucideIcon-AHYuUPOs.js";import{t as s}from"./shopping-basket-C4Thn0t1.js";import{t as c}from"./shopping-cart-B0OfAdL7.js";import{a as l,m as u,o as d,r as f,u as ee}from"./customer-DD1YOHcU.js";import{t as te}from"./common.navigation-CVoe_2SQ.js";var p=o(`refresh-cw-off`,[[`path`,{d:`M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47`,key:`1krf6h`}],[`path`,{d:`M8 16H3v5`,key:`1cv678`}],[`path`,{d:`M3 12C3 9.51 4 7.26 5.64 5.64`,key:`ruvoct`}],[`path`,{d:`m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64`,key:`19q130`}],[`path`,{d:`M21 12c0 1-.16 1.97-.47 2.87`,key:`4w8emr`}],[`path`,{d:`M21 3v5h-5`,key:`1q7to0`}],[`path`,{d:`M22 22 2 2`,key:`1r8tn9`}]]),m=e(t(),1),h=r(),g=[{key:`ps5`,label:`PlayStation 5`},{key:`ps4`,label:`PlayStation 4`},{key:`xbox-xs`,label:`Xbox Series X|S`},{key:`xbox-one`,label:`Xbox One`},{key:`switch`,label:`Nintendo Switch`},{key:`pc`,label:`PC`}],_=[{key:`action`,label:`Action`},{key:`adventure`,label:`Adventure`},{key:`rpg`,label:`RPG`},{key:`sports`,label:`Sports`},{key:`racing`,label:`Racing`},{key:`simulation`,label:`Simulation`},{key:`strategy`,label:`Strategy`},{key:`fighting`,label:`Fighting`},{key:`horror`,label:`Horror`}],v={platforms:[],gameTypes:[],price:{min:0,max:5e3}},y=function(e){let[t,n]=m.useState({...v,...e.value});function r(t){n(t),e.onChange&&e.onChange(t)}function i(e,n){let i=t[e],a=i.includes(n)?i.filter(e=>e!==n):[...i,n];r({...t,[e]:a})}function a(e,n){let i=Math.max(0,Number(n.replace(/[^0-9]/g,``))||0);r({...t,price:{...t.price,[e]:i}})}function o(t){t.preventDefault(),t.stopPropagation(),r({...v}),e.onReset&&e.onReset()}let s=t.platforms.length+t.gameTypes.length+ +(t.price.min!==v.price.min||t.price.max!==v.price.max);return(0,h.jsxs)(b,{"aria-label":`ตัวกรองสินค้า`,children:[(0,h.jsxs)(x,{children:[(0,h.jsx)(S,{children:`ตัวกรอง`}),(0,h.jsxs)(C,{children:[(0,h.jsx)(w,{$on:s>0}),(0,h.jsx)(T,{children:s>0?`เลือกไว้ ${s} รายการ`:`ยังไม่ได้เลือก`}),(0,h.jsx)(E,{onClick:o,disabled:s===0,children:`ล้างทั้งหมด`})]})]}),(0,h.jsxs)(D,{children:[(0,h.jsx)(O,{children:`แพลตฟอร์ม`}),(0,h.jsx)(k,{children:g.map(e=>{let n=t.platforms.includes(e.key);return(0,h.jsxs)(A,{onClick:()=>i(`platforms`,e.key),$on:n,children:[(0,h.jsx)(j,{$on:n,children:(0,h.jsx)(M,{$on:n,children:`✓`})}),(0,h.jsx)(N,{children:e.label})]},e.key)})})]}),(0,h.jsxs)(D,{children:[(0,h.jsx)(O,{children:`ประเภทเกม`}),(0,h.jsx)(k,{children:_.map(e=>{let n=t.gameTypes.includes(e.key);return(0,h.jsxs)(A,{onClick:()=>i(`gameTypes`,e.key),$on:n,children:[(0,h.jsx)(j,{$on:n,children:(0,h.jsx)(M,{$on:n,children:`✓`})}),(0,h.jsx)(N,{children:e.label})]},e.key)})})]}),(0,h.jsxs)(D,{children:[(0,h.jsx)(O,{children:`ช่วงราคา`}),(0,h.jsxs)(P,{children:[(0,h.jsxs)(F,{children:[(0,h.jsx)(I,{children:`ต่ำสุด`}),(0,h.jsxs)(L,{children:[(0,h.jsx)(R,{children:`฿`}),(0,h.jsx)(z,{inputMode:`numeric`,value:String(t.price.min),onChange:e=>a(`min`,e.target.value)})]})]}),(0,h.jsx)(B,{children:`—`}),(0,h.jsxs)(F,{children:[(0,h.jsx)(I,{children:`สูงสุด`}),(0,h.jsxs)(L,{children:[(0,h.jsx)(R,{children:`฿`}),(0,h.jsx)(z,{inputMode:`numeric`,value:String(t.price.max),onChange:e=>a(`max`,e.target.value)})]})]})]})]}),(0,h.jsx)(V,{children:(0,h.jsx)(H,{children:typeof e.total==`number`?`แสดง ${e.total} รายการ`:`อัปเดตผลลัพธ์อัตโนมัติ`})})]})},b=a.aside`
    /* Local accent — cool cyan */
    --text-accent: #61c4c8;
    --accent: #61c4c8;
    --accent-contrast: #05191a;

    padding: 16px 0px;
    background: var(--bg-primary);
    border: 1px solid var(--bg-hairline);
    border-radius: 4px;
    box-shadow: var(--shadow-card);
    color: #FFF;

`,x=a.header`
    display: block;
`,S=a.h3`
    font-size: 1.5rem;
    line-height: 1.1;
    color: #fff;
    margin: 0;
`,C=a.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 8px;
`,w=a.span`
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${e=>e.$on?`var(--accent)`:`var(--text-muted)`};
    opacity: ${e=>e.$on?1:.5};
    box-shadow: ${e=>e.$on?`0 0 0 3px rgba(97, 196, 200, 0.18)`:`none`};
`,T=a.span`
    flex: 1;
    font-size: 1rem;
    text-transform: uppercase;
    color: var(--text-muted);
`,E=a.button`
    display: block; 
    font-size: 1rem;
    text-transform: uppercase;
    background-color: transparent;
    cursor: pointer;
    padding: 8px;

    &:hover { text-decoration: underline; text-underline-offset: 3px; }
    &:disabled { color: var(--text-muted); opacity: 0.5; cursor: default; text-decoration: none; }
`,D=a.section`
    display: block;
    padding: 16px 0;
    border-bottom: 1px solid var(--bg-hairline);

    &:last-of-type { border-bottom: none; }
`,O=a.h4`
    font-size: 1rem;
    font-weight: normal;
    color: #fff;
    margin: 0 0 12px 0;
    letter-spacing: 0.02em;

    &::before {
        content: "";
        display: inline-block;
        width: 14px;
        height: 1px;
        background: var(--accent);
        vertical-align: middle;
        margin-right: 10px;
        opacity: 0.7;
    }
`,k=a.ul`
    list-style: none;
    padding: 0;
    margin: 0;

    & > *
    {
      margin-bottom: 2px;
    }
`,A=a.li`
    display: grid;
    grid-template-columns: 18px 1fr;
    align-items: center;
    gap: 10px;
    padding: 7px 6px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 160ms ease, color 160ms ease;
    color: ${e=>e.$on?`#fff`:`var(--text-muted)`};

    &:hover { background: var(--menu-primary-hover); color: #fff; }
    ${e=>e.$on&&i`background: var(--menu-primary-active);`}
`,j=a.span`
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${e=>e.$on?`var(--accent)`:`var(--btn-ghost-border)`};
    background: ${e=>e.$on?`var(--accent)`:`transparent`};
    border-radius: 2px;
    transition: all 160ms ease;
`,M=a.span`
    font-size: 0.7rem;
    line-height: 1;
    color: var(--accent-contrast);
    opacity: ${e=>+!!e.$on};
`,N=a.span`
    font-size: 1rem;
    letter-spacing: 0.01em;
`,P=a.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: 8px;
`,F=a.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
`,I=a.span`
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
`,L=a.div`
    position: relative;
    display: flex;
    align-items: center;
`,R=a.span`
    position: absolute;
    left: 10px;
    font-size: 0.95rem;
    color: var(--text-accent);
    pointer-events: none;
`,z=a.input`
    width: 100%;
    padding-left: 24px;
    min-height: 38px;
`,B=a.span`
    padding-bottom: 8px;
    color: #fff;
`,V=a.footer`
    margin-top: 8px;
    padding-top: 14px;
    border-top: 1px solid var(--bg-hairline);
`,H=a.span`
    display: block;
    text-align: center;
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
`;Object.freeze(y);var U=function(){return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(U.List,{}),(0,h.jsx)(U.Filter,{}),(0,h.jsx)(U.Cart,{})]})};U.List=function(){let[e]=n(),t=e.get(`search`),r=ee({search:t??``}),i=r,a=!i.isError,o=i.isLoadingError||i.isFetching,s=i.isLoading,c=i.isLoadingError;m.useEffect(()=>{r.refetch()},[t]);let l=e=>{te.toProduct(e)};return(0,h.jsxs)(W,{children:[(0,h.jsx)(K,{$visible:a,children:(()=>{let e=r;return e.data?e.data.map(e=>{let t=String(e.id),n=e.id,r=e.name,i=e.cover.length>0?u.getUrlStream(e.cover):void 0,a=e.price;return(0,h.jsx)(U.ListItem,{id:n,name:r,artwork:i,price:a,onClick:l},t)}):(0,h.jsx)(h.Fragment,{})})()}),(0,h.jsx)(G,{$visible:o,children:c?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(p,{size:64}),(0,h.jsx)(`p`,{children:`เกิดข้อผิดพลาดการโหลดรายการสินค้า`})]}):s?(0,h.jsx)(`p`,{children:`กำลังโหลดรายการสินค้า`}):(0,h.jsx)(h.Fragment,{})})]})},U.ListItem=function(e){let t=t=>{t.preventDefault(),t.stopPropagation(),e.onClick(e.id)};return(0,h.jsxs)(Z,{"aria-label":`ดูรายละเอียด ${e.name}`,onClick:t,children:[(0,h.jsxs)(Q,{children:[e.artwork?(0,h.jsx)(ne,{src:e.artwork,alt:e.name}):(0,h.jsxs)($,{children:[(0,h.jsx)(re,{children:`✦`}),(0,h.jsx)(ie,{children:`รูปเกม`})]}),(0,h.jsx)(ae,{})]}),(0,h.jsxs)(oe,{children:[(0,h.jsx)(se,{children:e.name}),(0,h.jsxs)(ce,{children:[(0,h.jsxs)(le,{children:[(0,h.jsx)(ue,{children:`ราคา`}),(0,h.jsxs)(de,{children:[e.price.toFixed(2),` `,(0,h.jsx)(`span`,{style:{color:`white`},children:`฿`})]})]}),(0,h.jsx)(fe,{onClick:t,"aria-label":`เพิ่มลงตะกร้า`,children:(0,h.jsx)(c,{size:16})})]})]})]})},U.Filter=function(){return(0,h.jsx)(q,{children:(0,h.jsx)(J,{children:(0,h.jsx)(y,{})})})},U.Cart=function(){let e=l(),t=d(),n=f(),r=t=>{t.preventDefault(),t.stopPropagation(),e.setVisible(!0),e.setClose(()=>{e.setVisible(!1)})},i=t.data,a=i?i.reduce((e,t)=>e+=t.quantity,0):0;return(0,h.jsxs)(Y,{onClick:r,$visible:n.data!==void 0,children:[(0,h.jsx)(X,{children:a}),(0,h.jsx)(s,{})]})};var W=a.div`

  position: relative;
  gap: 8px;
  overflow: hidden auto;
  margin: 48px 510px 0px 254px;
  padding: 16px 2px 16px 2px;

  @media (max-width: 1600px)
  {
    margin: 48px 510px 16px 126px;
  }
  @media (max-width: 1440px)
  {
    margin: 48px 382px 16px 30px;
  }
  @media (max-width: 1200px)
  {
    margin: 48px 382px 16px 14px;
  }
  @media (max-width: 1024px)
  {
    margin: 48px 62px 16px 62px;
  }
  @media (max-width: 768px)
  {
    margin: 48px 14px 16px 14px;
  }
`,G=a.div`
  display: ${e=>e.$visible?`flex`:`none`};
  flex-direction: column;
  gap: 16px;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
`,K=a.div`
  display: ${e=>e.$visible?`flex`:`none`};
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`,q=a.div`
  position: fixed;
  inset: 64px 144px 16px auto;
  width: 324px;
  background-color: var(--bg-primary);
  border-radius: 4px;

  @media (max-width: 1920px)
  {
    inset: 64px 192px 16px auto;
  }
  @media (max-width: 1440px)
  {
    inset: 64px 64px 16px auto;
  }
  @media (max-width: 1024px)
  {
    display: none;
    inset: 0px 0px 0px 0px;
  }
`,J=a.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  overflow-y: scroll;
`,Y=a.button`
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
`,X=a.label`
  position: absolute;
  inset: auto -16px 0px auto;
  font-size: 1rem;

  min-width: 24px;
  min-height: 24px;
  padding: 0px 4px;
  text-align: center;

  background-color: #FF7373;
  border-radius: 4px;
`,Z=a.article`
    --text-accent: #61c4c8;
    --accent: #61c4c8;

    background: var(--bg-primary);
    border: 1px solid var(--bg-hairline);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 220ms ease, border-color 220ms ease,
                box-shadow 220ms ease;
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    color: #fff;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(198,161,91,0.35);
        box-shadow: var(--shadow-hover);
    }
`,Q=a.div`
    position: relative;
    width: 100%;
    max-height: 324px;
    min-width: 100px;
    min-height: 300px;
    aspect-ratio: 3 / 4;
    background: linear-gradient(160deg, #223148 0%, #0F1A2A 100%);
    overflow: hidden;
`,ne=a.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease;
    ${Z}:hover & { transform: scale(1.04); }
`,$=a.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
`,re=a.span`
    font-size: 2rem;
    color: var(--text-accent);
    opacity: 0.6;
`,ie=a.span`
    font-size: 0.7rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
`,ae=a.div`
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(198,161,91,0.14);
    border-radius: 2px;
    pointer-events: none;
`,oe=a.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 14px 14px 14px;
    border-top: 1px solid var(--bg-hairline);
`,se=a.h4`
    color: var(--text-primary);
    font-size: 1rem;
    line-height: 1.35;
    font-weight: 500;
    min-height: 2.7em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`,ce=a.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`,le=a.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`,ue=a.span`
    font-size: 1.0rem;
    text-transform: uppercase;
    color: var(--text-muted);
`,de=a.span`
    font-size: 1.25rem;
    color: var(--text-accent);
`,fe=a.button`
    all: unset;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    border: 1px solid var(--btn-ghost-border);
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color 160ms ease, color 160ms ease,
                border-color 160ms ease;

    &:hover {
        background: var(--accent);
        color: var(--accent-contrast);
        border-color: var(--accent);
    }
`;export{U as default};