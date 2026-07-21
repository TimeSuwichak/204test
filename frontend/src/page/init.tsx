import { Suspense, lazy, useState, useEffect, useRef } from "react";
import { HashRouter } from "react-router";


const ISystem = lazy (() => import ("#page/init.system.tsx"));
const ISystemContext = lazy (() => import ("#page/init.systemContext.tsx"));
const ISystemRouter = lazy (() => import ("#page/init.systemRouter.tsx"));

/**
 * หน้าต่างที่ไม่มีการแสดงผลเป็นของตัวเอง
 * แต่ใช้สำหรับการโหลดโค็ดและเริ่มการทำงานระบบส่วนต่าง ๆ
*/
const content = function Init ()
{
  const completedTotal = 3;
  const completed = useRef (0);
  const [splash, setSplash] = useState (true);

  const onCountMounted = () =>
  {
    completed.current += 1;
    setSplash (completed.current !== completedTotal);
  };
  const onCountUnmounted = () =>
  {
    completed.current -= 1;
    setSplash (completed.current !== completedTotal);
  }

  useEffect (() =>
  {
    completed.current = 0;
    setSplash (true);

    return () =>
    {
      completed.current = 0;
      setSplash (true);
    }
  },
  []);

  return (
    <>
      <HashRouter>
        <content.Splash visible={splash}/>
        <Suspense>
          <ISystem 
            onMounted={onCountMounted}
            onUnmounted={onCountUnmounted}/>
          <ISystemContext 
            onMounted={onCountMounted} 
            onUnmounted={onCountUnmounted}>
            <ISystemRouter 
              onMounted={onCountMounted}
              onUnmounted={onCountUnmounted}/>
          </ISystemContext>
        </Suspense>
      </HashRouter>
    </>
  );
}

content.Splash = function InitSplash ({ visible }: { visible: boolean; })
{
  useEffect (() =>
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

  useEffect (() =>
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
/**
 * ส่งออกตัวแปร
*/
export default content;