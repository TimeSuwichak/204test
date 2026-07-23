import{r as e,t}from"./react-C1VktWof.js";import{t as n}from"./index-V2cGtSIi.js";import{r}from"./styled-components.browser.esm-BhrFqjok.js";import{f as i,n as a}from"./common.ui-Ca9FJCyu.js";var o=e(t(),1),s=n(),c=function(e){return(0,s.jsx)(c.Root,{visible:e.visible,direction:e.direction,align:e.align,width:e.width,widthMax:e.widthMax,height:e.height,heightMax:e.heightMax,margin:e.margin,gap:e.gap,selected:e.selected,onClick:e.onClick,children:e.children})};c.Root=function(e){let t=e.visible??!0,n=e.direction??`row`,r=e.align??`center`,i=e.width??`auto`,c=e.widthMax??`auto`,u=e.height??`auto`,d=e.heightMax??`auto`,f=e.margin??`0px`,p=e.gap??`4px`,m=e.onClick??function(){},h=(e,t)=>{m(e,t),t&&(_.current=e,y(g()))},g=()=>({direction:n,align:r,selected:_.current,onClick:h}),_=o.useRef(e.selected),[v,y]=o.useState(g());return o.useEffect(()=>{y(g())},[e]),(0,s.jsx)(l,{$visible:t,$direction:n,$width:i,$widthMax:c,$height:u,$heightMax:d,$margin:f,$gap:p,children:(0,s.jsx)(a,{value:v,children:e.children})})},c.Heading=function(e){return(0,s.jsx)(u,{$size:e.size??`1.5rem`,children:e.text})},c.Item=function(e){let t=i(),n=t.direction,r=n===`row`,a=t.align,c=e.value,l=e.width??(r?`96px`:`100%`),u=e.height??(r?`auto`:`40px`),f=Object.is(e.value,t.selected),p=e.onClick??function(){};return(0,s.jsxs)(d,{onClick:e=>{e.preventDefault(),e.stopPropagation(),t.onClick(c,p()??!0)},$direction:n,$align:a,$width:l,$height:u,$selected:f,children:[(0,s.jsx)(()=>{let t=e.icon;return typeof t==`string`?(0,s.jsx)(`img`,{src:t,alt:``}):o.isValidElement(t)?t:typeof t==`function`||typeof t==`object`?(0,s.jsx)(t,{}):null},{}),e.text]})};var l=r.div`
  display: ${e=>e.$visible?`flex`:`none`};
  flex-wrap: nowrap;
  flex-direction: ${e=>e.$direction};
  width: ${e=>e.$width};
  height: ${e=>e.$height};
  max-width: ${e=>e.$widthMax};
  max-height: ${e=>e.$heightMax};
  margin: ${e=>e.$margin};
  gap: ${e=>e.$gap};

  background-color: "var(--bg-primary);";
  border-radius: 8px;
  border: none;
  outline: none;
`,u=r.p`
  font-size: ${e=>e.$size};
  font-weight: normal;
`,d=r.button`
  width: ${e=>e.$width};
  height: ${e=>e.$height};
  text-align: ${e=>e.$align};

  background-color: ${e=>e.$selected?`var(--menu-primary-selected)`:`var(--menu-primary)`};
  border-color: transparent;
  outline-color: transparent;

  &:hover, &:focus
  {
    background-color: ${e=>e.$selected?`var(--menu-primary-selected-hover)`:`var(--menu-primary-hover)`};
  }
  &:active
  {
    background-color: ${e=>e.$selected?`var(--menu-primary-selected-active)`:`var(--menu-primary-active)`};
  }

  & > img,
  & > svg
  {
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
    width: 24px;
    height: 24px;
  }
`;Object.freeze(c);export{c as t};