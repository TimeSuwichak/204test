import react from "react";
import styled, { keyframes } from "styled-components";
import {
    X, User, Phone, Mail, MapPin, Home, Building2,
    QrCode, ShieldCheck, Copy, Check, ChevronRight,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/
type Props = {
    open:      boolean;
    total?:    number;
    orderId?:  string;
    onClose:   () => void;
    onConfirm?: (payload: CheckoutPayload) => void;
};

export type CheckoutPayload = {
    name:     string;
    phone:    string;
    email:    string;
    address:  string;
    city:     string;
    province: string;
    zip:      string;
    note:     string;
    method:   "promptpay" | "bank";
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
| Two-step modal:
|   1. Address & contact form
|   2. QR payment (PromptPay-style) + confirm
*/
const content = function CheckoutModal ({
    open,
    total    = 4230,
    orderId  = "GS-2026-" + Math.floor(100000 + Math.random() * 900000),
    onClose,
    onConfirm,
}: Props)
{
    const [step, setStep]       = react.useState<1 | 2>(1);
    const [method, setMethod]   = react.useState<"promptpay" | "bank">("promptpay");
    const [copied, setCopied]   = react.useState(false);
    const [form, setForm] = react.useState({
        name: "", phone: "", email: "",
        address: "", city: "", province: "", zip: "", note: "",
    });

    react.useEffect(() => {
        if (!open) { setStep(1); setCopied(false); }
    }, [open]);

    react.useEffect(() => {
        function onKey (e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    function set (k: keyof typeof form) {
        return (e: react.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm(f => ({ ...f, [k]: e.target.value }));
    }

    function goPay (e: react.FormEvent) {
        e.preventDefault();
        // Minimal presence check — no external validation lib in this refined preview.
        if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return;
        setStep(2);
    }

    function confirm () {
        onConfirm?.({ ...form, method });
        onClose();
    }

    // Encode order info into a QR (uses a public renderer for preview only).
    const qrPayload = encodeURIComponent(
        `PromptPay|order=${orderId}|amount=${total}|to=GameStore`
    );
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${qrPayload}`;

    async function copyOrder () {
        try {
            await navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { /* noop */ }
    }

    return (
        <Backdrop onMouseDown={onClose}>
            <Modal onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
                <Header>
                    <HeadLeft>
                        <Eyebrow>Checkout</Eyebrow>
                        <Title>{step === 1 ? "ข้อมูลจัดส่งและติดต่อ" : "ชำระเงินผ่าน QR"}</Title>
                    </HeadLeft>
                    <CloseBtn onClick={onClose} aria-label="ปิด"><X size={18}/></CloseBtn>
                </Header>

                <Steps>
                    <Step $on={step >= 1}>
                        <StepDot $on={step >= 1}>1</StepDot>
                        <StepLabel>ที่อยู่</StepLabel>
                    </Step>
                    <StepBar $on={step >= 2}/>
                    <Step $on={step >= 2}>
                        <StepDot $on={step >= 2}>2</StepDot>
                        <StepLabel>ชำระเงิน</StepLabel>
                    </Step>
                </Steps>

                {step === 1 && (
                    <Form onSubmit={goPay}>
                        <Row>
                            <Field>
                                <FieldIcon><User size={14}/></FieldIcon>
                                <FieldInput required placeholder="ชื่อ-นามสกุล" value={form.name} onChange={set("name")}/>
                            </Field>
                            <Field>
                                <FieldIcon><Phone size={14}/></FieldIcon>
                                <FieldInput required placeholder="เบอร์โทรศัพท์" value={form.phone} onChange={set("phone")}/>
                            </Field>
                        </Row>

                        <Field>
                            <FieldIcon><Mail size={14}/></FieldIcon>
                            <FieldInput type="email" placeholder="อีเมล (สำหรับใบเสร็จ)" value={form.email} onChange={set("email")}/>
                        </Field>

                        <Field>
                            <FieldIcon><Home size={14}/></FieldIcon>
                            <FieldInput required placeholder="ที่อยู่ (บ้านเลขที่ ถนน ซอย)" value={form.address} onChange={set("address")}/>
                        </Field>

                        <Row>
                            <Field>
                                <FieldIcon><Building2 size={14}/></FieldIcon>
                                <FieldInput placeholder="แขวง / เขต / อำเภอ" value={form.city} onChange={set("city")}/>
                            </Field>
                            <Field>
                                <FieldIcon><MapPin size={14}/></FieldIcon>
                                <FieldInput placeholder="จังหวัด" value={form.province} onChange={set("province")}/>
                            </Field>
                            <Field style={{ maxWidth: 140 }}>
                                <FieldIcon><MapPin size={14}/></FieldIcon>
                                <FieldInput placeholder="รหัสไปรษณีย์" value={form.zip} onChange={set("zip")} maxLength={5}/>
                            </Field>
                        </Row>

                        <FieldTextArea
                            placeholder="หมายเหตุถึงร้านค้า (ถ้ามี)"
                            value={form.note}
                            onChange={set("note")}
                            rows={3}
                        />

                        <MethodBlock>
                            <MethodTitle>วิธีชำระเงิน</MethodTitle>
                            <MethodGrid>
                                <Method $on={method === "promptpay"} onClick={() => setMethod("promptpay")} type="button">
                                    <QrCode size={16}/>
                                    <span>PromptPay QR</span>
                                </Method>
                                <Method $on={method === "bank"} onClick={() => setMethod("bank")} type="button">
                                    <ShieldCheck size={16}/>
                                    <span>โอนธนาคาร</span>
                                </Method>
                            </MethodGrid>
                        </MethodBlock>

                        <Footer>
                            <Ghost type="button" onClick={onClose}>ยกเลิก</Ghost>
                            <Primary type="submit">
                                <span>ดำเนินการต่อ</span>
                                <ChevronRight size={16}/>
                            </Primary>
                        </Footer>
                    </Form>
                )}

                {step === 2 && (
                    <Pay>
                        <QrCard>
                            <QrFrame>
                                <img src={qrSrc} alt="QR สำหรับชำระเงิน" width={220} height={220}/>
                            </QrFrame>
                            <QrHint>
                                <QrCode size={14}/>
                                <span>สแกน QR ด้วยแอปธนาคารเพื่อชำระเงิน</span>
                            </QrHint>
                        </QrCard>

                        <PayInfo>
                            <PayRow>
                                <PayLabel>หมายเลขคำสั่งซื้อ</PayLabel>
                                <PayValueRow>
                                    <PayValue>{orderId}</PayValue>
                                    <CopyBtn onClick={copyOrder} type="button" aria-label="คัดลอกหมายเลข">
                                        {copied ? <Check size={14}/> : <Copy size={14}/>}
                                    </CopyBtn>
                                </PayValueRow>
                            </PayRow>
                            <PayRow>
                                <PayLabel>ยอดชำระ</PayLabel>
                                <PayAccent>{total.toLocaleString()} ฿</PayAccent>
                            </PayRow>
                            <PayRow>
                                <PayLabel>ผู้รับ</PayLabel>
                                <PayValue>GameStore Co., Ltd.</PayValue>
                            </PayRow>
                            <PayRow>
                                <PayLabel>ที่อยู่จัดส่ง</PayLabel>
                                <PayValue style={{ textAlign: "right", maxWidth: 240 }}>
                                    {[form.name, form.address, form.city, form.province, form.zip].filter(Boolean).join(" · ") || "—"}
                                </PayValue>
                            </PayRow>

                            <Note>
                                <ShieldCheck size={14}/>
                                <span>เมื่อชำระเรียบร้อย ระบบจะยืนยันคำสั่งซื้อภายในไม่กี่นาที</span>
                            </Note>
                        </PayInfo>

                        <Footer>
                            <Ghost type="button" onClick={() => setStep(1)}>ย้อนกลับ</Ghost>
                            <Primary type="button" onClick={confirm}>
                                <span>ชำระเงินแล้ว</span>
                                <ChevronRight size={16}/>
                            </Primary>
                        </Footer>
                    </Pay>
                )}
            </Modal>
        </Backdrop>
    );
};

Object.freeze(content);
export default content;

/*
|--------------------------------------------------------------------------
| Styled
|--------------------------------------------------------------------------
*/
const fadeIn = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;
const riseIn = keyframes`
    from { opacity: 0; transform: translateY(12px) scale(0.985); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(3, 6, 10, 0.55);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: ${fadeIn} 160ms ease;
`;

const Modal = styled.div`
    width: 100%;
    max-width: 640px;
    max-height: calc(100vh - 48px);

    overflow-y: auto;
    overflow-x: hidden;

    background: var(--page-inner, #111a3f);

background-image:
    radial-gradient(
        1000px 500px at 50% -10%,
        rgba(97,196,200,.08),
        transparent 60%
    );

  border: none;

  border-radius: 4px;

  box-shadow: 0 18px 60px rgba(0,0,0,.45);

    color: #fff;

    animation: ${riseIn} 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
`;
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    border-bottom: 1px solid var(--bg-hairline);

    padding: 28px 24px 12px;

    border-bottom: 1px solid var(--bg-hairline);
`;
const HeadLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;
const Eyebrow = styled.span`
    color: var(--text-accent, #61c4c8);
    font-size: 0.7rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
`;
const Title = styled.h2`
    margin: 0;
    font-size: 1.35rem;
    color: #fff;
`;
const CloseBtn = styled.button`
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 3px;
    color: var(--text-muted, #8a94a6);
    cursor: pointer;
    transition: background 160ms ease, color 160ms ease;
    &:hover { background: rgba(255,255,255,0.04); color: #fff; }
`;

const Steps = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 24px 20px;
    border-bottom: 1px solid var(--bg-hairline);
`;
const Step = styled.div<{ $on: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    opacity: ${p => p.$on ? 1 : 0.5};
`;
const StepDot = styled.span<{ $on: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid ${p => p.$on ? "var(--text-accent, #61c4c8)" : "var(--bg-hairline, rgba(255,255,255,0.1))"};
    color: ${p => p.$on ? "var(--text-accent, #61c4c8)" : "var(--text-muted, #8a94a6)"};
    font-size: 0.72rem;
    font-weight: 600;
`;
const StepLabel = styled.span`
    color: #fff;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
`;
const StepBar = styled.span<{ $on: boolean }>`
    flex: 1;
    height: 1px;
    background: ${p => p.$on ? "var(--text-accent, #61c4c8)" : "var(--bg-hairline, rgba(255,255,255,0.08))"};
    transition: background 200ms ease;
`;

/* ===== Form ===== */
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 24px 22px;
`;
const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 12px;

    width: 100%;
`;
const Field = styled.label`
    display: flex;
    align-items: stretch;

    min-width: 0;
    width: 100%;

    height: 42px;

    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 3px;

    background: #1a2447;

    transition:
        border-color 160ms ease,
        background 160ms ease;

    &:focus-within {
        border-color: var(--text-accent, #61c4c8);
        background: #1e2b52;
    }
`;
const FieldIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    color: var(--text-muted, #8a94a6);
    border-right: 1px solid rgba(255,255,255,0.12);
`;
const FieldInput = styled.input`
    all: unset;

    flex: 1;
    min-width: 0;

    padding: 0 12px;

    color: #fff;
    font-size: 0.9rem;

    &::placeholder {
        color: var(--text-muted, #8a94a6);
    }
    &:hover {
        border-color: transparent;
    }
`;
const FieldTextArea = styled.textarea`
    all: unset;
    box-sizing: border-box;
    display: block;
    width: 100%;

    padding: 12px 14px;

    color: #fff;
    font-size: 0.9rem;

    background: #1a2447;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 3px;

    resize: vertical;

    &::placeholder {
        color: var(--text-muted, #8a94a6);
    }

    &:focus {
        border-color: var(--text-accent, #61c4c8);
        background: #1e2b52;
    }
`;

const MethodBlock = styled.div`
    margin-top: 6px;
`;
const MethodTitle = styled.div`
    color: var(--text-muted, #8a94a6);
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 8px;
`;
const MethodGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
`;
const Method = styled.button<{ $on: boolean }>`
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 46px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.85rem;
    color: ${p => p.$on ? "var(--text-accent, #61c4c8)" : "#fff"};
    background: ${p => p.$on ? "rgba(97, 196, 200, 0.10)" : "#1a2447"};
    border: 1px solid ${p => p.$on ? "var(--text-accent, #61c4c8)" : "rgba(255,255,255,0.12)"};
    transition: all 160ms ease;
    svg { color: ${p => p.$on ? "var(--text-accent, #61c4c8)" : "var(--text-muted, #8a94a6)"}; }
    &:hover { border-color: var(--text-accent, #61c4c8); }
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 8px;
`;
const Ghost = styled.button`
    all: unset;
    padding: 12px 18px;
    color: #fff;
    font-size: 0.8rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 3px;
    cursor: pointer;
    &:hover { border-color: var(--text-accent, #61c4c8); color: var(--text-accent, #61c4c8); }
`;
const Primary = styled.button`
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--btn-primary, #61c4c8);
    color: var(--btn-primary-text, #05171a);
    border-radius: 3px;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 160ms ease;
    &:hover { background: var(--btn-primary-hover, #7ad4d8); }
`;

/* ===== Pay step ===== */
const Pay = styled.div`
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 22px;
    padding: 0 24px 22px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;
const QrCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;
const QrFrame = styled.div`
    padding: 14px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid var(--bg-hairline, rgba(255,255,255,0.08));
    box-shadow: 0 0 0 1px rgba(97, 196, 200, 0.15), 0 12px 30px rgba(0,0,0,0.35);

    img { display: block; }
`;
const QrHint = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted, #8a94a6);
    font-size: 0.78rem;
    svg { color: var(--text-accent, #61c4c8); }
`;
const PayInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;
const PayRow = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px dashed rgba(255,255,255,0.12);
`;
const PayLabel = styled.span`
    color: var(--text-muted, #8a94a6);
    font-size: 0.8rem;
`;
const PayValue = styled.span`
    color: #fff;
    font-size: 0.9rem;
`;
const PayValueRow = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
`;
const CopyBtn = styled.button`
    all: unset;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 3px;
    color: var(--text-muted, #8a94a6);
    cursor: pointer;
    &:hover { color: var(--text-accent, #61c4c8); border-color: var(--text-accent, #61c4c8); }
`;
const PayAccent = styled.span`
    color: var(--text-accent, #61c4c8);
    font-size: 1.15rem;
    font-weight: 600;
`;
const Note = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted, #8a94a6);
    font-size: 0.78rem;
    padding: 10px 12px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 3px;
    background: rgba(97, 196, 200, 0.06);
    svg { color: var(--text-accent, #61c4c8); flex-shrink: 0; }
`;
