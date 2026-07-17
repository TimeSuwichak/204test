import react from "react";
import { lazy } from "react";
import { HashRouter } from "react-router";

//
// โหลดหน้าต่างเมื่อจำเป็นเท่านั้น
// I: Initializer
// G: Global
// C: Customer
// S: Staff
// A: Manager || Admin
// V: View
//

const ISystem = lazy (() => import ("#page/init.system.tsx"));
const ISystemContext = lazy (() => import ("#page/init.systemContext.tsx"));
const ISystemRouter = lazy (() => import ("#page/init.systemRouter.tsx"));

/**
 * หน้าต่างที่ไม่มีการแสดงผลเป็นของตัวเอง
 * แต่ใช้สำหรับการโหลดโค็ดและเริ่มการทำงานระบบส่วนต่าง ๆ
*/
const content = function Init ()
{
  const [state, setState] = react.useState ({
    initSystem: false,
    initSystemContext: false,
    initSystemRouter: false
  });

  return (
    <>
      <HashRouter>
        <content.Splash visible={!(
          state.initSystem ||
          state.initSystemContext ||
          state.initSystemRouter
        )}/>
        <react.Suspense>
          <ISystem 
            onComplete={() => { setState ({ 
              ... state, 
              initSystem: true }); 
            }}/>
          <ISystemContext
            onComplete={() => { setState ({ 
              ... state, 
              initSystemContext: true }); 
            }}>
            <ISystemRouter
              onComplete={() => { setState ({ 
                ... state, initSystemRouter: true }); 
              }}/>
          </ISystemContext>
        </react.Suspense>
      </HashRouter>
    </>
  );
}

content.Splash = function InitSplash ({ visible }: { visible: boolean; })
{
  react.useEffect (() =>
  {
    const text = document.getElementById ("app-splash-text");

    if (text)
    {
      const comment = [
        "ยินดีต้อนรับ",
        "กำลังโหลด ...",
        "ถล่มให้ยับเลย!",
        "วันนี้ฉันมาทำอะไรนะะ"
      ];
      const random = Math.trunc (Math.random () * comment.length);
      const selected = comment[random];

      text.textContent = selected;
    }

  },
  []);
  react.useEffect (() =>
  {
    const view = document.getElementById ("app-splash");

    if (view)
    {
      view.style.opacity = visible ? "1.0" : "0.0";
      view.style.pointerEvents = visible ? "all" : "none";
    }
  },
  [visible]);


  return (<></>);
}
export default content;