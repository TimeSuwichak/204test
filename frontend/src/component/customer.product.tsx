import react from "react";
import styled from "styled-components";
import { ChevronLeft, Minus, Plus, ShoppingBag, Heart, Share2, Truck, ShieldCheck, Package } from "lucide-react";
import navigatior from "#util/common.navigation.ts";

const content = function Product ()
{
    const [qty, setQty] = react.useState(1);
    const [tab, setTab] = react.useState<"desc" | "specs" | "shipping">("desc");

    const price     = 1290;
    const oldPrice  = 1590;
    const discount  = Math.round((1 - price / oldPrice) * 100);
    const stock     : number = 12;
    const lowStock  = stock > 0 && stock <= 5;

    function dec () { setQty(q => Math.max(1, q - 1)); }
    function inc () { setQty(q => Math.min(stock, q + 1)); }

    return (
        <Page>
            <Container>
                <Crumbs>
                    <CrumbLink onClick={() => window.history.back()}>หน้าแรก</CrumbLink>
                    <CrumbSep>/</CrumbSep>
                    <CrumbLink onClick={() => window.history.back()}>สินค้าทั้งหมด</CrumbLink>
                    <CrumbSep>/</CrumbSep>
                    <CrumbCurrent>ชื่อเกม</CrumbCurrent>
                </Crumbs>

                <BackRow>
                    <BackButton onClick={() => window.history.back()}>
                        <ChevronLeft size={16}/>
                        <span>ย้อนกลับ</span>
                    </BackButton>
                </BackRow>

                <Layout>
                    {/* ============ COVER ============ */}
                    <GalleryColumn>
                        <MainImage>
                            <Placeholder>
                                <PlaceholderMark>✦</PlaceholderMark>
                                <PlaceholderText>Cover Art</PlaceholderText>
                            </Placeholder>
                            <StockBadge $ok={stock > 0}>
                                {stock > 0 ? "IN STOCK" : "SOLD OUT"}
                            </StockBadge>
                        </MainImage>
                    </GalleryColumn>

                    {/* ============ INFO ============ */}
                    <InfoColumn>
                        <Eyebrow>PlayStation 5 · Action</Eyebrow>

                        <Title>ชื่อเกม</Title>
                        <Subtitle>คำโปรยสั้น ๆ เกี่ยวกับเกมนี้</Subtitle>

                        <PriceBlock>
                            <PriceRow>
                                <Price>{price.toLocaleString()} ฿</Price>
                                <OldPrice>{oldPrice.toLocaleString()} ฿</OldPrice>
                                <DiscountTag>-{discount}%</DiscountTag>
                            </PriceRow>
                            <TaxNote>รวมภาษีแล้ว · จัดส่งฟรีเมื่อสั่งซื้อมากกว่า 1,500 ฿</TaxNote>
                        </PriceBlock>

                        <StockRow>
                            <StockDot $ok={stock > 0} $low={lowStock}/>
                            <StockText>
                                {stock > 0
                                    ? <>เหลือ <strong>{stock}</strong> ชิ้นในสต็อก{lowStock && " · ใกล้หมดแล้ว"}</>
                                    : "สินค้าหมดชั่วคราว"}
                            </StockText>
                        </StockRow>

                        <BuyRow>
                            <QtyBox>
                                <QtyBtn onClick={dec} aria-label="ลดจำนวน"><Minus size={14}/></QtyBtn>
                                <QtyValue>{qty}</QtyValue>
                                <QtyBtn onClick={inc} aria-label="เพิ่มจำนวน"><Plus size={14}/></QtyBtn>
                            </QtyBox>

                            <AddToCart disabled={stock === 0} onClick={() => navigatior.toCart()}>
                                <ShoppingBag size={16}/>
                                <span>{stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}</span>
                            </AddToCart>

                            <IconGhost aria-label="บันทึกในรายการโปรด"><Heart size={16}/></IconGhost>
                            <IconGhost aria-label="แชร์"><Share2 size={16}/></IconGhost>
                        </BuyRow>

                        <Assurances>
                            <Assurance>
                                <Truck size={16}/>
                                <span>จัดส่งภายใน 1–3 วันทำการ</span>
                            </Assurance>
                            <Assurance>
                                <ShieldCheck size={16}/>
                                <span>รับประกันของแท้ 100%</span>
                            </Assurance>
                            <Assurance>
                                <Package size={16}/>
                                <span>ห่อของขวัญได้ฟรี</span>
                            </Assurance>
                        </Assurances>

                        {/* ============ TABS ============ */}
                        <Tabs>
                            <Tab $active={tab === "desc"}    onClick={() => setTab("desc")}>รายละเอียด</Tab>
                            <Tab $active={tab === "specs"}   onClick={() => setTab("specs")}>ข้อมูลจำเพาะ</Tab>
                            <Tab $active={tab === "shipping"}onClick={() => setTab("shipping")}>การจัดส่ง</Tab>
                        </Tabs>

                        <TabBody>
                            {tab === "desc" && (
                                <Description>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget lacus
                                    ultricies, finibus libero nec, mattis lorem. Nunc nec felis consectetur,
                                    lacinia risus vulputate, fringilla est. In hac habitasse platea dictumst.
                                    Sed a lectus non magna scelerisque mattis. Etiam laoreet id nulla et
                                    tristique.
                                    {"\n\n"}
                                    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
                                    inceptos himenaeos. Sed erat lectus, ullamcorper at lectus eget, dictum
                                    imperdiet neque. Nullam a egestas eros.
                                </Description>
                            )}

                            {tab === "specs" && (
                                <SpecTable>
                                    <SpecRow><SpecKey>ผู้ผลิต</SpecKey><SpecVal>—</SpecVal></SpecRow>
                                    <SpecRow><SpecKey>แพลตฟอร์ม</SpecKey><SpecVal>PlayStation 5</SpecVal></SpecRow>
                                    <SpecRow><SpecKey>ประเภท</SpecKey><SpecVal>Action</SpecVal></SpecRow>
                                    <SpecRow><SpecKey>ภาษา</SpecKey><SpecVal>ไทย / อังกฤษ</SpecVal></SpecRow>
                                    <SpecRow><SpecKey>ปีที่ออก</SpecKey><SpecVal>2024</SpecVal></SpecRow>
                                    <SpecRow><SpecKey>คงเหลือ</SpecKey><SpecVal>{stock} ชิ้น</SpecVal></SpecRow>
                                </SpecTable>
                            )}

                            {tab === "shipping" && (
                                <Description>
                                    จัดส่งทั่วประเทศไทยผ่าน Kerry / Flash ภายใน 1–3 วันทำการ
                                    สั่งซื้อครบ 1,500 ฿ ขึ้นไป จัดส่งฟรี
                                    สามารถรับสินค้าที่หน้าร้านได้เช่นกัน
                                </Description>
                            )}
                        </TabBody>
                    </InfoColumn>
                </Layout>
            </Container>
        </Page>
    );
};

Object.freeze(content);
export default content;

/*
|--------------------------------------------------------------------------
| Styled
|--------------------------------------------------------------------------
| Page-scoped palette: warm gold accent on a deep navy backdrop. Overrides
| a few global tokens locally so this page reads distinctly from cart /
| browser without touching the design system.
*/

const Page = styled.main`
    /* Consistent cool cyan accent, warm gold as emphasis (price only) */
    --text-accent: #61c4c8;
    --accent: #61c4c8;
    --accent-contrast: #05171a;
    --accent-emphasis: #d4b06a;
    --page-outer: #13182b;
    --page-inner: #111a3f;
    --page-tint: radial-gradient(1200px 600px at 50% -10%, rgba(97, 196, 200, 0.08), transparent 60%);

    min-height: 100vh;
    padding: 40px 24px 80px;
    color: #fff;
    padding-top: 80px;
    background: var(--page-outer);

    @media (max-width: 720px) { padding: 24px 12px 60px; }
`;
const Container = styled.div`
    max-width: 1160px;
    margin: 0 auto;
    padding: 40px 48px 56px;
    background: var(--page-inner);
    background-image: var(--page-tint);
    border: 1px solid var(--bg-hairline);
    border-radius: 4px;

    @media (max-width: 720px) { padding: 28px 20px 40px; }
`;

const Crumbs = styled.nav`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    color: #fff;
    margin-bottom: 12px;
`;
const CrumbLink = styled.a`
    color: #fff;
    cursor: pointer;
    &:hover { color: var(--text-accent); }
`;
const CrumbSep = styled.span` color: var(--text-muted); `;
const CrumbCurrent = styled.span` color: var(--text-muted); `;

const BackRow = styled.div` margin-bottom: 22px; `;
const BackButton = styled.button`
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid var(--bg-hairline);
    border-radius: 3px;
    color: #fff;
    background: #222d41;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    &:hover { color: var(--text-accent); border-color: var(--text-accent); }
`;

const Layout = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 460px) 1fr;
    gap: 56px;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`;

/* ===== Cover ===== */
const GalleryColumn = styled.div`
    position: sticky;
    top: 88px;
    align-self: start;

    @media (max-width: 960px) { position: static; }
`;
const MainImage = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 5;
    background: var(--bg-primary);
    border: 1px solid var(--bg-hairline);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;
const Placeholder = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    color: var(--text-muted);
`;
const PlaceholderMark = styled.span`
    font-size: 3rem;
    color: var(--text-accent);
    opacity: 0.55;
`;
const PlaceholderText = styled.span`
    font-size: 0.72rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
`;
const StockBadge = styled.span<{ $ok: boolean }>`
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 5px 10px;
    background: rgba(11, 17, 27, 0.85);
    border: 1px solid ${p => p.$ok ? "var(--text-accent)" : "#c86a5c"};
    color: ${p => p.$ok ? "var(--text-accent)" : "#c86a5c"};
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
`;

/* ===== Info ===== */
const InfoColumn = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`;
const Eyebrow = styled.div`
    color: var(--text-accent);
    font-size: 0.72rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    margin-bottom: 10px;
`;
const Title = styled.h1`
    margin: 0;
    font-size: 2.4rem;
    line-height: 1.1;
    color: #fff;
`;
const Subtitle = styled.p`
    margin: 10px 0 0;
    color: var(--text-muted);
    font-size: 0.98rem;
`;

const PriceBlock = styled.div`
    margin-top: 26px;
    padding-top: 22px;
    border-top: 1px solid var(--bg-hairline);
`;
const PriceRow = styled.div`
    display: inline-flex;
    align-items: baseline;
    gap: 14px;
    flex-wrap: wrap;
`;
const Price = styled.span`
    font-size: 2rem;
    font-weight: 600;
    color: var(--accent-emphasis);
    letter-spacing: 0.01em;
`;
const OldPrice = styled.span`
    font-size: 1rem;
    color: var(--text-muted);
    text-decoration: line-through;
`;
const DiscountTag = styled.span`
    padding: 3px 8px;
    background: #8C3B2E;
    color: #fff;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 2px;
`;
const TaxNote = styled.p`
    margin: 8px 0 0;
    color: var(--text-muted);
    font-size: 0.8rem;
`;

const StockRow = styled.div`
    margin-top: 18px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
`;
const StockDot = styled.span<{ $ok: boolean; $low: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${p => !p.$ok ? "#c86a5c" : p.$low ? "#e6b34a" : "#5ec48b"};
    box-shadow: 0 0 0 3px ${p => !p.$ok ? "rgba(200,106,92,0.18)"
                                : p.$low ? "rgba(230,179,74,0.18)"
                                : "rgba(94,196,139,0.18)"};
`;
const StockText = styled.span`
    color: var(--text-muted);
    font-size: 0.86rem;

    strong { color: #fff; font-weight: 600; }
`;

const BuyRow = styled.div`
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
`;
const QtyBox = styled.div`
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--bg-hairline);
    border-radius: 3px;
    height: 44px;
`;
const QtyBtn = styled.button`
    all: unset;
    width: 38px;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    &:hover { color: var(--text-accent); }
`;
const QtyValue = styled.span`
    min-width: 30px;
    text-align: center;
    color: #fff;
    font-size: 0.95rem;
`;
const AddToCart = styled.button`
    all: unset;
    box-sizing: border-box;
    height: 44px;
    padding: 0 22px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--btn-primary);
    color: var(--btn-primary-text);
    border-radius: 3px;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 160ms ease, opacity 160ms ease;
    &:hover { background: var(--btn-primary-hover); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const IconGhost = styled.button`
    all: unset;
    box-sizing: border-box;
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--bg-hairline);
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    &:hover { color: var(--text-accent); border-color: var(--text-accent); }
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
    font-size: 0.85rem;

    svg { color: var(--text-accent); }
`;

const Tabs = styled.div`
    margin-top: 34px;
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--bg-hairline);
`;
const Tab = styled.button<{ $active: boolean }>`
    all: unset;
    padding: 12px 18px;
    color: ${p => p.$active ? "var(--text-accent)" : "#fff"};
    font-size: 0.78rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    border-bottom: 2px solid ${p => p.$active ? "var(--text-accent)" : "transparent"};
    margin-bottom: -1px;
    transition: color 160ms ease, border-color 160ms ease;
    &:hover { color: var(--text-accent); }
`;
const TabBody = styled.div` padding: 22px 4px 0; `;

const Description = styled.p`
    margin: 0;
    color: var(--text-primary);
    font-size: 0.95rem;
    line-height: 1.75;
    max-width: 68ch;
    white-space: pre-line;
`;

const SpecTable = styled.dl`
    margin: 0;
    display: grid;
    grid-template-columns: 180px 1fr;
    row-gap: 0;
    max-width: 520px;
`;
const SpecRow = styled.div`
    display: contents;
    & > * { padding: 12px 0; border-bottom: 1px solid var(--bg-hairline); }
`;
const SpecKey = styled.dt`
    color: var(--text-muted);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
`;
const SpecVal = styled.dd`
    margin: 0;
    color: #fff;
    font-size: 0.92rem;
`;
