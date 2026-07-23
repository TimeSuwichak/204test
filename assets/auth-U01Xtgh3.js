const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/auth.signin-BhKSNzO9.js","assets/react-C1VktWof.js","assets/index-V2cGtSIi.js","assets/hooks-svCkyKQa.js","assets/index-CvGiN8M3.css","assets/styled-components.browser.esm-BhrFqjok.js","assets/api.common-CQSMm7OV.js","assets/api.auth-BVGiUq4E.js","assets/createLucideIcon-AHYuUPOs.js","assets/key-round-CuMhsKZc.js","assets/shield-user-D_1lttQr.js","assets/user-lock-Cisi-UFr.js","assets/auth.signup-Bt9QAly4.js","assets/mail-PFEykbor.js","assets/user-DE1zXFWB.js"])))=>i.map(i=>d[i]);
import{r as e,t}from"./react-C1VktWof.js";import{r as n,t as r}from"./index-V2cGtSIi.js";import{r as i,t as a}from"./styled-components.browser.esm-BhrFqjok.js";import"./api.auth-BVGiUq4E.js";import{t as o}from"./createLucideIcon-AHYuUPOs.js";var s=e(t(),1),c=`/UniversityCSI204/assets/auth.bg-DCaReTEc.jpg`,l=o(`arrow-left`,[[`path`,{d:`m12 19-7-7 7-7`,key:`1l729n`}],[`path`,{d:`M19 12H5`,key:`x3x0zl`}]]),u=o(`shield-alert`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`M12 8v4`,key:`1got3b`}],[`path`,{d:`M12 16h.01`,key:`1drbdi`}]]),d=r(),f=s.lazy(()=>n(()=>import(`./auth.signin-BhKSNzO9.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]))),p=s.lazy(()=>n(()=>import(`./auth.signup-Bt9QAly4.js`),__vite__mapDeps([12,1,2,3,4,7,6,9,8,13,14]))),m=function(e){let t=s.useState(m.PAGE_SIGN_IN_ID),n=s.useState(!1),r=s.useState(m.createEmptyFeedback()),i=s.useRef(m.createEmptySession()),a=s.useRef(``);return(0,d.jsxs)(m.View,{children:[(0,d.jsx)(m.ViewBackground,{}),(0,d.jsxs)(m.ViewForm,{transparent:e.transparent??!1,children:[(0,d.jsx)(m.FormHome,{}),(0,d.jsx)(f,{staPage:t,staPending:n,staFeedback:r,refSession:i,refId:a,title:e.title,description:e.description,onComplete:e.onSignedIn}),(0,d.jsx)(p,{staPage:t,staPending:n,staFeedback:r,refSession:i,refId:a,title:e.title,description:e.description}),(0,d.jsx)(m.ViewPending,{visible:n[0]})]})]})};m.VISIBLE_UNDEFINED=0,m.VISIBLE_HIDDEN=1,m.VISIBLE_SHOWN=101,m.ANIM_NONE=0,m.ANIM_SCALE_UP=1,m.ANIM_SCALE_UP_DOWN=2,m.ANIM_SCALE_DOWN=3,m.ANIM_SCALE_DOWN_UP=4,m.ANIM_SLIDE_LEFT_TO_RIGHT=5,m.ANIM_SLIDE_RIGHT_TO_LEFT=6,m.PAGE_UNDEFINED=0,m.PAGE_SIGN_IN=1,m.PAGE_SIGN_IN_ID=2,m.PAGE_SIGN_IN_PWD=3,m.PAGE_SIGN_IN_TOTP=4,m.PAGE_SUSPENDED=11,m.PAGE_SIGN_UP=101,m.FEEDBACK_UNDEFINED=0,m.FEEDBACK_WARNING=1,m.FEEDBACK_ERROR=2,m.createEmptyFeedback=()=>({type:m.FEEDBACK_UNDEFINED,text:``}),m.createEmptySession=()=>({secret:``,issued:Date.prototype,expire:Date.prototype}),m.View=function(e){return(0,d.jsx)(h,{children:(0,d.jsx)(g,{children:e.children})})},m.ViewBackground=function(){return(0,d.jsx)(_,{src:c})},m.ViewForm=function(e){return(0,d.jsx)(b,{$transparent:e.transparent,children:e.children})},m.ViewPending=function(e){return(0,d.jsx)(x,{$visible:e.visible??!1})},m.FormHome=function(){return(0,d.jsx)(d.Fragment,{})},m.TemplateDiv=function(e){return(0,d.jsx)(S,{$visible:e.visible??!0,children:e.children})},m.TemplateHeader=function(e){return(0,d.jsxs)(C,{children:[(0,d.jsx)(T,{children:e.title??``}),(0,d.jsx)(E,{children:e.description??``}),e.onBack?(0,d.jsxs)(w,{onClick:t=>{t.preventDefault(),t.stopPropagation(),e.onBack&&e.onBack()},children:[(0,d.jsx)(l,{}),(0,d.jsx)(`span`,{children:`ย้อนกลับ`})]}):(0,d.jsx)(d.Fragment,{})]})},m.TemplateMain=function(e){return(0,d.jsx)(D,{children:e.children})},m.TemplateFooter=function(e){return(0,d.jsx)(O,{children:e.children})},m.TemplateOption=function(e){return(0,d.jsxs)(A,{disabled:e.disabled??!1,onClick:t=>{t.preventDefault(),t.stopPropagation(),e.onClick&&e.onClick()},children:[typeof e.icon==`string`?(0,d.jsx)(`img`,{src:e.icon}):e.icon,(0,d.jsx)(`span`,{children:e.text})]})},m.TemplateFeedback=function(e){return(0,d.jsx)(j,{$color:e.type??m.FEEDBACK_UNDEFINED,children:e.text})},m.TemplatePrivacyNotice=function(){return(0,d.jsxs)(k,{children:[(0,d.jsx)(u,{size:24}),`หากนี้ไม่ใช่อุปกรณ์ของคุณ`,(0,d.jsx)(`span`,{children:`ให้ใช้งานโหมดไม่ระบุตัวตนของเบราว์เซอร์`}),(0,d.jsx)(`span`,{children:`เพื่อเลี่ยงความเสี่ยงการรั่วไหลของข้อมูลของคุณ`})]})};var h=i.div`
  position: fixed;
  inset: 0px;
`,g=i.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
`,_=i.img`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 512px)
  {
    opacity: 0.0;
  }
`,v=a`
  from { scale: 1.25;}
  to { scale: 1.0; }
`,y=a`
  /* 0% { background-position: 0% 50%; }
  50% { background-position:100% 50%; }
  100% { background-position:0% 50%; } */

  0% { background-position: 100% 100%; }
  100% { background-position: 0% 100%; }
`,b=i.form`

  width: 512px;
  height: 572px;
  background-color: ${e=>e.$transparent?`transparent`:`var(--bg-primary)`};
  outline: 2px solid ${e=>e.$transparent?`transparent`:`var(--bg-primary-border)`};
  border-radius: 8px;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  animation-name: ${v};
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-duration: 500ms;
  display: block;
  position: relative;
  overflow: hidden;

  @media (max-width: 512px)
  {
    outline-width: 0px;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-radius: 0px;
  }
`,x=i.div`
  pointer-events: none;
  position: absolute;
  inset: 0px 0px auto 0px;
  width: 100%;
  height: 8px;
  opacity: ${e=>e.$visible?`1.0`:`0.0`};
  border-radius: 4px;
  background: linear-gradient(
    90deg, 
    var(--bg-primary),
    var(--bg-primary),
    var(--bg-primary),
    var(--bg-primary-border),
    var(--bg-primary-border),
    var(--bg-primary-border),
    var(--bg-primary),
    var(--bg-primary),
    var(--bg-primary)
  );
  background-size: 400% 400%;
  transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1);

  -webkit-animation: ${y} 1000ms 
    cubic-bezier(0.85, 0, 0.15, 1) infinite;
  -moz-animation: ${y} 1000ms 
    cubic-bezier(0.85, 0, 0.15, 1) infinite;
  animation: ${y} 1000ms 
    cubic-bezier(0.85, 0, 0.15, 1) infinite;
`,S=i.div`

  pointer-events: ${e=>e.$visible?`all`:`none`};
  position: absolute;
  inset: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 16px;
  opacity: ${e=>e.$visible?`1.0`:`0.0`};
  transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1);
`,C=i.header`
  width: 100%;
  height: 128px;
  padding: 16px 16px 0px 16px;
`,w=i.button`
  width: 144px;
  font-size: 1rem;
  font-weight: normal;
  text-align: start;
  background-color: transparent;
  margin: 16px 0px;

  & > img,
  & > svg
  {
    display: inline-block;
    margin-right: 16px;
    vertical-align: middle;
  }
`,T=i.h1`
  width: 100%;
  font-size: 2rem;
  font-weight: normal;
`,E=i.p`
  width: 100%;
  font-size: 1rem;
  font-weight: normal;
`,D=i.main`
  width: 100%;
  height: 100%;
  padding: 0px 16px 0px 16px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 8px;
`,O=i.footer`
  width: 100%;
  height: 128px;
  padding: 0px 16px 16px 16px;
`,k=i.p`
  font-size: 1rem;
  margin: 0px 16px 16px 16px;

  @media (max-width: 512px)
  {
    background-color: var(--bg-primary);
    border-radius: 4px;
    padding: 8px;
  }
  & > img,
  & > svg
  {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
`,A=i.button`
  background-color: transparent;
  border: transparent;
  outline: transparent;
  width: 100%;
  text-align: start;

  & > img,
  & > svg
  {
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    margin-right: 16px;
  }
`,j=i.p`
  font-size: 1rem;
  font-weight: normal;
  width: 100%;
  height: 48px;
  color: ${e=>e.$color===m.FEEDBACK_WARNING?`var(--text-warning)`:e.$color===m.FEEDBACK_ERROR?`var(--text-error)`:`var(--text-primary)`}
`;Object.freeze(m);export{m as t};