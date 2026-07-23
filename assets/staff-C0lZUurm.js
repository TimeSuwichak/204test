import{r as e,t}from"./react-C1VktWof.js";import{t as n}from"./index-V2cGtSIi.js";import{r}from"./styled-components.browser.esm-BhrFqjok.js";import{n as i,t as a}from"./staff.order-rdialeTi.js";var o=e(t(),1),s=n(),c=function(){let[e,t]=(0,o.useState)(`Stock`);return(0,s.jsxs)(l,{children:[(0,s.jsxs)(u,{children:[(0,s.jsx)(d,{onClick:()=>t(`Stock`),children:`Stock`}),(0,s.jsx)(d,{onClick:()=>t(`Orders`),children:`Orders`})]}),(0,s.jsx)(f,{children:(()=>{switch(e){case`Stock`:return(0,s.jsx)(i,{});case`Orders`:return(0,s.jsx)(a,{});default:return(0,s.jsx)(i,{})}})()})]})},l=r.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,u=r.div`
  background-color: darkblue;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  color: black;
  font-size: 1.5rem;
  margin: 1rem;
  width: 20%;
`,d=r.button`
  font-size: 1.5rem;
  width: 100%;
  height: 100%;
  background-color: blue;
  border: 0px solid white;
  color: white; 
  cursor: pointer;
  padding: 0.5rem 1rem; 
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: darkblue;
  }
`,f=r.div`
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  width: 100%;
`;function p(){return(0,s.jsxs)(`div`,{style:{padding:`2rem`},children:[(0,s.jsx)(`h1`,{children:`Staff Page`}),(0,s.jsx)(c,{})]})}export{p as default};