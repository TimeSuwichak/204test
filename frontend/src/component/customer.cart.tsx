import styled from "styled-components";
import { ChevronLeft } from "lucide-react";
import CartGrid    from "#component/customer.cart.grid.tsx";
import CartSummary from "#component/customer.cart.summary.tsx";

/*
|--------------------------------------------------------------------------
| Page: Shopping Cart
|--------------------------------------------------------------------------
| Cool emerald accent — signals "safe checkout" and separates the cart
| visually from the gold product page and the cyan browser.
*/
const content = function Cart ()
{
    return (
        <Page>
            <Container>
                <Crumbs>
                    <CrumbLink onClick={() => window.history.back()}>หน้าแรก</CrumbLink>
                    <CrumbSep>/</CrumbSep>
                    <CrumbCurrent>ตะกร้าสินค้า</CrumbCurrent>
                </Crumbs>

                <Header>
                    <TitleGroup>
                        <Eyebrow>Shopping Cart</Eyebrow>
                        <Title>ตะกร้าสินค้าของคุณ</Title>
                        <Subtitle>ตรวจสอบรายการก่อนดำเนินการชำระเงิน</Subtitle>
                    </TitleGroup>

                    <BackButton onClick={() => window.history.back()}>
                        <ChevronLeft size={16}/>
                        <span>เลือกซื้อสินค้าต่อ</span>
                    </BackButton>
                </Header>

                <Layout>
                    <Main>
                        <CartGrid/>
                    </Main>
                    <Side>
                        <CartSummary/>
                    </Side>
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
*/
const Page = styled.main`
    /* Consistent cool cyan accent, emerald as emphasis (safe checkout totals) */
    --text-accent: #61c4c8;
    --accent: #61c4c8;
    --accent-contrast: #05171a;
    --accent-emphasis: #5ec48b;
    --page-outer: #13182b;
    --page-inner: #111a3f;
    --page-tint: radial-gradient(1000px 500px at 50% -10%, rgba(97, 196, 200, 0.08), transparent 60%);

    min-height: 100vh;
    padding: 40px 24px 80px;
    padding-top: 80px;
    color: #fff;
    background: var(--page-outer);

    @media (max-width: 720px) { padding: 24px 12px 60px; }
`;
const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 44px 56px;
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

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 28px;
    margin-bottom: 28px;

    @media (max-width: 720px) {
        align-items: stretch;
        flex-direction: column;
        gap: 18px;
    }
`;

const BackButton = styled.button`
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    padding: 6px 12px;

    background: #222d41;
    border: 1px solid var(--bg-hairline);
    border-radius: 3px;

    color: #fff;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    &:hover { color: var(--text-accent); border-color: var(--text-accent); }
`;
const TitleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;
const Eyebrow = styled.span`
    color: var(--text-accent);
    font-size: 0.72rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
`;
const Title = styled.h1`
    margin: 0;
    font-size: 2.2rem;
    line-height: 1.1;
    color: #fff;
`;
const Subtitle = styled.p`
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
`;

const Layout = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 32px;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }
`;
const Main = styled.div` min-width: 0; `;
const Side = styled.div` min-width: 0; `;
