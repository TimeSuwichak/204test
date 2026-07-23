import react from "react";
import styled, { css } from "styled-components";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/
export interface FilterState
{
    platforms : string[];
    gameTypes : string[];
    price     : { min: number; max: number };
}

interface Props
{
    value    ?: Partial<FilterState>;
    onChange ?: (next: FilterState) => void;
    onReset  ?: () => void;
    total    ?: number;
}

/*
|--------------------------------------------------------------------------
| Constants — platform & game type filters for a physical game store
|--------------------------------------------------------------------------
*/
const PLATFORMS = [
    { key: "ps5",       label: "PlayStation 5" },
    { key: "ps4",       label: "PlayStation 4" },
    { key: "xbox-xs",   label: "Xbox Series X|S" },
    { key: "xbox-one",  label: "Xbox One" },
    { key: "switch",    label: "Nintendo Switch" },
    { key: "pc",        label: "PC" },
];

const GAME_TYPES = [
    { key: "action",      label: "Action" },
    { key: "adventure",   label: "Adventure" },
    { key: "rpg",         label: "RPG" },
    { key: "sports",      label: "Sports" },
    { key: "racing",      label: "Racing" },
    { key: "simulation",  label: "Simulation" },
    { key: "strategy",    label: "Strategy" },
    { key: "fighting",    label: "Fighting" },
    { key: "horror",      label: "Horror" },
];

const DEFAULT: FilterState = {
    platforms : [],
    gameTypes : [],
    price     : { min: 0, max: 5000 },
};

/*
|--------------------------------------------------------------------------
| Root
|--------------------------------------------------------------------------
*/
const content = function CustomerProductBrowserFilterSidebar (prop: Props)
{
    const [state, setState] = react.useState<FilterState>({ ...DEFAULT, ...prop.value });

    function commit (next: FilterState)
    {
        setState(next);
        if (prop.onChange) prop.onChange(next);
    }

    function onToggle (field: "platforms" | "gameTypes", key: string)
    {
        const list = state[field];
        const next = list.includes(key)
            ? list.filter(k => k !== key)
            : [...list, key];
        commit({ ...state, [field]: next });
    }

    function onPrice (which: "min" | "max", raw: string)
    {
        const num = Math.max(0, Number(raw.replace(/[^0-9]/g, "")) || 0);
        commit({ ...state, price: { ...state.price, [which]: num } });
    }

    function onReset (event: react.MouseEvent)
    {
        event.preventDefault();
        event.stopPropagation();
        commit({ ...DEFAULT });
        if (prop.onReset) prop.onReset();
    }

    const active =
        state.platforms.length
        + state.gameTypes.length
        + (state.price.min !== DEFAULT.price.min || state.price.max !== DEFAULT.price.max ? 1 : 0);

    return (
        <Aside aria-label="ตัวกรองสินค้า">
            <Header>
                <Title>ตัวกรอง</Title>
                <HeaderMeta>
                    <ActiveDot $on={active > 0}/>
                    <MetaText>
                        {active > 0 ? `เลือกไว้ ${active} รายการ` : "ยังไม่ได้เลือก"}
                    </MetaText>
                    <ResetBtn onClick={onReset} disabled={active === 0}>ล้างทั้งหมด</ResetBtn>
                </HeaderMeta>
            </Header>

            {/* ---- Platform ---- */}
            <Section>
                <SectionTitle>แพลตฟอร์ม</SectionTitle>
                <List>
                    {PLATFORMS.map(item => {
                        const on = state.platforms.includes(item.key);
                        return (
                            <Row key={item.key} onClick={() => onToggle("platforms", item.key)} $on={on}>
                                <Check $on={on}><CheckMark $on={on}>✓</CheckMark></Check>
                                <RowLabel>{item.label}</RowLabel>
                            </Row>
                        );
                    })}
                </List>
            </Section>

            {/* ---- Game Type ---- */}
            <Section>
                <SectionTitle>ประเภทเกม</SectionTitle>
                <List>
                    {GAME_TYPES.map(item => {
                        const on = state.gameTypes.includes(item.key);
                        return (
                            <Row key={item.key} onClick={() => onToggle("gameTypes", item.key)} $on={on}>
                                <Check $on={on}><CheckMark $on={on}>✓</CheckMark></Check>
                                <RowLabel>{item.label}</RowLabel>
                            </Row>
                        );
                    })}
                </List>
            </Section>

            {/* ---- Price ---- */}
            <Section>
                <SectionTitle>ช่วงราคา</SectionTitle>
                <PriceRow>
                    <PriceField>
                        <PriceKey>ต่ำสุด</PriceKey>
                        <PriceInputWrap>
                            <PricePrefix>฿</PricePrefix>
                            <PriceInput
                                inputMode="numeric"
                                value={String(state.price.min)}
                                onChange={e => 
                                {
                                    if (Number (e.target.value) > state.price.max)
                                    {
                                        e.preventDefault ();
                                        e.stopPropagation ();
                                        return;
                                    }
                                    onPrice("min", e.target.value);
                                }}
                            />
                        </PriceInputWrap>
                    </PriceField>
                    <PriceDash>—</PriceDash>
                    <PriceField>
                        <PriceKey>สูงสุด</PriceKey>
                        <PriceInputWrap>
                            <PricePrefix>฿</PricePrefix>
                            <PriceInput
                                inputMode="numeric"
                                value={String(state.price.max)}
                                onChange={e => 
                                {
                                    if (Number (e.target.value) < state.price.min)
                                    {
                                        e.preventDefault ();
                                        e.stopPropagation ();
                                        return;
                                    }
                                    onPrice("max", e.target.value);
                                }}
                            />
                        </PriceInputWrap>
                    </PriceField>
                </PriceRow>
            </Section>

            <Footer>
                <FooterMeta>
                    {typeof prop.total === "number"
                        ? `แสดง ${prop.total} รายการ`
                        : "อัปเดตผลลัพธ์อัตโนมัติ"}
                </FooterMeta>
            </Footer>
        </Aside>
    );
};

/*
|--------------------------------------------------------------------------
| Styled
|--------------------------------------------------------------------------
| Browser palette: cool cyan accent on deep navy.
*/

const Aside = styled.aside`
    /* Local accent — cool cyan */
    --text-accent: #61c4c8;
    --accent: #61c4c8;
    --accent-contrast: #05191a;

    padding: 16px 0px;
    background: var(--bg-primary);
    border: 1px solid var(--bg-hairline);
    border-radius: 4px;
    box-shadow: var(--shadow-card);
    color: #FFF;

`;

const Header = styled.header`
    display: block;
`;
const Title = styled.h3`
    font-size: 1.5rem;
    line-height: 1.1;
    color: #fff;
    margin: 0;
`;
const HeaderMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 8px;
`;
const ActiveDot = styled.span<{ $on: boolean }>`
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${p => p.$on ? "var(--accent)" : "var(--text-muted)"};
    opacity: ${p => p.$on ? 1 : 0.5};
    box-shadow: ${p => p.$on ? "0 0 0 3px rgba(97, 196, 200, 0.18)" : "none"};
`;
const MetaText = styled.span`
    flex: 1;
    font-size: 1rem;
    text-transform: uppercase;
    color: var(--text-muted);
`;
const ResetBtn = styled.button`
    display: block; 
    font-size: 1rem;
    text-transform: uppercase;
    background-color: transparent;
    cursor: pointer;
    padding: 8px;

    &:hover { text-decoration: underline; text-underline-offset: 3px; }
    &:disabled { color: var(--text-muted); opacity: 0.5; cursor: default; text-decoration: none; }
`;

const Section = styled.section`
    display: block;
    padding: 16px 0;
    border-bottom: 1px solid var(--bg-hairline);

    &:last-of-type { border-bottom: none; }
`;
const SectionTitle = styled.h4`
    font-size: 1rem;
    font-weight: normal;
    color: #fff;
    margin: 0 0 12px 0;
    letter-spacing: 0.02em;

    &::before {
        content: "";
        display: inline-block;
        width: 14px;
        height: 1px;
        background: var(--accent);
        vertical-align: middle;
        margin-right: 10px;
        opacity: 0.7;
    }
`;

/* ---- Checkbox list ---- */
const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;

    & > *
    {
      margin-bottom: 2px;
    }
`;
const Row = styled.li<{ $on: boolean }>`
    display: grid;
    grid-template-columns: 18px 1fr;
    align-items: center;
    gap: 10px;
    padding: 7px 6px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 160ms ease, color 160ms ease;
    color: ${p => p.$on ? "#fff" : "var(--text-muted)"};

    &:hover { background: var(--menu-primary-hover); color: #fff; }
    ${p => p.$on && css`background: var(--menu-primary-active);`}
`;
const Check = styled.span<{ $on: boolean }>`
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${p => p.$on ? "var(--accent)" : "var(--btn-ghost-border)"};
    background: ${p => p.$on ? "var(--accent)" : "transparent"};
    border-radius: 2px;
    transition: all 160ms ease;
`;
const CheckMark = styled.span<{ $on: boolean }>`
    font-size: 0.7rem;
    line-height: 1;
    color: var(--accent-contrast);
    opacity: ${p => p.$on ? 1 : 0};
`;
const RowLabel = styled.span`
    font-size: 1rem;
    letter-spacing: 0.01em;
`;

/* ---- Price ---- */
const PriceRow = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: 8px;
`;
const PriceField = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;
const PriceKey = styled.span`
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
`;
const PriceInputWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;
const PricePrefix = styled.span`
    position: absolute;
    left: 10px;
    font-size: 0.95rem;
    color: var(--text-accent);
    pointer-events: none;
`;
const PriceInput = styled.input`
    width: 100%;
    padding-left: 24px;
    min-height: 38px;
`;
const PriceDash = styled.span`
    padding-bottom: 8px;
    color: #fff;
`;

/* ---- Footer ---- */
const Footer = styled.footer`
    margin-top: 8px;
    padding-top: 14px;
    border-top: 1px solid var(--bg-hairline);
`;
const FooterMeta = styled.span`
    display: block;
    text-align: center;
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
`;

Object.freeze(content);
export default content;