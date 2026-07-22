import react                  from "react";
import api                    from "#util/api.auth.ts";
import error                  from "#util/common.error.ts";
import base                   from "#component/auth.tsx";
import { type Session }       from "#util/api.auth.ts";
import { type PropTemplateFeedback } from "#component/auth.tsx";
import 
{ 
  UserIcon,
  KeyRound,
  Mail
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
interface PropCreate
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
  onBack ?: () => void;
  /**
   * ทำงานเมื่อผู้ใช้ทำการกดปุ่มส่งข้อมูล
  */
  onSubmit ?: (name: string, pwd: string, email: string) => void;
}
const content = function AuthSignUp (prop: PropRoot)
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

  const onCreateSubmit = (name: string, password: string, email: string) =>
  {
    void name;
    void password;
    void email;
  }
  const onCreateCancel = () =>
  {
    setFeedback (base.createEmptyFeedback ());
    setPending (false);
    setPage (base.PAGE_SIGN_IN_ID);
  }


  return (
    <react.Activity>
       <content.Create
          visible={page === base.PAGE_SIGN_UP} 
          title={prop.title} 
          description={prop.description}
          feedback={feedback}
          pending={pending}
          onSubmit={onCreateSubmit}
          onBack={onCreateCancel}/>
    </react.Activity>
  );
}
content.Create = function AuthFormCreate (prop: PropCreate)
{
  const name = react.useRef (HTMLInputElement.prototype);
  const password = react.useRef (HTMLInputElement.prototype);
  const email = react.useRef (HTMLInputElement.prototype);

  const onSubmit = () =>
  {
    return;
  }
  const onSubmitButton = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    onSubmit ();
  }

  return (
    <base.TemplateDiv visible={prop.visible}>
      <base.TemplateHeader
        title={prop.title}
        description={prop.description}
        onBack={prop.onBack}
      />
      <base.TemplateMain>

        <label htmlFor="auth-signup-name" style={{
          marginBottom: "8px"
        }}>
          <UserIcon size={24} style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "16px"
          }}/>
          <span>ชื่อผู้ใช้</span>
        </label>
        <input id="auth-signup-pwd" ref={name} autoFocus
          type="text" autoComplete="username webauthn"
          placeholder="อย่างน้อย 2 ตัวอักษร"
          disabled={prop.pending ?? false}
          style={{ marginBottom: "8px" }}
        />
        <label htmlFor="auth-signup-pwd" style={{
          marginBottom: "8px"
        }}>
          <KeyRound size={24} style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "16px"
          }}/>
          <span>รหัสผ่าน</span>
        </label>
        <input id="auth-signup-pwd" ref={password} autoFocus
          type="password" autoComplete="new-password webauthn"
          placeholder="อย่างน้อย 8 ตัวอักษร"
          disabled={prop.pending ?? false}
          style={{ marginBottom: "8px" }}
        />
        <label htmlFor="auth-signup-pwd" style={{
          marginBottom: "8px"
        }}>
          <Mail size={24} style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "16px"
          }}/>
          <span>อีเมล</span>
        </label>
        <input id="auth-signup-pwd" ref={email} autoFocus
          type="email" autoComplete="email"
          placeholder=""
          disabled={prop.pending ?? false}
          style={{ marginBottom: "8px" }}
        />

        <base.TemplateFeedback
          type={prop.feedback?.type}
          text={prop.feedback?.text}/>
        <button 
          disabled={prop.pending ?? false}
          onClick={onSubmitButton}>ดำเนินการต่อ</button>
      </base.TemplateMain>
    </base.TemplateDiv>
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