import react    from "react";
import styled   from "styled-components";
import api      from "#util/api.auth.ts";
import error    from "#util/common.error.ts";

import { Activity }  from "react";
import { keyframes } from "styled-components";
import { ArrowLeft, RotateCcw, UserRoundPlus } from "lucide-react";
import { type Session } from "#util/api.auth.ts";

type ActivityMode = "visible" | "hidden" | undefined;

interface PropContent
{
  visible ?: boolean;
  visibleAnimation ?: number;
  page ?: number;
  transparent ?: boolean;
  title ?: string;
  description ?: string;

  onSignedIn ?: () => void;
  onSignedUp ?: () => void;
  onCancel ?: () => void;
}
interface PropView
{
  children ?: react.ReactNode;
}
interface PropViewForm
{
  children ?: react.ReactNode;
  transparent ?: boolean;
}
interface PropFormSignInId
{
  visible ?: boolean;
  visibleAnimation ?: number;
  title ?: string;
  description ?: string;
  pending ?: boolean;
  feedback ?: PropTemplateFeedback;
  onSubmit ?: (value: string) => void;
  onBack ?: (last: string) => void;
}
interface PropFormSignInPwd
{
  visible ?: boolean;
  visibleAnimation ?: number;
  pending ?: boolean;
  feedback ?: PropTemplateFeedback;
  onSubmit ?: (value: string) => void;
  onBack ?: (last: string) => void;
}
interface PropTemplateHeader
{
  title ?: string;
  description ?: string;
  onBack ?: () => void;
}
interface PropTemplateMain
{
  children ?: react.ReactNode;
}
interface PropTemplateFooter
{
  children ?: react.ReactNode;
}
interface PropTemplateOption
{
  icon ?: string | react.JSX.Element;
  text ?: string;
  disabled ?: boolean;
}
interface PropTemplateFeedback
{
  type ?: number;
  text ?: string;
}

const checkInputSignInId = (input: string) : PropTemplateFeedback | null =>
{
  const compliant = api.checkCompliantId (input);

  if (!compliant.lengthEmpty)
  {
    return {
      type: content.FEEDBACK_WARNING,
      text: "รหัสประจำตัวต้องไม่เว้นว่าง"
    }
  }
  if (!compliant.lengthMin) 
  {
    return {
      type: content.FEEDBACK_WARNING, 
      text: "รหัสประจำตัวต้องยาวอย่างน้อย 2 ตัวอักษร"
    }
  }
  if (!compliant.lengthMax)
  {
    return {
      type: content.FEEDBACK_WARNING, 
      text: "รหัสประจำตัวต้องยาวไม่เกิน 32 ตัวอักษร"
    }
  }
  return null;
}
const checkInputSignInPwd = (input: string) : PropTemplateFeedback | null =>
{
  const compliant = api.checkCompliantPwd (input);

  if (!compliant.lengthEmpty)
  {
    return { 
      type: content.FEEDBACK_WARNING, 
      text: "รหัสผ่านต้องไม่เว้นว่าง" 
    };
  }
  if (!compliant.lengthMin) 
  {
    return { 
      type: content.FEEDBACK_WARNING, 
      text: "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร" 
    };
  }
  if (!compliant.lengthMax)
  {
    return { 
      type: content.FEEDBACK_WARNING, 
      text: "รหัสผ่านต้องยาวไม่เกิน 32 ตัวอักษร" 
    };
  }
  return null;
}
const checkResSignInId = (input: unknown) : PropTemplateFeedback =>
{
  if (input instanceof error.Network) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: 
      `เกิดข้อผิดพลาดทางด้านเครือข่าย โปรดตรวจสอบการเชื่อมต่อเครือข่ายของคุณ` 
    };
  }
  if (input instanceof error.NotFound) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: "ไม่พบบัญชีผู้ใช้งาน โปรดตรวจสอบรหัสประจำตัวของคุณอีกครั้ง" 
    };
  }
  if (input instanceof error.NetworkLimit) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: "ระบบปฏิเสธคำขอของคุณ โปรดรอสักครู่แล้วลองใหม่อีกครั้ง" 
    };
  }
  if (input instanceof error.NotAvailable) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: "ระบบไม่สามารถทำงานได้ในเวลานี้ โปรดลองใหม่อีกครั้งในภายหลัง" 
    };
  }
  return { 
    type: content.FEEDBACK_ERROR, 
    text: "เกิดข้อผิดพลาดบางอย่าง โปรดลองใหม่อีกครั้ง" 
  };
}
const checkResSignInPwd = (input: unknown) : PropTemplateFeedback =>
{
  if (input instanceof error.Network) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: 
      `เกิดข้อผิดพลาดทางด้านเครือข่าย โปรดตรวจสอบการเชื่อมต่อเครือข่ายของคุณ` 
    };
  }
  if (input instanceof error.NotFound) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: "ไม่พบบัญชีผู้ใช้งาน โปรดตรวจสอบรหัสประจำตัวของคุณอีกครั้ง" 
    };
  }
  if (input instanceof error.NetworkLimit) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: "ระบบปฏิเสธคำขอของคุณ โปรดรอสักครู่แล้วลองใหม่อีกครั้ง" 
    };
  }
  if (input instanceof error.NotAuthorized)
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: "รหัสผ่านของคุณไม่ถูกต้อง โปรดตรวจสอบแล้วลองใหม่อีกครั้ง" 
    };
  }
  if (input instanceof error.NotAvailable) 
  {
    return { 
      type: content.FEEDBACK_ERROR, 
      text: "ระบบไม่สามารถทำงานได้ในเวลานี้ โปรดลองใหม่อีกครั้งในภายหลัง" 
    };
  }
  return { 
    type: content.FEEDBACK_ERROR, 
    text: "เกิดข้อผิดพลาดบางอย่าง โปรดลองใหม่อีกครั้ง" 
  };
}

const emptyFeedback = () : PropTemplateFeedback =>
{
  return {
    type: content.FEEDBACK_UNDEFINED,
    text: ""
  }
}
const emptySession = () : Session =>
{
  return {
    secret: "",
    issued: Date.prototype,
    expire: Date.prototype
  }
}

/**
 * ส่วนประกอบแสดงผลแบบหน้าต่าง
*/
const content = function Auth (prop: PropContent)
{
  const [page, setPage] = react.useState (content.PAGE_SIGN_IN_ID);
  const [pending, setPending] = react.useState (false);
  const [feedback, setFeedback] = react.useState (emptyFeedback ());
  const id = react.useRef ("");
  const session = react.useRef (emptySession ()); 

  const onSignedIn = () =>
  {
    const saved = api.saveAdd ({
      name: id.current,
      secret: session.current.secret,
      issued: session.current.issued,
      expired: session.current.expire,
    });
    api.saveSetPrefered (saved);
    api.saveWrite ();

    if (prop.onSignedIn) {
      prop.onSignedIn ();
    }
  }
  const onSubmitId = (value: string) =>
  {
    const invalid = checkInputSignInId (value);

    if (invalid)
    {
      setFeedback (invalid);
      return;
    }
    else
    {
      setFeedback (emptyFeedback ());
      setPending (true);
    }
    api.signIn (value).then (([se, ch]) =>
    {
      id.current = value;
      session.current = se;

      switch (ch.step)
      {
        case api.STEP_PASSWORD: setPage (content.PAGE_SIGN_IN_PWD); break;
      }
      setPending (false);
    })
    .catch ((e: unknown) =>
    {
      setFeedback (checkResSignInId (e));
      setPending (false);
    });
  }
  const onSubmitPwd = (value: string) =>
  {
    const invalid = checkInputSignInPwd (value);

    if (invalid)
    {
      setFeedback (invalid);
      return;
    }
    else
    {
      setFeedback (emptyFeedback ());
      setPending (true);
    }
    api.signInPwd (
      session.current.secret, 
      id.current, 
      value
    ).then (([se, ch]) =>
    {
      session.current = se;

      switch (ch.step)
      {
        case api.STEP_COMPLETE:
          onSignedIn ();
          return;
      }
      setPending (false);
    })
    .catch ((e: unknown) =>
    {
      setFeedback (checkResSignInPwd (e));
      setPending (false);
    });
  }
  const onBackPwd = () =>
  {
    id.current = "";
    session.current = emptySession ();

    setFeedback (emptyFeedback ());
    setPage (content.PAGE_SIGN_IN_ID);
  }

  return (
    <content.View>
      <content.ViewForm transparent={prop.transparent ?? false}>
        <content.FormHome/>
        <content.FormSignInId
          visible={page === content.PAGE_SIGN_IN_ID} 
          visibleAnimation={content.ANIM_NONE}
          title={prop.title} 
          description={prop.description}
          feedback={feedback}
          pending={pending}
          onSubmit={onSubmitId}/>
        <content.FormSignInPwd
          visible={page === content.PAGE_SIGN_IN_PWD} 
          visibleAnimation={content.ANIM_NONE}
          feedback={feedback}
          pending={pending}
          onSubmit={onSubmitPwd}
          onBack={onBackPwd}/>
        <content.FormSignInTotp/>
        <content.FormSignUpEmail/>
        <content.FormSignUpPwd/>
        <content.FormSignUpId/>
        <content.FormSigned/>
        <content.FormSuspended/>
      </content.ViewForm>
    </content.View>
  );
}
/**
 * โหมดแสดงผล: ไม่ทราบ
*/
content.VISIBLE_UNDEFINED = 0;
/**
 * โหมดแสดงผล: ซ่อน
*/
content.VISIBLE_HIDDEN = 1;
/**
 * โหมดแสดงผล: แสดงทันที
*/
content.VISIBLE_SHOWN = 101;
/**
 * ไม่มีการใช้งานแอนิเมชั่นใด ๆ
*/
content.ANIM_NONE = 0;
content.ANIM_SCALE_UP = 1;
content.ANIM_SCALE_UP_DOWN = 2;
content.ANIM_SCALE_DOWN = 3;
content.ANIM_SCALE_DOWN_UP = 4;
content.ANIM_SLIDE_LEFT_TO_RIGHT = 5;
content.ANIM_SLIDE_RIGHT_TO_LEFT = 6;
/**
 * การแสดงผล: ไม่ทราบ
*/
content.PAGE_UNDEFINED = 0;
/**
 * การแสดงผล: หน้าเริ่มต้นลงชื่อเข้าใช้
*/
content.PAGE_SIGN_IN = 1;
/**
 * การแสดงผล: หน้าใส่รหัสประจำตัว
*/
content.PAGE_SIGN_IN_ID = 2;
/**
 * การแสดงผล: หน้าใส่รหัสผ่าน
*/
content.PAGE_SIGN_IN_PWD = 3;
/**
 * การแสดงผล: หน้าใส่รหัส TOTP
*/
content.PAGE_SIGN_IN_TOTP = 4;

/**
 * ข้อความตอบกลับ: ไม่ระบุ
*/
content.FEEDBACK_UNDEFINED = 0;
/**
 * ข้อความตอบกลับ: คำเตือน
*/
content.FEEDBACK_WARNING = 1;
/**
 * ข้อความตอบกลับ: ข้อผิดพลาด
*/
content.FEEDBACK_ERROR = 2;

content.View = function AuthView (prop: PropView)
{
  return (
    <StyleView>
      <StyleViewInner>
        {prop.children}
      </StyleViewInner>
    </StyleView>
  );
}
content.ViewForm = function AuthViewForm (prop: PropViewForm)
{
  return (
    <StyleForm $transparent={prop.transparent}>
      {prop.children}
    </StyleForm>
  );
}
content.FormHome = function AuthFormHome ()
{
  return (<></>);
}
content.FormSignInId = function AuthFormSignInId (prop: PropFormSignInId)
{
  const field = react.useRef (HTMLInputElement.prototype);
  const [mode, setMode] = react.useState<ActivityMode> ("hidden");

  const onSubmit = () =>
  {
    if (prop.onSubmit) {
      prop.onSubmit (field.current.value);
    }
  }
  const onSubmitButton = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    onSubmit ();
  }
  const onSubmitInput = (event: react.KeyboardEvent<HTMLInputElement>) =>
  {
    if (event.key === "Enter")
    {
      onSubmit ();
    }
  }
  const onBack = () =>
  {
    if (prop.onBack) {
      prop.onBack (field.current.value);
    }
  }

  react.useEffect (() =>
  {
    if (prop.visibleAnimation == content.ANIM_NONE)
    {
      setMode (prop.visible ? "visible" : "hidden");
      return;
    }
    if (prop.visible) {
      field.current.focus ();
    }
  },
  [prop.visible]);

  return (
    <Activity mode={mode}>
      <content.TemplateHeader
        title={prop.title}
        description={prop.description}
        onBack={prop.onBack ? onBack : undefined}
      />
      <content.TemplateMain>
        <label htmlFor="auth-signin-id">รหัสประจำตัว</label>
        <input id="auth-signin-id" ref={field} autoFocus
          type="text" autoComplete="username webauthn"
          placeholder="อย่างน้อย 2 ตัวอักษร"
          disabled={prop.pending ?? false}
          onKeyUp={onSubmitInput}
        />
        <content.TemplateFeedback
          type={prop.feedback?.type}
          text={prop.feedback?.text}/>
        <button 
          disabled={prop.pending ?? false}
          onClick={onSubmitButton}>ดำเนินการต่อ</button>
        <content.TemplateOption text="ลืมรหัสผ่าน" icon={<RotateCcw/>}/>
        <content.TemplateOption text="สร้างบัญชีใหม่" icon={<UserRoundPlus/>}/>
      </content.TemplateMain>
      <content.TemplateFooter>
        <StyleTempTextBox>
          หากนี้ไม่ใช่อุปกรณ์ของคุณ 
          <span>ให้ใช้งานโหมดไม่ระบุตัวตนของเบราว์เซอร์</span>
          <span>เพื่อเลี่ยงความเสี่ยงการรั่วไหลของข้อมูลของคุณ</span>
        </StyleTempTextBox>
      </content.TemplateFooter>
    </Activity>
  );
}
content.FormSignInPwd = function AuthFormSignInPwd (prop: PropFormSignInPwd)
{
  const field = react.useRef (HTMLInputElement.prototype);
  const [mode, setMode] = react.useState<ActivityMode> ("hidden");

  const onSubmit = () =>
  {
    if (prop.onSubmit) {
      prop.onSubmit (field.current.value);
    }
  }
  const onSubmitButton = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    onSubmit ();
  }
  const onSubmitInput = (event: react.KeyboardEvent<HTMLInputElement>) =>
  {
    if (event.key === "Enter")
    {
      onSubmit ();
    }
  }
  const onBack = () =>
  {
    if (prop.onBack) {
      prop.onBack (field.current.value);
    }
  }

  react.useEffect (() =>
  {
    if (prop.visibleAnimation == content.ANIM_NONE)
    {
      setMode (prop.visible ? "visible" : "hidden");
      return;
    }
    if (prop.visible) {
      field.current.focus ();
    }
  },
  [prop.visible]);

  return (
    <Activity mode={mode}>
      <content.TemplateHeader
        onBack={prop.onBack ? onBack : undefined}
      />
      <content.TemplateMain>
        <label htmlFor="auth-signin-pwd">รหัสผ่าน</label>
        <input id="auth-signin-pwd" ref={field} autoFocus
          type="text" autoComplete="username webauthn"
          placeholder="อย่างน้อย 8 ตัวอักษร"
          disabled={prop.pending ?? false}
          onKeyUp={onSubmitInput}
        />
        <content.TemplateFeedback
          type={prop.feedback?.type}
          text={prop.feedback?.text}/>
        <button 
          disabled={prop.pending ?? false}
          onClick={onSubmitButton}>ดำเนินการต่อ</button>
      </content.TemplateMain>
      <content.TemplateFooter>
        <StyleTempTextBox>
          หากนี้ไม่ใช่อุปกรณ์ของคุณ 
          <span>ให้ใช้งานโหมดไม่ระบุตัวตนของเบราว์เซอร์</span>
          <span>เพื่อเลี่ยงความเสี่ยงการรั่วไหลของข้อมูลของคุณ</span>
        </StyleTempTextBox>
      </content.TemplateFooter>
    </Activity>
  );
}
content.FormSignInTotp = function AuthFormSignInTotp ()
{
  return (<></>);
}
content.FormSignUpEmail = function AuthFormSignUpEmail ()
{
  return (<></>);
}
content.FormSignUpPwd = function AuthFormSignUpPwd ()
{
  return (<></>);
}
content.FormSignUpId = function AuthFormSignUpId ()
{
  return (<></>);
}
content.FormSigned = function AuthFormSigned ()
{
  return (<></>);
}
content.FormSuspended = function AuthFormSuspended ()
{
  return (<></>);
}
content.TemplateHeader = function AuthTempHeader (prop: PropTemplateHeader)
{
  const onBack = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onBack) {
      prop.onBack ();
    }
  }

  return (
    <StyleTempHeader>
      {prop.onBack ?
      <StyleTempHeaderBack onClick={onBack}>
        <ArrowLeft/>
        <span>ย้อนกลับ</span>
      </StyleTempHeaderBack> : <></>}
      <StyleTempHeaderTitle>{prop.title ?? ""}</StyleTempHeaderTitle>
      <StyleTempHeaderDesc>{prop.description ?? ""}</StyleTempHeaderDesc>
    </StyleTempHeader>
  );
}
content.TemplateMain = function AuthTempMain (prop: PropTemplateMain)
{
  return (
    <StyleTempMain>
      {prop.children}
    </StyleTempMain>
  );
}
content.TemplateFooter = function AuthTempFooter (prop: PropTemplateFooter)
{
  return (
    <StyleTempFooter>
      {prop.children}
    </StyleTempFooter>
  );
}
content.TemplateOption = function AuthTempOption (prop: PropTemplateOption)
{
  return (
    <StyleTempOption disabled={prop.disabled ?? false}>
      {
        typeof prop.icon === "string" ? 
          <img src={prop.icon}/> 
          : 
          prop.icon
      }
      <span>{prop.text}</span>
    </StyleTempOption>
  );
}
content.TemplateFeedback = function AuthTempFeedback (
  prop: PropTemplateFeedback
)
{
  return (
    <StyleTempFeedback $color={prop.type ?? content.FEEDBACK_UNDEFINED}>
      {prop.text}
    </StyleTempFeedback>
  );
}

const StyleView = styled.div`
  position: fixed;
  inset: 0px;
`;
const StyleViewInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
`;

const AnimFormOpen = keyframes`
  from { scale: 1.25;}
  to { scale: 1.0; }
`;

const StyleForm = styled.div<{ $transparent ?: boolean; }>`

  width: 512px;
  height: 572px;
  background-color: ${
    prop => prop.$transparent ? 'transparent' : 'var(--bg-primary)'
  };
  border-radius: 8px;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  animation-name: ${AnimFormOpen};
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

const StyleTempHeader = styled.header`
  width: 100%;
  height: 128px;
  padding: 16px 16px 0px 16px;
`;
const StyleTempHeaderBack = styled.button`
  width: 144px;
  font-size: 1rem;
  font-weight: normal;
  text-align: start;

  & > img,
  & > svg
  {
    display: inline-block;
    margin-right: 16px;
    vertical-align: middle;
  }
`;
const StyleTempHeaderTitle = styled.h1`
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
`;
const StyleTempHeaderDesc = styled.p`
  width: 100%;
  font-size: 1rem;
  font-weight: normal;
`;
const StyleTempMain = styled.main`
  width: 100%;
  height: 100%;
  padding: 0px 16px 0px 16px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 8px;
`;

const StyleTempFooter = styled.footer`
  width: 100%;
  height: 128px;
  padding: 0px 16px 16px 16px;
`;

const StyleTempTextBox = styled.p`
  font-size: 1rem;
  margin: 0px 16px 16px 16px;

  @media (max-width: 512px)
  {
    background-color: var(--bg-primary);
    border-radius: 4px;
    padding: 8px;
  }
`;
const StyleTempOption = styled.button`
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
`;
const StyleTempFeedback = styled.p<{ $color: number; }>`
  font-size: 1rem;
  font-weight: normal;
  width: 100%;
  height: 32px;
  color: ${prop => 
    prop.$color === content.FEEDBACK_WARNING ? "var(--text-warning)" :
    prop.$color === content.FEEDBACK_ERROR ? "var(--text-error)" :
    "var(--text-primary)"
  }
`;

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;