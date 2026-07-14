import react  from "react";
import styled from "styled-components";
import api    from "#util/api.auth.ts";
import error  from "#util/common.error.ts";

import { keyframes } from "styled-components";


interface PropContainer
{
  children ?: react.ReactNode;
}
interface PropHvSignInId
{
  visible ?: number;

  onContinue ?: () => void;
  onCancel ?: () => void;
}
interface PropHvSignInPwd
{
  visible ?: number;

  onContinue ?: () => void;
  onCancel ?: () => void;
}
interface PropLvSignInId
{
  visible ?: number;
  title ?: string;
  description ?: string;
  feedback ?: string;
  feedbackType ?: number;
  onContinue ?: (input: string) => void;
  onCreate ?: () => void;
  onRecovery ?: () => void;
}
interface PropLvSignInPwd
{
  visible ?: number;
  feedback ?: string;
  feedbackType ?: number;
  onContinue ?: (input: string) => void;
  onCancel ?: () => void;
}

const content = function Auth ()
{
  
  return <>
  <content.Container>
    <content.HvSignIn/>
  </content.Container>
  </>
}

content.VISIBLE_UNDEFINED = 0;
content.VISIBLE_HIDDEN = 1;
content.VISIBLE_SHOWN = 2;

content.VIEW_UNDEFINED = 0;
content.VIEW_SIGN_IN = 1;
content.VIEW_SIGN_IN_ID = 2;
content.VIEW_SIGN_IN_PWD = 3;
content.VIEW_SIGN_IN_TOTP = 4;

content.FEEDBACK_UNDEFINED = 0;
content.FEEDBACK_WARNING = 1;
content.FEEDBACK_ERROR = 2;

content.Container = function AuthContainer (prop: PropContainer)
{
  return <>
  <FormView>
    <FormBox>
      {prop.children}
    </FormBox>
  </FormView>
  </>;
}
content.HvSignIn = function AuthHvSignIn ()
{
  const [view, setView] = react.useState (content.VIEW_SIGN_IN_ID);
  const visibleId = view == content.VIEW_SIGN_IN_ID ? 
    content.VISIBLE_SHOWN : content.VISIBLE_HIDDEN;
  const visiblePwd = view == content.VIEW_SIGN_IN_PWD ? 
    content.VISIBLE_SHOWN : content.VISIBLE_HIDDEN;
  

  function enterId ()
  {
    setView (content.VIEW_SIGN_IN_ID);
  }
  function enterPwd ()
  {
    setView (content.VIEW_SIGN_IN_PWD);
  }
  function enterMfa ()
  {
    return;
  }

  return <>
    <content.HvSignInId 
      visible={visibleId} 
      onContinue={enterPwd}/>
    <content.HvSignInPwd 
      visible={visiblePwd} 
      onContinue={enterMfa} onCancel={enterId}/>
  </>;
}
content.HvSignInId = function AuthHvSignInId (prop: PropHvSignInId)
{
  const [feedback, setFeedback] = react.useState ({
    type: content.FEEDBACK_UNDEFINED,
    text: ""
  });

  function onContinue (input: string)
  {
    const compliant = api.checkCompliantId (input);

    if (!compliant.lengthEmpty)
    {
      setFeedback ({ 
        type: content.FEEDBACK_WARNING, 
        text: "รหัสประจำตัวต้องไม่เว้นว่าง" 
      });
      return;
    }
    if (!compliant.lengthMin) 
    {
      setFeedback ({ 
        type: content.FEEDBACK_WARNING, 
        text: "รหัสประจำตัวต้องยาวอย่างน้อย 2 ตัวอักษร" 
      });
      return;
    }
    if (!compliant.lengthMax)
    {
      setFeedback ({ 
        type: content.FEEDBACK_WARNING, 
        text: "รหัสประจำตัวต้องยาวไม่เกิน 32 ตัวอักษร" 
      });
      return;
    }
    setFeedback ({ type: content.FEEDBACK_UNDEFINED, text: "" });

    api.signIn (input).then (() =>
    {
      if (prop.onContinue) {
        prop.onContinue ();
      }
    })
    .catch ((e: unknown) =>
    {
      if (e instanceof error.Network) 
      {
        setFeedback ({ 
          type: content.FEEDBACK_ERROR, 
          text: "เกิดข้อผิดพลาดทางด้านเครือข่าย โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ" 
        });
        return;
      }
      if (e instanceof error.NotFound) 
      {
        setFeedback ({ 
          type: content.FEEDBACK_ERROR, 
          text: "ไม่พบบัญชีผู้ใช้งาน โปรดตรวจสอบรหัสประจำตัวของคุณอีกครั้ง" 
        });
        return;
      }
      if (e instanceof error.NetworkLimit) 
      {
        setFeedback ({ 
          type: content.FEEDBACK_ERROR, 
          text: "ระบบปฏิเสธคำขอของคุณ โปรดรอสักครู่" 
        });
        return;
      }
      if (e instanceof error.NotAvailable) 
      {
        setFeedback ({ 
          type: content.FEEDBACK_ERROR, 
          text: "ระบบไม่สามารถทำงานได้ในเวลานี้ โปรดลองใหม่อีกครั้งในภายหลัง" 
        });
        return;
      }
      setFeedback ({ 
        type: content.FEEDBACK_ERROR, 
        text: "เกิดข้อผิดพลาดบางอย่าง โปรดลองใหม่อีกครั้ง" 
      });
    });
  }
  function onCreate ()
  {
    setFeedback ({ 
      type: content.FEEDBACK_ERROR, 
      text: "ขออภัย ระบบไม่สามารถใช้งานได้ในตอนนี้" 
    });
  }
  function onRecovery ()
  {
    setFeedback ({ 
      type: content.FEEDBACK_ERROR, 
      text: "ขออภัย ระบบไม่สามารถใช้งานได้ในตอนนี้" 
    });
  }

  return <>
  <content.LvSignInId
    visible={prop.visible}
    title="ร้านขายแผ่นและตลับเกม"
    description="ยินดีต้อนรับ โปรดป้อนรหัสบัญชีของคุณเพื่อลงชื่อเข้าใช้"
    feedback={feedback.text}
    feedbackType={feedback.type}
    onContinue={onContinue}
    onCreate={onCreate}
    onRecovery={onRecovery}
  />
  </>;
}
content.HvSignInPwd = function AuthHvSignInPwd (prop: PropHvSignInPwd)
{
  const [feedback, setFeedback] = react.useState ({
    type: content.FEEDBACK_UNDEFINED,
    text: ""
  });

  function onContinue (input: string)
  {
    const compliant = api.checkCompliantPwd (input);

    if (!compliant.lengthEmpty)
    {
      setFeedback ({ 
        type: content.FEEDBACK_WARNING, 
        text: "รหัสผ่านต้องไม่เว้นว่าง" 
      });
      return;
    }
    if (!compliant.lengthMin) 
    {
      setFeedback ({ 
        type: content.FEEDBACK_WARNING, 
        text: "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร" 
      });
      return;
    }
    if (!compliant.lengthMax)
    {
      setFeedback ({ 
        type: content.FEEDBACK_WARNING, 
        text: "รหัสผ่านต้องยาวไม่เกิน 32 ตัวอักษร" 
      });
      return;
    }
    setFeedback ({ type: content.FEEDBACK_UNDEFINED, text: "" });

    if (prop.onContinue) {
      prop.onContinue ();
    }
  }
  function onCancel ()
  {
    if (prop.onCancel) {
      prop.onCancel ();
    }
  }

  return <>
  <content.LvSignInPwd 
    visible={prop.visible}
    feedback={feedback.text}
    feedbackType={feedback.type}
    onContinue={onContinue}
    onCancel={onCancel}
  />
  </>;
}

content.LvSignInId = function AuthLvSignInId (prop: PropLvSignInId)
{
  const visibleRaw = prop.visible ?? content.VISIBLE_HIDDEN;
  const visible = 
    visibleRaw == content.VISIBLE_SHOWN ? "visible" :
    visibleRaw == content.VISIBLE_HIDDEN ? "hidden" : "hidden";
  const title = prop.title ?? "";
  const desc = prop.description ?? "";
  const feedback = prop.feedback ?? "";
  const feedbackType = prop.feedbackType ?? "warning";
  const feedbackColor = 
    feedbackType === content.FEEDBACK_WARNING ? "var(--text-warning);" :
    feedbackType === content.FEEDBACK_ERROR ? "var(--text-error);" : "";

  const input = react.useRef (HTMLInputElement.prototype);

  function onContinue (event: react.MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onContinue) {
      prop.onContinue (input.current.value);
    }
  }
  function onCreate (event: react.MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onCreate) {
      prop.onCreate ();
    }
  }
  function onRecovery (event: react.MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onRecovery) {
      prop.onRecovery ();
    }
  }

  return <react.Activity mode={visible}>
    <FormTitle>{title}</FormTitle>
    <FormDesc>{desc}</FormDesc>
    <FormMain>
      <label htmlFor="auth-signin-id">รหัสประจำตัว</label>
      <input id="auth-signin-id" ref={input}
        type="text" autoComplete="username webauthn"/>

      <FormAlert $color={feedbackColor}>{feedback}</FormAlert>
      <button type="submit" onClick={onContinue}>ดำเนินการต่อ</button>
      <div>
        <FormOption onClick={onRecovery}>ลืมรหัสผ่าน</FormOption>
        <FormOption onClick={onCreate}>สร้างบัญชีใหม่</FormOption>
      </div>

    </FormMain>
    <FormDescPrivacy> 
      หากนี้ไม่ใช่อุปกรณ์ของคุณ 
      <span>ให้ใช้งานโหมดไม่ระบุตัวตนของเบราว์เซอร์</span>
      <span>เพื่อเลี่ยงความเสี่ยงการรั่วไหลของข้อมูลของคุณ</span>
    </FormDescPrivacy>
  </react.Activity>;
}
content.LvSignInPwd = function AuthLvSignInPwd (prop: PropLvSignInPwd)
{
  const visibleRaw = prop.visible ?? content.VISIBLE_HIDDEN;
  const visible = 
    visibleRaw == content.VISIBLE_SHOWN ? "visible" :
    visibleRaw == content.VISIBLE_HIDDEN ? "hidden" : "hidden";

  const feedback = prop.feedback ?? "";
  const feedbackType = prop.feedbackType ?? "warning";
  const feedbackColor = 
    feedbackType === content.FEEDBACK_WARNING ? "var(--text-warning);" :
    feedbackType === content.FEEDBACK_ERROR ? "var(--text-error);" : "";

  const input = react.useRef (HTMLInputElement.prototype);

  function onContinue (event: react.MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onContinue) {
      prop.onContinue (input.current.value);
    }
  }
  function onCancel (event: react.MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onCancel) {
      prop.onCancel ();
    }
  }

  return <react.Activity mode={visible}>
    <FormMain>
      <button onClick={onCancel}>ย้อนกลับ</button>
      <label htmlFor="auth-signin-pwd">รหัสผ่าน</label>
      <input id="auth-signin-pwd" ref={input}
        type="password" autoComplete="current-password webauthn"/>

      <FormAlert $color={feedbackColor}>{feedback}</FormAlert>
      <button type="submit" onClick={onContinue}>ดำเนินการต่อ</button>
    </FormMain>
  </react.Activity>;
}
content.SignUp = function AuthSignUp ()
{
  return <></>;
}


const AnimOpening = keyframes`
  from { scale: 1.25;}
  to { scale: 1.0; }
`;
const FormView = styled.div`
  width: 100dvw;
  height: 100dvh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;
const FormBox = styled.div`
  width: 512px;
  height: 572px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  animation-name: ${AnimOpening};
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-duration: 500ms;

  @media (max-width: 512px)
  {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-radius: 0px;
  }

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 16px;
`;
const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin: 16px 16px 0px 16px;
`;
const FormDesc = styled.p`
  font-size: 1rem;
  margin: 0px 16px 0px 16px;
`;
const FormDescPrivacy = styled.p`
  font-size: 1rem;
  margin: 0px 16px 16px 16px;

  @media (max-width: 512px)
  {
    background-color: var(--bg-primary);
    border-radius: 4px;
    padding: 8px;
  }
`;
const FormMain = styled.form`
  margin: 0px 16px 0px 16px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;
const FormAlert = styled.p<{ $color: string; }>`
  font-size: 1rem;
  font-weight: normal;
  height: 32px;
  color: ${prop => prop.$color};
`;
const FormOption = styled.button`
  background-color: transparent;
  border: transparent;
  outline: transparent;
  width: 100%;
  text-align: start;
`;

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;