import react      from "react";
import styled     from "styled-components";
import MenuBar    from "#component/menu.bar.tsx";
import ApiAccount from "#util/api.account.ts";
import ApiStorage from "#util/api.storage.ts";

import { useState, useEffect, useRef, useCallback } 
from "react";

import {
  UserIcon, UserLock, Container, ArrowLeftCircleIcon, XIcon,
  UserCircleIcon
} from "lucide-react";
import { 
  type ChangeEvent, type MouseEvent 
} from "react";
import { useAuth } from "#context/common.ts";
import { useDialog, useSettings, useToast } from "#context/common.ui.ts";
import { useAccountBasic, useAccountContact } from "#context/customer.ts";

interface PropRoot
{
  visible ?: boolean;
  transparent ?: boolean;
  width ?: string;
  widthMax ?: string;
  height ?: string;
  heightMax ?: string;
  onClose ?: () => void;
}
interface PropView
{
  transparent ?: boolean;
  width ?: string;
  widthMax ?: string;
  height ?: string;
  heightMax ?: string;

  container ?: react.Ref<HTMLDivElement> | undefined;
  children ?: react.ReactNode;
}
interface PropMenu
{
  content ?: [number, react.Dispatch<react.SetStateAction<number>>];
  visible ?: boolean;
  width ?: string;
  widthMax ?: string;
}
interface PropContent
{
  visible ?: boolean;
  content ?: number;
  onBack ?: () => void;
}
interface PropContentGeneral
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropContentSecurity
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropContentShipping
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropContentPayment
{
  visible ?: boolean;
  onBack ?: () => void;
}
interface PropTemplateBackButton
{
  visible ?: boolean;
  onClick ?: () => void;
}

/**
 * องค์ประกอบแสดงผลหน้าการตั้งค่า
*/
const content = function Settings (prop: PropRoot)
{
  return (<content.Root
    visible={prop.visible}
    transparent={prop.transparent}
    width={prop.width}
    widthMax={prop.widthMax}
    height={prop.height}
    heightMax={prop.heightMax}
  />);
}
content.Root = function SettingsRoot (prop: PropRoot)
{
  const SIZE_SMALL = "256px";
  const SIZE_THEREHOLD = 768;
  const container = react.useRef<HTMLDivElement> (HTMLDivElement.prototype);

  /**
   * รับค่าความกว้างของรายการเมนู
  */
  const resizeValue = useCallback (() =>
  {
    if (container.current instanceof HTMLDivElement &&
        container.current != HTMLDivElement.prototype)
    {
      return (container.current.clientWidth) >= 
        SIZE_THEREHOLD ? SIZE_SMALL : "100%";
    }
    return (window.innerWidth) >= 
      SIZE_THEREHOLD ? SIZE_SMALL : "100%";
  }, 
  [container]);

  const visible = prop.visible ?? false;
  const [ctn, setCtn] = useState (content.CONTENT_GENERAL);
  const [menuWidth, setMenuWidth] = useState (resizeValue ());
  const [menuSelected, setMenuSelected] = useState (false);

  
  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มปิด
  */
  const onClose = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClose) {
      prop.onClose ();
    }
  }
  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มย้อนกลับ
  */
  const onBack = () =>
  {
    setMenuSelected (false);
  }
  /**
   * ทำงานเมื่อขนาดหน้าต่างมีการเปลี่ยนแปลง
  */
  const onResize = useCallback (() =>
  {
    setMenuWidth (resizeValue ());
  }, 
  [resizeValue]);
    
  /**
   * ทำงานเมื่อส่วนประกอบนี้เริ่มทำงาน
  */
  useEffect (() =>
  {
    window.addEventListener ("resize", onResize);

    return () =>
    {
      window.removeEventListener ("resize", onResize);
    }
  },
  [onResize]);

  return (
    <react.Activity mode={visible ? "visible" : "hidden"}>
      <content.View 
          transparent={prop.transparent} 
          width={prop.width}
          widthMax={prop.widthMax}
          height={prop.height}
          heightMax={prop.heightMax}
          container={container}>
        <content.Menu 
          visible={menuWidth === SIZE_SMALL ? true : !menuSelected}
          width={"100%"}
          widthMax={menuWidth}
          content={[ctn, (x) => { 
            setCtn (x);
            setMenuSelected (true);
          }]}/>
        <content.Content 
          visible={menuWidth === SIZE_SMALL ? true : menuSelected}
          content={ctn}
          onBack={menuWidth === SIZE_SMALL ? undefined : onBack}
        />
        <StyleBack 
          $visible={prop.onClose ? true : false} 
          onClick={onClose}>
          <XIcon/>
        </StyleBack>
      </content.View>
    </react.Activity>
  );
}
content.View = function SettingsView (prop: PropView)
{
  const transparent = prop.transparent ?? true;
  const width = prop.width ?? "100%";
  const widthMax = prop.widthMax ?? "1024px";
  const height = prop.height ?? "100%";
  const heightMax = prop.heightMax ?? "512px";

  return (
    <StyleRoot ref={prop.container}
      $transparent={transparent}
      $width={width}
      $widthMax={widthMax}
      $height={height}
      $heightMax={heightMax}>
      {prop.children}
    </StyleRoot>
  );
}
/**
 * องค์ประกอบแสดงรายการเมนูนำทาง
*/
content.Menu = function SettingsMenu (prop: PropMenu)
{
  /**
   * ทำงานเมื่อผู้ใช้กดเลือกรายการ
  */
  const selectEvent = (value: unknown) =>
  {
    if (prop.content)
    {
      prop.content[1] (value as number);
    }
  }
  const visible = prop.visible ?? true;
  const width = prop.width ?? "100%";
  const widthMax = prop.widthMax ?? "256px";
  
  return (
    <MenuBar 
        visible={visible}
        direction="column" 
        width={width} widthMax={widthMax} height="100%" 
        align="start" selected={1}
        margin={prop.widthMax != "100%" ? "0px 32px 0px 0px" : "0px"}
        onClick={selectEvent}>
      <MenuBar.Heading text="การตั้งค่า"/>
      <MenuBar.Item value={content.CONTENT_GENERAL} 
        text="ทั่วไป" icon={<UserIcon/>}/>
      <MenuBar.Item value={content.CONTENT_SECURITY} 
        text="ความปลอดภัย" icon={<UserLock/>}/>
      <MenuBar.Item value={content.CONTENT_SHIPPING} 
        text="การจัดส่ง" icon={<Container/>}/>
      {/* <MenuBar.Item value={content.CONTENT_PAYMENT} 
        text="การชำระเงิน" icon={<Coins/>}/> */}
    </MenuBar>
  );
}
/**
 * ส่วนประกอบสำหรับการแสดงเนื้อหา
*/
content.Content = function SettingsContent (prop: PropContent)
{
  const visible = prop.visible ?? true;
  const current = prop.content ?? 0;
  const isGeneral = visible && current === content.CONTENT_GENERAL;
  const isSecurity = visible && current === content.CONTENT_SECURITY;
  const isShipping = visible && current === content.CONTENT_SHIPPING;
  const isPayment = visible && current === content.CONTENT_PAYMENT;
  const onBack = prop.onBack;

  return (
    <StyleContent>
      <content.ContentGeneral visible={isGeneral} onBack={onBack}/>
      <content.ContentSecurity visible={isSecurity} onBack={onBack}/>
      <content.ContentShipping visible={isShipping} onBack={onBack}/>
      <content.ContentPayment visible={isPayment} onBack={onBack}/>
    </StyleContent>
  );
}
content.ContentGeneral = function SettingsContentGeneral
  (prop: PropContentGeneral) : react.ReactElement
{
  const auth = useAuth ();
  const toast = useToast ();
  const iconInput = useRef (HTMLInputElement.prototype);
  const [dialog] = useDialog ();
  const [pending, setPending] = useState (false);

  const queryBasic = useAccountBasic ();
  const queryContact = useAccountContact ();

  /**
   * ทำงานเมื่อผู้ใช้กดเปลี่ยนรูป
  */
  const onIconChange = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (iconInput.current instanceof HTMLInputElement && 
        iconInput.current != HTMLInputElement.prototype)
    {
      iconInput.current.click ();
    }
  }
  /**
   * ทำงานเมื่อผู้ใช้เลือกรูปเรียบร้อยแล้ว
  */
  const onIconChangeSubmit = (event: ChangeEvent<HTMLInputElement>) =>
  {
      event.preventDefault ();
      event.stopPropagation ();
      setPending (true);

      if (!event.target.files) {
        return;
      }
      const file = event.target.files [0];

      void ApiAccount.updateBasic (auth.session, 
      {
        icon: file
      })
      .then (() => queryBasic.refetch ()).then (() =>
      {
          toast.setText ("เปลี่ยนรูปโปรไฟล์ใหม่เรียบร้อย");
          toast.setDuration (5000);
          toast.setVisible (true);
          setPending (false);
      })
      .catch (() =>
      {
        dialog.reset ();
        dialog.setTitle ("เกิดข้อผิดพลาด");
        dialog.setMessage ("เกิดข้อผิดพลาดในการเปลี่ยนรูปโปรไฟล์ กรุณาลองใหม่อีกครั้ง");
        dialog.setPrimary ("เข้าใจแล้ว", () =>
        {
          dialog.setVisible (false);
        });
        dialog.setVisible (true);
        setPending (false);
      });
  }
  const onNameChange = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();
  }
  const onEmailChange = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();
  }
  const onWillSignOut = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();
  }

  const basic = queryBasic.data;
  const contact = queryContact.data;
  const icon = basic ? ApiStorage.getUrlStream (basic.icon) : "";
  const name = basic ? basic.name : "";
  const email = contact ? contact.email : "";

  return (
    <react.Activity mode={prop.visible ? "visible" : "hidden"}>
      <input 
        disabled={pending}
        type="file" style={{ display: "none" }} ref={iconInput}
        onChange={onIconChangeSubmit}
        accept="image/png, image/jpeg"
        multiple={false}/>
      <content.TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <StyleTemplateHeader>ข้อมูลบัญชี</StyleTemplateHeader>
      <StyleGeneralIcon>
        { (icon.length > 0) ?
          (<img src={icon}/>) :
          (<UserCircleIcon/>)
        }
        <StyleGeneralIconAction>
          <button 
            disabled={pending}
            onClick={onIconChange}>เปลี่ยนรูป</button>
        </StyleGeneralIconAction>
      </StyleGeneralIcon>
      <StyleTemplateField>
        <div>
          <label>ชื่อผู้ใช้</label>
        </div>
        <div>
          <label>{name}</label>
          <button 
            disabled={pending}
            onClick={onNameChange}>เปลี่ยนชื่อ</button>
        </div>
      </StyleTemplateField>
      <StyleTemplateField>
        <div>
          <label>อีเมล</label>
        </div>
        <div>
          <label>{email}</label>
          <button disabled={pending} onClick={onEmailChange}>
            { (email.length > 0) ?
              ("เปลี่ยนอีเมล") : ("เพิ่มอีเมล")
            }
          </button>
        </div>
      </StyleTemplateField>
      <StyleTemplateField>
        <div>
          <button 
            disabled={pending} 
            onClick={onWillSignOut}>ลงชื่อออก</button>
        </div>
      </StyleTemplateField>
    </react.Activity>
  );
}
content.ContentSecurity = function SettingsContentSecurity
  (prop: PropContentSecurity) : react.ReactElement
{
  return (
    <react.Activity mode={prop.visible ? "visible" : "hidden"}>
      <content.TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <StyleTemplateHeader>ความปลอดภัย</StyleTemplateHeader>
      <StyleTemplateField>
        <div>
          <label>รหัสผ่าน</label>
        </div>
        <div>
          <button>เปลี่ยน</button>
        </div>
      </StyleTemplateField>
      <StyleTemplateField>
        <div>
          <label>ยืนยันสองชั้นด้วย รหัสผ่านใช้ครั้งเดียวแบบกำหนดเวลา</label>
        </div>
        <div>
          <button>เปิด</button>
        </div>
      </StyleTemplateField>
      <StyleTemplateField>
        <div>
          <label>ยืนยันสองชั้นด้วย อีเมล</label>
        </div>
        <div>
          <button>เปิด</button>
        </div>
      </StyleTemplateField>
    </react.Activity>
  );
}
content.ContentShipping = function SettingsContentShipping
  (prop: PropContentShipping) : react.ReactElement
{
  const queryContact = useAccountContact ();
  const contact = queryContact.data;

  const address = contact ? contact.address : "";
  const receiver = "";
  const phone = contact ? contact.phone : "";

  return (
    <react.Activity mode={prop.visible ? "visible" : "hidden"}>
      <content.TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <StyleTemplateHeader>การจัดส่ง</StyleTemplateHeader>
      <p style={{
        padding: '16px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '4px',
        marginBottom: '8px'
      }}>
        ชุดข้อมูลนี้จะเป็นข้อมูลเริ่มต้นเมื่อคุณดำเนินการชำระเงิน
      </p>
      <StyleTemplateField>
        <div>
          <label>ที่อยู่เริ่มต้น</label>
          <br/>
          <label>{address}</label>
        </div>
        <div>
          <button>
            {address.length > 0 ? "แก้ไข" : "เพิ่ม"}
          </button>
        </div>
      </StyleTemplateField>
      <StyleTemplateField>
        <div>
          <label>ชื่อผู้รับ</label>
          <br/>
          <label>{receiver}</label>
        </div>
        <div>
          <button>
            {receiver.length > 0 ? "แก้ไข" : "เพิ่ม"}
          </button>
        </div>
      </StyleTemplateField>
      <StyleTemplateField>
        <div>
          <label>เบอร์โทรศัพท์</label>
          <br/>
          <label>{phone}</label>
        </div>
        <div>
          <button>
            {phone.length > 0 ? "แก้ไข" : "เพิ่ม"}
          </button>
        </div>
      </StyleTemplateField>
      {/* <StyleTemplateHeader2>รายการบันทึกที่อยู่</StyleTemplateHeader2>
      <StyleTemplateField>
        <div>
          <button>เพิ่มที่อยู่</button>
        </div>
      </StyleTemplateField> */}
    </react.Activity>
  );
}
content.ContentPayment = function SettingsContentPayment 
  (prop: PropContentPayment) : react.ReactElement
{
  return (
    <react.Activity mode={prop.visible ? "visible" : "hidden"}>
      <content.TemplateBackButton 
        visible={prop.onBack != undefined} 
        onClick={prop.onBack}/>
      <StyleTemplateHeader>การชำระเงิน</StyleTemplateHeader>
      <StyleTemplateField>
        <div>
          <label>วิธีเริ่มต้น</label>
          <br/>
          <label>0000-0000-0000-0000</label>
        </div>
        <div>
          <button>เลือก</button>
        </div>
      </StyleTemplateField>
      <StyleTemplateHeader2>รายการบันทึกที่อยู่</StyleTemplateHeader2>
      <StyleTemplateField>
        <div>
          <button>เพิ่ม</button>
        </div>
      </StyleTemplateField>
    </react.Activity>
  );
}
content.Provider = function SettingsProvider ()
{
  const ctx = useSettings ();
  const onClose = react.useRef<(() => void)> (undefined);
  const [visible, setVisible] = react.useState (false);

  react.useEffect (() =>
  {
    ctx.setVisible = (value) => { setVisible (value); }
    ctx.setClose = (value) => { onClose.current = value; }

    return () =>
    {
      ctx.setClose = () => { return; }
      ctx.setVisible = () => { return; }
    }
  },
  []);

  return (
    <StyleProvider $visible={visible}>
      <content.Root 
        visible={visible}
        transparent={false}
        onClose={onClose.current}/>
    </StyleProvider>
  );
}

content.TemplateBackButton = function SettingsTemplateBackButton 
  (prop: PropTemplateBackButton) : react.ReactElement
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
    <StyleTemplateBackButton onClick={onClick} $visible={prop.visible ?? false}>
      <ArrowLeftCircleIcon/>
      ย้อนกลับ
    </StyleTemplateBackButton>
  );
}

content.CONTENT_UNDEFINED = 0;
content.CONTENT_GENERAL = 1;
content.CONTENT_SECURITY = 2;
content.CONTENT_SHIPPING = 3;
content.CONTENT_PAYMENT = 4;

const StyleRoot = styled.div<{ 
  $transparent: boolean; 
  $width: string;
  $widthMax: string;
  $height: string;
  $heightMax: string;
}>`
  background-color: ${prop => prop.$transparent ? 
    "transparent" : "var(--bg-primary)"};
  border-radius: 8px;
  width: ${prop => prop.$width};
  height: ${prop => prop.$height};
  max-width: ${prop => prop.$widthMax};
  max-height: ${prop => prop.$heightMax};
  
  padding: 16px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
`;
const StyleBack = styled.button<{ $visible: boolean; }>`
  width: 32px;
  height: 32px;
  border: none;
  position: absolute;
  inset: 16px 16px auto auto;
  margin: 0px;
  padding: 0px;
  display: ${prop => prop.$visible ? "block" : "none"};

  & > img, & > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
  }
`;
const StyleContent = styled.div`
  flex-grow: 1;
`;
const StyleProvider = styled.div<{ $visible: boolean; }>`
  position: fixed;
  pointer-events: ${prop => prop.$visible ? "all" : "hidden"};
  inset: 0px;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  overscroll-behavior: none;
  padding: 16px;

  background-color: rgba(0,0,0,0.5);
  display: ${prop => prop.$visible ? "flex" : "none"};
  align-items: center;
  justify-content: center;
`;

const StyleGeneralIcon = styled.div`
  width: 100%;
  min-height: 160px;
  max-height: 160px;
  position: relative;

  background-color: var(--bg-secondary);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 8px;

  & > img,
  & > svg
  {
    display: block;
    min-width: 128px;
    min-height: 128px;
    max-width: 128px;
    max-height: 128px;
    border-radius: 100%;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
`;
const StyleGeneralIconAction = styled.div`
  position: absolute;
  inset: 16px 16px 16px 192px;

  & > button
  {
    display: block;
    width: 128px;
    margin-bottom: 4px;
  }
`;

const StyleTemplateHeader = styled.h1`
  font-size: 2rem;
  font-weight: normal;
  margin: 0px 0px 16px 0px;
`;
const StyleTemplateHeader2 = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 16px 0px 16px 0px;
`;
const StyleTemplateField = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: 48px;

  @media (max-width: 768px) 
  {
    min-height: 48px;
    height: auto;
  }

  & > div:nth-child(1)
  {
    width: 100%;
    flex-grow: 1;
    /* background-color: var(--bg-secondary); */
  }
  & > div:nth-child(2)
  {
    display: inline-flex;
    align-items: center;
    justify-content: end;
    width: 100%;
    max-width: 324px;
    gap: 16px;
  }
  & > div:nth-child(2) > button
  {
    width: 128px;
  }
`;
const StyleTemplateBackButton = styled.button<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
  width: 192px;
  height: 40px;
  background-color: transparent;
  text-align: start;

  & > img,
  & > svg
  {
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 16px;
  }
`;

/**
 * ส่งออกตัวแปร
*/
export default content;