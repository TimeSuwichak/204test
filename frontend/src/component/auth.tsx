import react    from "react";
import styled   from "styled-components";
import bg       from "#asset/image/auth.bg.jpg";

import { type Session } from "#util/api.auth.ts";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { keyframes } from "styled-components";


const SignIn = react.lazy (() => import ("#component/auth.signin.tsx"));
const SignUp = react.lazy (() => import ("#component/auth.signup.tsx"));

export type ActivityMode = "visible" | "hidden" | undefined;

/**
 * โครงสร้างคุณสมบัติของส่วนประกอบหลัก
*/
export interface PropContent
{
  /**
   * ระบุสถานะการแสดงผล (แสดง/ซ่อน)
  */
  visible ?: boolean;
  /**
   * ระบุหน้าเริ่มต้น
  */
  page ?: number;
  /**
   * ระบุว่าพื้นหลังควรโปร่งใส่หรือไม่
  */
  transparent ?: boolean;
  /**
   * ข้อความหัวเรื่อง
  */
  title ?: string;
  /**
   * ข้อความอธิบาย
  */
  description ?: string;
  /**
   * ทำงานเมื่อผู้ใช้ทำการลงชื่อเข้าใช้สำเร็จ
  */
  onSignedIn ?: () => void;
  /**
   * ทำงานเมื่อผู้ใช้ทำการสร้างบัญชีสำเร็จ
  */
  onSignedUp ?: () => void;
  /**
   * ทำงานเมื่อผู้ใช้ทำการกดปุ่มยกเลิกการทำงาน
  */
  onCancel ?: () => void;
}
export interface PropView
{
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
}
export interface PropViewForm
{
  transparent ?: boolean;
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
}
export interface PropViewFormPending
{
  /**
   * ระบุสถานะการแสดงผล (แสดง/ซ่อน)
  */
  visible ?: boolean;
}
export interface PropTemplateDiv
{
  /**
   * ระบุสถานะการแสดงผล (แสดง/ซ่อน)
  */
  visible ?: boolean;
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
}
export interface PropTemplateHeader
{
  title ?: string;
  description ?: string;
  onBack ?: () => void;
}
export interface PropTemplateMain
{
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
}
export interface PropTemplateFooter
{
  /**
   * องค์ประกอบย่อยที่อยู่ในภายแท็กดังกล่าว (ถ้ามี)
  */
  children ?: react.ReactNode;
}
export interface PropTemplateOption
{
  icon ?: string | react.JSX.Element;
  text ?: string;
  disabled ?: boolean;
  onClick ?: () => void;
}
export interface PropTemplateFeedback
{
  type ?: number;
  text ?: string;
}



/**
 * ส่วนประกอบแสดงผลแบบหน้าต่าง
*/
const content = function Auth (prop: PropContent)
{
  const page = react.useState (content.PAGE_SIGN_IN_ID);
  const pending = react.useState (false);
  const feedback = react.useState (content.createEmptyFeedback ());
  const session = react.useRef (content.createEmptySession ());
  const id = react.useRef ("");

  return (
    <content.View>
      <content.ViewBackground/>
      <content.ViewForm transparent={prop.transparent ?? false}>
        <content.FormHome/>
        <SignIn
          staPage={page}
          staPending={pending}
          staFeedback={feedback}
          refSession={session}
          refId={id}
          title={prop.title}
          description={prop.description}
          onComplete={prop.onSignedIn}/>
        <SignUp
          staPage={page}
          staPending={pending}
          staFeedback={feedback}
          refSession={session}
          refId={id}
          title={prop.title}
          description={prop.description}/>
        <content.ViewPending visible={pending [0]}/>
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
 * การแสดงผล: หน้าใส่ข้อมูลสร้างบัญชี
*/
content.PAGE_SIGN_UP = 101;
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

content.createEmptyFeedback = () : PropTemplateFeedback =>
{
  return {
    type: content.FEEDBACK_UNDEFINED,
    text: ""
  }
}
content.createEmptySession = () : Session =>
{
  return {
    secret: "",
    issued: Date.prototype,
    expire: Date.prototype
  }
}
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
content.ViewBackground = function AuthViewBackground ()
{
  return (<StyleViewBackground src={bg}/>)
}
content.ViewForm = function AuthViewForm (prop: PropViewForm)
{
  return (
    <StyleForm $transparent={prop.transparent}>
      {prop.children}
    </StyleForm>
  );
}
content.ViewPending = function AuthViewPending (prop: PropViewFormPending)
{
  return (
    <StyleFormPending $visible={prop.visible ?? false}/>
  );
}
content.FormHome = function AuthFormHome ()
{
  return (<></>);
}
content.TemplateDiv = function AuthTempDiv (prop: PropTemplateDiv)
{
  return (
    <StyleTempDiv $visible={prop.visible ?? true}>
      {prop.children}
    </StyleTempDiv>
  );
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
      <StyleTempHeaderTitle>{prop.title ?? ""}</StyleTempHeaderTitle>
      <StyleTempHeaderDesc>{prop.description ?? ""}</StyleTempHeaderDesc>
      {prop.onBack ?
      <StyleTempHeaderBack onClick={onBack}>
        <ArrowLeft/>
        <span>ย้อนกลับ</span>
      </StyleTempHeaderBack> : <></>}
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
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClick) {
      prop.onClick ();
    }
  }

  return (
    <StyleTempOption disabled={prop.disabled ?? false} onClick={onClick}>
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
content.TemplatePrivacyNotice = function AuthTempPrivacyText ()
{
  return (
    <StyleTempPrivacyNotice>
      <ShieldAlert size={24}/>
      หากนี้ไม่ใช่อุปกรณ์ของคุณ 
      <span>ให้ใช้งานโหมดไม่ระบุตัวตนของเบราว์เซอร์</span>
      <span>เพื่อเลี่ยงความเสี่ยงการรั่วไหลของข้อมูลของคุณ</span>
    </StyleTempPrivacyNotice>
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
const StyleViewBackground = styled.img`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 512px)
  {
    opacity: 0.0;
  }
`;

const AnimFormOpen = keyframes`
  from { scale: 1.25;}
  to { scale: 1.0; }
`;

const AnimFormPending = keyframes`
  /* 0% { background-position: 0% 50%; }
  50% { background-position:100% 50%; }
  100% { background-position:0% 50%; } */

  0% { background-position: 100% 100%; }
  100% { background-position: 0% 100%; }
`;

const StyleForm = styled.form<{ $transparent ?: boolean; }>`

  width: 512px;
  height: 572px;
  background-color: ${
    prop => prop.$transparent ? 'transparent' : 'var(--bg-primary)'
  };
  outline: 2px solid ${
    prop => prop.$transparent ? 'transparent' : 'var(--bg-primary-border)'
  };
  border-radius: 8px;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  animation-name: ${AnimFormOpen};
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
`;
const StyleFormPending = styled.div<{ $visible: boolean; }>`
  pointer-events: none;
  position: absolute;
  inset: 0px 0px auto 0px;
  width: 100%;
  height: 8px;
  opacity: ${prop => prop.$visible ? "1.0" : "0.0"};
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

  -webkit-animation: ${AnimFormPending} 1000ms 
    cubic-bezier(0.85, 0, 0.15, 1) infinite;
  -moz-animation: ${AnimFormPending} 1000ms 
    cubic-bezier(0.85, 0, 0.15, 1) infinite;
  animation: ${AnimFormPending} 1000ms 
    cubic-bezier(0.85, 0, 0.15, 1) infinite;
`;
const StyleTempDiv = styled.div<{ $visible: boolean; }>`

  pointer-events: ${prop => prop.$visible ? "all" : "none"};
  position: absolute;
  inset: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 16px;
  opacity: ${prop => prop.$visible ? "1.0" : "0.0"};
  transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1);
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
  background-color: transparent;
  margin: 16px 0px;

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
  font-weight: normal;
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

const StyleTempPrivacyNotice = styled.p`
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
  height: 48px;
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