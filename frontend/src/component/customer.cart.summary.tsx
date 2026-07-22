import react from "react";
import styled from "styled-components";
import { Tag, ShieldCheck, Truck, CreditCard, ChevronRight } from "lucide-react";
import CheckoutModal from "#component/customer.checkout.tsx";


/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/
type Props = {
    subtotal?:   number;
    shipping?:   number;   // undefined = free above threshold
    discount?:   number;
    threshold?:  number;   // free-shipping threshold
    onCheckout?: () => void;
    onApplyCode?: (code: string) => void;
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/
const content = function CartSummary ({
    subtotal   = 4170,
    shipping,
    discount   = 0,
    threshold  = 1500,
    onCheckout,
    onApplyCode,
}: Props)
{
    const [code, setCode] = react.useState("");
    const [showCheckout, setShowCheckout] = react.useState(false);


    const ship  = typeof shipping === "number" ? shipping : (subtotal >= threshold ? 0 : 60);
    const total = Math.max(0, subtotal + ship - discount);
    const toFree = Math.max(0, threshold - subtotal);
    const pct    = Math.min(100, Math.round((subtotal / threshold) * 100));

    function apply (e: react.FormEvent) {
        e.preventDefault();
        if (!code.trim()) return;
        onApplyCode?.(code.trim());
    }

    return (
        <Aside>
            <Panel>
                <Heading>สรุปคำสั่งซื้อ</Heading>

                {/* Free shipping meter */}
                <ShipMeter>
                    <ShipMeterHead>
                        <Truck size={14}/>
                        {toFree > 0
                            ? <span>ซื้อเพิ่มอีก <strong>{toFree.toLocaleString()} ฿</strong> เพื่อรับสิทธิ์จัดส่งฟรี</span>
                            : <span>คุณได้รับสิทธิ์จัดส่งฟรีแล้ว</span>}
                    </ShipMeterHead>
                    <Bar>
                        <BarFill style={{ width: `${pct}%` }}/>
                    </Bar>
                </ShipMeter>

                {/* Promo code */}
                <Promo onSubmit={apply}>
                    <PromoIcon><Tag size={14}/></PromoIcon>
                    <PromoInput
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder="รหัสส่วนลด"
                    />
                    <PromoBtn type="submit">ใช้</PromoBtn>
                </Promo>

                {/* Line breakdown */}
                <Lines>
                    <Line>
                        <LineLabel>ยอดรวมสินค้า</LineLabel>
                        <LineValue>{subtotal.toLocaleString()} ฿</LineValue>
                    </Line>
                    <Line>
                        <LineLabel>ค่าจัดส่ง</LineLabel>
                        <LineValue>{ship === 0 ? "ฟรี" : `${ship.toLocaleString()} ฿`}</LineValue>
                    </Line>
                    {discount > 0 && (
                        <Line>
                            <LineLabel>ส่วนลด</LineLabel>
                            <LineValueAccent>- {discount.toLocaleString()} ฿</LineValueAccent>
                        </Line>
                    )}
                </Lines>

                <Divider/>

                <TotalRow>
                    <TotalLabel>ยอดชำระทั้งหมด</TotalLabel>
                    <TotalValue>{total.toLocaleString()} ฿</TotalValue>
                </TotalRow>
                <TaxNote>รวมภาษีมูลค่าเพิ่มแล้ว</TaxNote>

                <Checkout onClick={() => { onCheckout?.(); setShowCheckout(true); }}>
                    <span>ดำเนินการชำระเงิน</span>
                    <ChevronRight size={16}/>
                </Checkout>


                <Assurances>
                    <Assurance>
                        <ShieldCheck size={14}/>
                        <span>ชำระเงินปลอดภัยด้วยการเข้ารหัส SSL</span>
                    </Assurance>
                    <Assurance>
                        <CreditCard size={14}/>
                        <span>รองรับบัตรเครดิต / โอนธนาคาร / พร้อมเพย์</span>
                    </Assurance>
                    <Assurance>
                        <Truck size={14}/>
                        <span>จัดส่งภายใน 1–3 วันทำการ</span>
                    </Assurance>
                </Assurances>
            </Panel>

            <CheckoutModal
                open={showCheckout}
                total={total}
                onClose={() => setShowCheckout(false)}
            />
        </Aside>
    );

};

Object.freeze(content);
export default content;

/*
|--------------------------------------------------------------------------
| Styled
|--------------------------------------------------------------------------
*/
const Aside = styled.aside`
    position: sticky;
    top: 88px;
    align-self: start;
    color: #fff;

    @media (max-width: 960px) { position: static; }
`;
const Panel = styled.div`
    padding: 26px 24px;
    background: var(--bg-primary);
    border: 1px solid var(--bg-hairline);
`;
const Heading = styled.h2`
    margin: 0 0 20px;
    color: #fff;
    font-size: 1.1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
`;

/* ===== Free-ship meter ===== */
const ShipMeter = styled.div`
    padding: 12px 14px;
    border: 1px solid var(--bg-hairline);
    border-radius: 3px;
    margin-bottom: 18px;
`;
const ShipMeterHead = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 0.82rem;

    svg    { color: var(--text-accent); flex-shrink: 0; }
    strong { color: #fff; font-weight: 600; }
`;
const Bar = styled.div`
    margin-top: 10px;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
    overflow: hidden;
`;
const BarFill = styled.div`
    height: 100%;
    background: var(--text-accent);
    transition: width 220ms ease;
`;

/* ===== Promo ===== */
const Promo = styled.form`
    display: flex;
    align-items: stretch;
    height: 40px;
    border: 1px solid var(--bg-hairline);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 20px;
`;
const PromoIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    color: var(--text-muted);
    border-right: 1px solid var(--bg-hairline);
`;
const PromoInput = styled.input`
    all: unset;
    flex: 1;
    padding: 0 12px;
    color: #fff;
    font-size: 0.88rem;

    background: #222d41;

    transition:
    background-color .18s ease,
    box-shadow .18s ease;

    &:hover,
    &:focus {
        background: #3b4a69;
        border-color: transparent;
    }

    &::placeholder {
        color: var(--text-muted);
        transition: color 180ms ease;
    }

    &:focus::placeholder {
        color: rgba(255,255,255,.35);
    }
`;
const PromoBtn = styled.button`
    all: unset;
    padding: 0 16px;
    color: var(--text-accent);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    border-left: 1px solid var(--bg-hairline);
    transition: background 160ms ease;
    &:hover { background: rgba(255, 255, 255, 0.03); }
`;

/* ===== Lines ===== */
const Lines = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const Line = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const LineLabel = styled.span`
    color: var(--text-muted);
    font-size: 0.88rem;
`;
const LineValue = styled.span`
    color: #fff;
    font-size: 0.92rem;
`;
const LineValueAccent = styled.span`
    color: var(--text-accent);
    font-size: 0.92rem;
`;

const Divider = styled.div`
    height: 1px;
    background: var(--bg-hairline);
    margin: 18px 0;
`;

const TotalRow = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
`;
const TotalLabel = styled.span`
    color: #fff;
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
`;
const TotalValue = styled.span`
    color: var(--text-accent);
    font-size: 1.6rem;
    font-weight: 600;
`;
const TaxNote = styled.p`
    margin: 4px 0 0;
    color: var(--text-muted);
    font-size: 0.76rem;
`;

const Checkout = styled.button`
    all: unset;
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    margin-top: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: var(--btn-primary);
    color: var(--btn-primary-text);
    border-radius: 3px;
    font-size: 0.84rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    text-align: center;
    transition: background 160ms ease;
    &:hover { background: var(--btn-primary-hover); }
`;

const Assurances = styled.ul`
    margin: 22px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
const Assurance = styled.li`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 0.8rem;

    svg { color: var(--text-accent); flex-shrink: 0; }
`;
