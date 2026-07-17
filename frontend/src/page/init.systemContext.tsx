import react  from "react";
import ctx    from "#context/common.ts";
import ctxUI  from "#context/common.ui.ts";

const content = function InitSystemContext (
  { onComplete, children }: 
  {
    onComplete: () => void;
    children: react.ReactNode;
  })
{
  react.useEffect (() =>
  {
    onComplete ();
  },
  []);

  const auth = react.useRef (ctx.defAuth ());
  const language = react.useRef (ctx.defLanguage ());

  const menuContext = react.useRef (ctxUI.defMenuContext ());

  return (
    <ctx.ProviderAuth value={auth.current}>
      <ctx.ProviderLanguage value={language.current}>
        <ctxUI.ProviderMenuContext value={menuContext.current}>
          {children}
        </ctxUI.ProviderMenuContext>
      </ctx.ProviderLanguage>
    </ctx.ProviderAuth>
  );
}
/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;