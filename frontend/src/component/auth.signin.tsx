import react                  from "react";
import styled                 from "styled-components";
import api                    from "#util/api.auth.ts";
import apiFb                  from "#util/api.auth.facebook.ts";
import error                  from "#util/common.error.ts";
import base                   from "#component/auth.tsx";
import { type Session }       from "#util/api.auth.ts";
import { type PropTemplateFeedback } from "#component/auth.tsx";
import 
{ 
  RotateCcw, UserRoundPlus, KeyRound, ShieldUserIcon,
  UserLockIcon
} 
from "lucide-react";

/**
 * โครงสร้างคุณสมบัติของส่วนประกอบหลัก
*/
interface PropRoot
{
  /**
   * ระบุหน้าที่กำลังแสดงผล
  */
  staPage: [number, react.Dispatch<react.SetStateAction<number>>];
  /**
   * ระบุว่าระบบกำลังทำงาน
  */
  staPending: [boolean, react.Dispatch<react.SetStateAction<boolean>>];
  /**
   * ระบุการตอบกลับของระบบ
  */
  staFeedback: [
    PropTemplateFeedback, 
    react.Dispatch<react.SetStateAction<PropTemplateFeedback>>
  ];
  /**
   * ที่อ้างอิงชุดรหัสยืนยัน
  */
  refSession: react.RefObject<Session>;
  /**
   * ที่อ้างอิงข้อมูลรหัสประจำตัว
  */
  refId: react.RefObject<string>;
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
  onComplete ?: () => void;
}
interface PropChallengeId
{
  /**
   * ระบุสถานะการแสดงผล (แสดง/ซ่อน)
  */
  visible ?: boolean;
  /**
   * ข้อความหัวเรื่อง
  */
  title ?: string;
  /**
   * ข้อความอธิบาย
  */
  description ?: string;
  /**
   * ระบุว่าระบบกำลังทำงาน
  */
  pending ?: boolean;
  /**
   * ระบุการตอบกลับของระบบ
  */
  feedback ?: PropTemplateFeedback;
  /**
   * ทำงานเมื่อผู้ใช้ทำการกดปุ่มย้อนกลับ
  */
  onBack ?: (last: string) => void;
  /**
   * ทำงานเมื่อผู้ใช้ทำการกดปุ่มส่งข้อมูล
  */
  onSubmit ?: (value: string) => void;
  onSubmitGoogle ?: () => void;
  onSubmitFacebook ?: () => void;
  onRecovery ?: () => void;
  onCreate ?: () => void;
}
interface PropChallengePassword
{
  /**
   * ระบุสถานะการแสดงผล (แสดง/ซ่อน)
  */
  visible ?: boolean;
  title ?: string;
  description ?: string;
  pending ?: boolean;
  feedback ?: PropTemplateFeedback;
  onSubmit ?: (value: string) => void;
  onBack ?: (last: string) => void;
}
interface PropSuspended
{
  /**
   * ระบุสถานะการแสดงผล (แสดง/ซ่อน)
  */
  visible ?: boolean;
  title ?: string;
  description ?: string;
  pending ?: boolean;
  feedback ?: PropTemplateFeedback;
  onBack ?: () => void;
}

const checkInputId = (input: string) : PropTemplateFeedback | null =>
{
  const compliant = api.checkCompliantId (input);

  if (!compliant.lengthEmpty)
  {
    return {
      type: base.FEEDBACK_WARNING,
      text: "รหัสประจำตัวต้องไม่เว้นว่าง"
    }
  }
  if (!compliant.lengthMin) 
  {
    return {
      type: base.FEEDBACK_WARNING, 
      text: "รหัสประจำตัวต้องยาวอย่างน้อย 2 ตัวอักษร"
    }
  }
  if (!compliant.lengthMax)
  {
    return {
      type: base.FEEDBACK_WARNING, 
      text: "รหัสประจำตัวต้องยาวไม่เกิน 32 ตัวอักษร"
    }
  }
  return null;
}
const checkInputPassword = (input: string) : PropTemplateFeedback | null =>
{
  const compliant = api.checkCompliantPwd (input);

  if (!compliant.lengthEmpty)
  {
    return { 
      type: base.FEEDBACK_WARNING, 
      text: "รหัสผ่านต้องไม่เว้นว่าง" 
    };
  }
  if (!compliant.lengthMin) 
  {
    return { 
      type: base.FEEDBACK_WARNING, 
      text: "รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร" 
    };
  }
  if (!compliant.lengthMax)
  {
    return { 
      type: base.FEEDBACK_WARNING, 
      text: "รหัสผ่านต้องยาวไม่เกิน 32 ตัวอักษร" 
    };
  }
  return null;
}
const checkResponseId = (input: unknown) : PropTemplateFeedback =>
{
  if (input instanceof error.Network) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: 
      `เกิดข้อผิดพลาดทางด้านเครือข่าย โปรดตรวจสอบการเชื่อมต่อเครือข่ายของคุณ` 
    };
  }
  if (input instanceof error.NotAuthorized) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: "ไม่พบบัญชีผู้ใช้งาน โปรดตรวจสอบรหัสประจำตัวของคุณอีกครั้ง" 
    };
  }
  if (input instanceof error.NetworkLimit) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: "ระบบปฏิเสธคำขอของคุณ โปรดรอสักครู่แล้วลองใหม่อีกครั้ง" 
    };
  }
  if (input instanceof error.NotAvailable) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: "ระบบไม่สามารถทำงานได้ในเวลานี้ โปรดลองใหม่อีกครั้งในภายหลัง" 
    };
  }
  return { 
    type: base.FEEDBACK_ERROR, 
    text: "เกิดข้อผิดพลาดบางอย่าง โปรดลองใหม่อีกครั้ง" 
  };
}
const checkResponsePassword = (input: unknown) : PropTemplateFeedback =>
{
  if (input instanceof error.Network) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: 
      `เกิดข้อผิดพลาดทางด้านเครือข่าย โปรดตรวจสอบการเชื่อมต่อเครือข่ายของคุณ` 
    };
  }
  if (input instanceof error.NotFound) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: "ไม่พบบัญชีผู้ใช้งาน โปรดตรวจสอบรหัสประจำตัวของคุณอีกครั้ง" 
    };
  }
  if (input instanceof error.NetworkLimit) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: "ระบบปฏิเสธคำขอของคุณ โปรดรอสักครู่แล้วลองใหม่อีกครั้ง" 
    };
  }
  if (input instanceof error.NotAuthorized)
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: "รหัสผ่านของคุณไม่ถูกต้อง โปรดตรวจสอบแล้วลองใหม่อีกครั้ง" 
    };
  }
  if (input instanceof error.NotAvailable) 
  {
    return { 
      type: base.FEEDBACK_ERROR, 
      text: "ระบบไม่สามารถทำงานได้ในเวลานี้ โปรดลองใหม่อีกครั้งในภายหลัง" 
    };
  }
  return { 
    type: base.FEEDBACK_ERROR, 
    text: "เกิดข้อผิดพลาดบางอย่าง โปรดลองใหม่อีกครั้ง" 
  };
}

/**
 * ส่วนประกอบแสดงผลแบบหน้าต่าง
*/
const content = function AuthSignIn (prop: PropRoot)
{
  const [page, setPage] = prop.staPage;
  const [pending, setPending] =  prop.staPending;
  const [feedback, setFeedback] = prop.staFeedback;
  const id = prop.refId;
  const session = prop.refSession;

  const onTransition = (authStep: number) =>
  {
    switch (authStep)
    {
      case api.STEP_CHALLENGE_ID: setPage (base.PAGE_SIGN_IN_ID); break;
      case api.STEP_CHALLENGE_PASSWORD: setPage (base.PAGE_SIGN_IN_PWD); break;
      case api.STEP_CHALLENGE_TOTP: setPage (base.PAGE_SIGN_IN_TOTP); break;
      case api.STEP_CHALLENGE_SUSPENDED: setPage (base.PAGE_SUSPENDED); break;
      case api.STEP_CHALLENGE_COMPLETED:
        onComplete ();
        break;
    }
  }
  /**
   * ทำงานเมื่อผู้ใช้ทำการลงชื่อเข้าใช้สำเร็จ
  */
  const onComplete = () =>
  {
    const saved = api.saveAdd ({
      name: id.current,
      secret: session.current.secret,
      issued: session.current.issued,
      expired: session.current.expire,
    });
    api.saveSetPrefered (saved);
    api.saveWrite ();

    if (prop.onComplete) {
      prop.onComplete ();
    }
  }
  const onIdRecovery = () =>
  {
    setFeedback ({
      type: base.FEEDBACK_WARNING,
      text: "ขออภัยระบบไม่สามารถใช้งานได้ในขณะนี้"
    });
    setPending (false);
  }
  const onIdCreate = () =>
  {
    id.current = "";
    session.current = base.createEmptySession ();

    setPage (base.PAGE_SIGN_UP);
  }
  const onIdSubmitFacebook = () =>
  {
    setFeedback (base.createEmptyFeedback ());
    setPending (true);

    void apiFb.login ().then ((challenge) =>
    {
      id.current = challenge.fbName;
      session.current = challenge;

      onTransition (challenge.step);
      setPending (false);
    })
    .catch (() =>
    {
      
      setFeedback ({
        type: base.FEEDBACK_WARNING,
        text: "เกิดข้อผิดพลาดบางอย่าง โปรดลองใหม่อีกครั้ง"
      });
      setPending (false);
    });
  }
  const onIdSubmit = (value: string) =>
  {
    setFeedback (base.createEmptyFeedback ());
    setPending (true);

    const invalid = checkInputId (value);

    if (invalid)
    {
      setFeedback (invalid);
      setPending (false);
      return;
    }

    api.challengeId (value).then ((challenge) =>
    {
      id.current = value;
      session.current = challenge;

      onTransition (challenge.step);
      setPending (false);
    })
    .catch ((e: unknown) =>
    {

      console.error (e);

      setFeedback (checkResponseId (e));
      setPending (false);
    });
  }
  const onPasswordSubmit = (value: string) =>
  {
    setFeedback (base.createEmptyFeedback ());
    setPending (true);

    const invalid = checkInputPassword (value);

    if (invalid)
    {
      setFeedback (invalid);
      setPending (false);
      return;
    }

    api.challengePassword (session.current.secret, value).then ((challenge) =>
    {
      session.current = challenge;

      onTransition (challenge.step);
      setPending (false);
    })
    .catch ((e: unknown) =>
    {
      setFeedback (checkResponsePassword (e));
      setPending (false);
    });
  }
  const onPasswordBack = () =>
  {
    id.current = "";
    session.current = base.createEmptySession ();

    setFeedback (base.createEmptyFeedback ());
    setPage (base.PAGE_SIGN_IN_ID);
  }
  const onSuspendBack = () =>
  {
    id.current = "";
    session.current = base.createEmptySession ();

    setFeedback (base.createEmptyFeedback ());
    setPage (base.PAGE_SIGN_IN_ID);
  }

  react.useEffect (() =>
  {
    apiFb.init ();

    return () =>
    {
      apiFb.terminate ();
    }
  },
  []);

  return (
    <react.Activity>
       <content.FormId
          visible={page === base.PAGE_SIGN_IN_ID} 
          title={prop.title} 
          description={prop.description}
          feedback={feedback}
          pending={pending}
          onSubmit={onIdSubmit}
          onSubmitFacebook={onIdSubmitFacebook}
          onRecovery={onIdRecovery}
          onCreate={onIdCreate}/>
        <content.ChallengePassword
          visible={page === base.PAGE_SIGN_IN_PWD} 
          title={prop.title}
          description={prop.description}
          feedback={feedback}
          pending={pending}
          onSubmit={onPasswordSubmit}
          onBack={onPasswordBack}/>
        <content.ChallengeTotp/>
        <content.Signed/>
        <content.Suspended 
          visible={page === base.PAGE_SUSPENDED} 
          title={prop.title}
          description={prop.description}
          feedback={feedback}
          pending={pending}
          onBack={onSuspendBack}/>
    </react.Activity>
  );
}
content.FormId = function AuthFormChallengeId 
  (prop: PropChallengeId)
{
  const field = react.useRef (HTMLInputElement.prototype);

  const onSubmit = () =>
  {
    if (prop.onSubmit && 
        field.current instanceof HTMLInputElement &&
        field.current != HTMLInputElement.prototype) 
    {
      prop.onSubmit (field.current.value);
    }
  }
  const onSubmitButton = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.visible)
    {
      onSubmit ();
    }
  }
  const onSubmitInput = (event: react.KeyboardEvent<HTMLInputElement>) =>
  {
    if (event.key === "Enter")
    {
      event.preventDefault ();
      event.stopPropagation ();

      if (prop.visible)
      {
        onSubmit ();
      }
    }
  }
  const onSubmitGoogle = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onSubmitGoogle) {
      prop.onSubmitGoogle ();
    }
  }
  const onSubmitFacebook = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onSubmitFacebook) {
      prop.onSubmitFacebook ();
    }
  }
  const onRecovery = () =>
  {
    if (prop.onRecovery) {
      prop.onRecovery ();
    }
  }
  const onCreate = () =>
  {
    if (prop.onCreate) {
      prop.onCreate ();
    }
  }
  const onBack = () =>
  {
   if (prop.onBack && 
        field.current instanceof HTMLInputElement &&
        field.current != HTMLInputElement.prototype) 
    {
      prop.onBack (field.current.value);
    }
  }

  react.useEffect (() =>
  {
    if (prop.visible && 
        field.current instanceof HTMLInputElement &&
        field.current != HTMLInputElement.prototype) 
    {
      field.current.focus ();
    }
  },
  [prop.visible]);

  return (
    <base.TemplateDiv visible={prop.visible}>
      <base.TemplateHeader
        title={prop.title}
        description={prop.description}
        onBack={prop.onBack ? onBack : undefined}
      />
      <base.TemplateMain>
        <label htmlFor="auth-signin-id" style={{
          marginBottom: "16px"
        }}>
          <ShieldUserIcon size={24} style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "16px"
          }}/>
          <span>รหัสประจำตัว</span>
        </label>
        <input id="auth-signin-id" ref={field} autoFocus
          type="text" autoComplete="username webauthn"
          placeholder="อย่างน้อย 2 ตัวอักษร"
          disabled={prop.pending ?? false}
          onKeyUp={onSubmitInput}
        />
        <base.TemplateFeedback
          type={prop.feedback?.type}
          text={prop.feedback?.text}/>
        <button 
          disabled={prop.pending ?? false}
          onClick={onSubmitButton}>ดำเนินการต่อ</button>

        <StyleChallengeOption>
          <button 
            disabled={prop.pending ?? false}
            onClick={onSubmitGoogle}>ดำเนินการต่อด้วย Google</button>
          <button 
            disabled={prop.pending ?? false}
            onClick={onSubmitFacebook}>ดำเนินการต่อด้วย Facebook</button>
        </StyleChallengeOption>
        <base.TemplateOption 
          disabled={prop.pending ?? false}
          text="ลืมรหัสผ่าน" 
          icon={<RotateCcw/>}
          onClick={onRecovery}/>
        <base.TemplateOption 
          disabled={prop.pending ?? false}
          text="สร้างบัญชีใหม่" 
          icon={<UserRoundPlus/>}
          onClick={onCreate}/>
      </base.TemplateMain>
      <base.TemplateFooter>
        <base.TemplatePrivacyNotice/>
      </base.TemplateFooter>
    </base.TemplateDiv>
  );
}
content.ChallengePassword = function AuthFormChallengePassword 
  (prop: PropChallengePassword)
{
  const field = react.useRef (HTMLInputElement.prototype);

  const onSubmit = () =>
  {
    if (prop.onSubmit && 
        field.current instanceof HTMLInputElement &&
        field.current != HTMLInputElement.prototype) 
    {
      prop.onSubmit (field.current.value);
    }
  }
  const onSubmitButton = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.visible)
    {
      onSubmit ();
    }
  }
  const onSubmitInput = (event: react.KeyboardEvent<HTMLInputElement>) =>
  {
    if (event.key === "Enter")
    {
      event.preventDefault ();
      event.stopPropagation ();

      if (prop.visible)
      {
        onSubmit ();
      }
    }
  }
  const onBack = () =>
  {
    if (prop.onBack && 
        field.current instanceof HTMLInputElement &&
        field.current != HTMLInputElement.prototype) 
    {
      prop.onBack (field.current.value);
    }
  }

  react.useEffect (() =>
  {
    if (prop.visible && 
        field.current instanceof HTMLInputElement &&
        field.current != HTMLInputElement.prototype) 
    {
      field.current.focus ();
    }
  },
  [prop.visible]);

  return (
    <base.TemplateDiv visible={prop.visible}>
      <base.TemplateHeader
        title={prop.title}
        description={prop.description}
        onBack={prop.onBack ? onBack : undefined}
      />
      <base.TemplateMain>

        <label htmlFor="auth-signin-pwd" style={{
          marginBottom: "16px"
        }}>
          <KeyRound size={24} style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "16px"
          }}/>
          <span>รหัสผ่าน</span>
        </label>
        <input id="auth-signin-pwd" ref={field} autoFocus
          type="password" autoComplete="current-password webauthn"
          placeholder="อย่างน้อย 8 ตัวอักษร"
          disabled={prop.pending ?? false}
          onKeyUp={onSubmitInput}
        />
        {/* <div>
          <input id="auth-signin-pwd-show" type="checkbox"/>
          <label htmlFor="auth-signin-pwd-show">แสดงรหัสผ่าน</label>
        </div> */}

        <base.TemplateFeedback
          type={prop.feedback?.type}
          text={prop.feedback?.text}/>
        <button 
          disabled={prop.pending ?? false}
          onClick={onSubmitButton}>ดำเนินการต่อ</button>
      </base.TemplateMain>
      <base.TemplateFooter>
        <base.TemplatePrivacyNotice/>
      </base.TemplateFooter>
    </base.TemplateDiv>
  );
}
content.ChallengeTotp = function AuthFormChallengeTotp ()
{
  return (<></>);
}
content.Signed = function AuthFormSigned ()
{
  return (<></>);
}
content.Suspended = function AuthFormSuspended (prop: PropSuspended)
{
  const onBack = () =>
  {
    if (prop.onBack)
    {
      prop.onBack ();
    }
  }

  return (
    <base.TemplateDiv visible={prop.visible}>
      <base.TemplateHeader
        title={prop.title}
        description={prop.description}
        onBack={prop.onBack ? onBack : undefined}
      />
      <base.TemplateMain>
        <div style={{ 
          display: "flex", flexDirection: "column",
          gap: "16px", color: "var(--text-primary)",
          alignItems: "center", justifyContent: "center",
          textAlign: "center"
        }}>
          <UserLockIcon size={64}/>
          <p>บัญชีของคุณถูกระงับการใช้งาน</p>
          <p>
            สิ่งนี้อาจเกิดขึ้นจากการละเมิดนโยบายของแพลตฟอร์ม
            หากคุณคิดว่าสิ่งนี้เป็นการเข้าผิดให้ทำการติดต่อผู้ดูแลระบบ
          </p>
        </div>
        <base.TemplateFeedback
          type={prop.feedback?.type}
          text={prop.feedback?.text}/>
      </base.TemplateMain>
      <base.TemplateFooter>
        <base.TemplatePrivacyNotice/>
      </base.TemplateFooter>
    </base.TemplateDiv>
  );
}
const StyleChallengeOption = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;

  & > button
  {
    background-color: transparent;
    border: 2px solid;
    flex-grow: 1;
  }
  & > button:nth-child(1)
  {
    border-color: #3bc293;
  }
  & > button:nth-child(2)
  {
    border-color: #2f6aea;
  }
  & > button:nth-child(1):hover,
  & > button:nth-child(1):focus
  {
    background-color: #3bc293;
  }
  & > button:nth-child(2):hover,
  & > button:nth-child(2):focus
  {
    background-color: #2f6aea;
  }
`;

/**
 * ส่งออกตัวแปร
*/
export default content;