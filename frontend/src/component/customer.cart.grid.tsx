import react from "react";
import styled from "styled-components";
import { Minus, Plus, Trash2, Heart } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/
export type CartLine = {
    id:        string;
    title:     string;
    variant?:  string;
    price:     number;
    oldPrice?: number;
    quantity:  number;
    inStock?:  boolean;
    stockLeft?: number;
    imageUrl?: string;
};

type Props = {
    lines?:      CartLine[];
    onChange?:   (id: string, quantity: number) => void;
    onRemove?:   (id: string) => void;
    onSave?:     (id: string) => void;
};

/*
|--------------------------------------------------------------------------
| Sample data
|--------------------------------------------------------------------------
*/
const SAMPLE: CartLine[] = [
    { id: "1", title: "Battlefield 2042",           variant: "PS5 · Standard Edition",   price: 1290, oldPrice: 1590, quantity: 1, inStock: true,  stockLeft: 12 },
    { id: "2", title: "The Witcher III",            variant: "Xbox Series X · Complete", price:  990,                  quantity: 2, inStock: true,  stockLeft: 4  },
    { id: "3", title: "The Legend of Zelda: TOTK",  variant: "Nintendo Switch",          price: 1890,                  quantity: 1, inStock: false, stockLeft: 0  },
];

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/
const content = function CartGrid ({ lines, onChange, onRemove, onSave }: Props)
{
    const [local, setLocal] = react.useState<CartLine[]>(lines ?? SAMPLE);

    react.useEffect(() => { if (lines) setLocal(lines); }, [lines]);

    function setQty (id: string, delta: number) {
        setLocal(prev => prev.map(l => {
            if (l.id !== id) return l;
            const cap  = typeof l.stockLeft === "number" && l.stockLeft > 0 ? l.stockLeft : 99;
            const next = Math.max(1, Math.min(cap, l.quantity + delta));
            onChange?.(id, next);
            return { ...l, quantity: next };
        }));
    }

    function remove (id: string) {
        setLocal(prev => prev.filter(l => l.id !== id));
        onRemove?.(id);
    }

    if (local.length === 0) {
        return (
            <Empty>
                <EmptyMark>✦</EmptyMark>
                <EmptyTitle>ตะกร้าของคุณยังว่าง</EmptyTitle>
                <EmptyText>เลือกดูสินค้าและเพิ่มลงในตะกร้าเพื่อดำเนินการต่อ</EmptyText>
            </Empty>
        );
    }

    return (
        <Wrap>
            <Head>
                <HeadCol $col="item">Item</HeadCol>
                <HeadCol $col="price">Price</HeadCol>
                <HeadCol $col="qty">Quantity</HeadCol>
                <HeadCol $col="total">Total</HeadCol>
            </Head>

            <List>
                {local.map(line => {
                    const total    = line.price * line.quantity;
                    const ok       = line.inStock ?? true;
                    const left     = line.stockLeft ?? 0;
                    const low      = ok && left > 0 && left <= 5;
                    return (
                        <Row key={line.id}>
                            {/* Item */}
                            <Cell $col="item">
                                <Thumb>
                                    <ThumbMark>✦</ThumbMark>
                                </Thumb>
                                <Info>
                                    <Title>{line.title}</Title>
                                    {line.variant && <Variant>{line.variant}</Variant>}
                                    <StockLine>
                                        <StockDot $ok={ok} $low={low}/>
                                        <StockText $ok={ok}>
                                            {!ok
                                                ? "สินค้าหมด"
                                                : left > 0
                                                    ? <>เหลือ <strong>{left}</strong> ชิ้น{low && " · ใกล้หมด"}</>
                                                    : "มีสินค้า"}
                                        </StockText>
                                    </StockLine>
                                    <Actions>
                                        <ActionBtn onClick={() => onSave?.(line.id)}>
                                            <Heart size={13}/>
                                            <span>บันทึก</span>
                                        </ActionBtn>
                                        <ActionDot>·</ActionDot>
                                        <ActionBtn onClick={() => remove(line.id)}>
                                            <Trash2 size={13}/>
                                            <span>ลบ</span>
                                        </ActionBtn>
                                    </Actions>
                                </Info>
                            </Cell>

                            {/* Price */}
                            <Cell $col="price">
                                <MobileLabel>Price</MobileLabel>
                                <PriceStack>
                                    <Price>{line.price.toLocaleString()} ฿</Price>
                                    {line.oldPrice && <OldPrice>{line.oldPrice.toLocaleString()} ฿</OldPrice>}
                                </PriceStack>
                            </Cell>

                            {/* Qty */}
                            <Cell $col="qty">
                                <MobileLabel>Qty</MobileLabel>
                                <QtyBox>
                                    <QtyBtn onClick={() => setQty(line.id, -1)} aria-label="ลดจำนวน">
                                        <Minus size={13}/>
                                    </QtyBtn>
                                    <QtyValue>{line.quantity}</QtyValue>
                                    <QtyBtn onClick={() => setQty(line.id, +1)} aria-label="เพิ่มจำนวน">
                                        <Plus size={13}/>
                                    </QtyBtn>
                                </QtyBox>
                            </Cell>

                            {/* Total */}
                            <Cell $col="total">
                                <MobileLabel>Total</MobileLabel>
                                <Total>{total.toLocaleString()} ฿</Total>
                            </Cell>
                        </Row>
                    );
                })}
            </List>
        </Wrap>
    );
};

Object.freeze(content);
export default content;

/*
|--------------------------------------------------------------------------
| Styled
|--------------------------------------------------------------------------
*/
const Wrap = styled.section`
    width: 100%;
    border: 1px solid var(--bg-hairline);
    background: var(--bg-primary);
    color: #fff;
`;

import { css } from "styled-components";

const TableGrid = css`
    display: grid;
    grid-template-columns:
    2.8fr
    1fr
    1fr
    1fr;
    column-gap: 14px;

    @media (max-width: 760px) {
        grid-template-columns: 1fr 1fr;
        row-gap: 16px;
    }
`;

const Head = styled.div`
    ${TableGrid};

    padding: 14px 22px;
    border-bottom: 1px solid var(--bg-hairline);
    background: #1b233f;

    @media (max-width: 760px) {
        display: none;
    }
`;

const HeadCol = styled.div<{ $col: string }>`
    display: flex;
    align-items: center;
    justify-content: ${({ $col }) =>
        $col === "item" ? "center" : "center"};

    color: var(--text-muted);
    font-size: 0.7rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
`;

const List = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 14px;

    padding: 14px;
`;
const Row = styled.li`
    ${TableGrid};

    padding: 22px;

    background: rgba(255,255,255,.02);

    border: 1px solid var(--bg-hairline);

    border-radius: 6px;
`;
const Cell = styled.div<{ $col: string }>`
    display: flex;
    align-items: center;
    justify-content: ${({ $col }) =>
        $col === "item" ? "flex-start" : "center"};

    min-width: 0;

    @media (max-width: 760px) {
        grid-column: ${({ $col }) =>
            $col === "item" ? "1 / -1" : "auto"};

        justify-content: ${({ $col }) =>
            $col === "item"
                ? "flex-start"
                : "space-between"};
    }
`;
const MobileLabel = styled.span`
    display: none;
    color: var(--text-muted);
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;

    @media (max-width: 760px) { display: inline; }
`;

/* ===== Item cell ===== */
const Thumb = styled.div`
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    background: var(--bg-secondary, #0b111b);
    border: 1px solid var(--bg-hairline);
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 760px) { width: 80px; height: 80px; }
`;
const ThumbMark = styled.span`
    color: var(--text-accent);
    opacity: 0.5;
    font-size: 1.4rem;
`;
const Info = styled.div`
    margin-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;
const Title = styled.h3`
    margin: 0;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
`;
const Variant = styled.span`
    color: var(--text-muted);
    font-size: 0.82rem;
`;
const StockLine = styled.div`
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
`;
const StockDot = styled.span<{ $ok: boolean; $low: boolean }>`
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: ${p => !p.$ok ? "#c86a5c" : p.$low ? "#e6b34a" : "#5ec48b"};
    box-shadow: 0 0 0 3px ${p => !p.$ok ? "rgba(200,106,92,0.18)"
                                : p.$low ? "rgba(230,179,74,0.18)"
                                : "rgba(94,196,139,0.18)"};
`;
const StockText = styled.span<{ $ok: boolean }>`
    color: ${p => p.$ok ? "var(--text-muted)" : "#c86a5c"};
    font-size: 0.78rem;

    strong { color: #fff; font-weight: 600; }
`;
const Actions = styled.div`
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
`;
const ActionBtn = styled.button`
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-muted);
    font-size: 0.78rem;
    cursor: pointer;
    transition: color 160ms ease;
    &:hover { color: var(--text-accent); }
`;
const ActionDot = styled.span`
    color: var(--bg-hairline);
`;

/* ===== Price cell ===== */
const PriceStack = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    @media (max-width: 760px) {
        align-items: flex-end;
    }
`;
const Price = styled.span`
    color: #fff;
    font-size: 0.98rem;
    font-weight: 500;
`;
const OldPrice = styled.span`
    color: var(--text-muted);
    font-size: 0.8rem;
    text-decoration: line-through;
`;

/* ===== Qty cell ===== */
const QtyBox = styled.div`
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--bg-hairline);
    border-radius: 3px;
    height: 38px;
`;
const QtyBtn = styled.button`
    all: unset;
    width: 34px;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    transition: color 160ms ease;
    &:hover { color: var(--text-accent); }
`;
const QtyValue = styled.span`
    min-width: 28px;
    text-align: center;
    color: #fff;
    font-size: 0.9rem;
`;

/* ===== Total cell ===== */
const Total = styled.span`
    color: var(--text-accent);
    font-size: 1.02rem;
    font-weight: 600;
`;

/* ===== Empty state ===== */
const Empty = styled.div`
    width: 100%;
    padding: 80px 24px;
    border: 1px solid var(--bg-hairline);
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
`;
const EmptyMark = styled.span`
    color: var(--text-accent);
    opacity: 0.6;
    font-size: 2.4rem;
`;
const EmptyTitle = styled.h3`
    margin: 0;
    color: #fff;
    font-size: 1.2rem;
`;
const EmptyText = styled.p`
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
`;
