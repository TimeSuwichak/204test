import styled from "styled-components";
import type { Product } from "./productBrowser.productcard";

import ProductBrowserProductCard from "./productBrowser.productcard";

interface Props { products: Product[]; }

const content = function CustomerProductBrowserProductGrid ({ products }: Props)
{
    return (
        <ProductsSection>
            <SectionHead>
                <SectionTitle>เลือกกล่องเกมของคุณ</SectionTitle>
                <SectionMeta>{products.length} รายการ</SectionMeta>
            </SectionHead>

            <ProductsGrid>
                {products.map(product => (
                    <ProductBrowserProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </ProductsGrid>
        </ProductsSection>
    );
};

/*
|--------------------------------------------------------------------------
| Styled
|--------------------------------------------------------------------------
*/

const ProductsSection = styled.section`
    flex: 1;
    min-width: 0;
`;

const SectionHead = styled.header`
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 8px;
    padding-bottom: 20px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--bg-hairline);
`;
const SectionTitle = styled.h2`
    grid-column: 1 / 2;
    grid-row: 2;
    font-size: clamp(1.4rem, 2.2vw, 1.9rem);
    line-height: 1.2;
    margin-top: 4px;
`;
const SectionMeta = styled.span`
    grid-column: 2 / 3;
    grid-row: 2;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: white;
`;

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 22px;

    @media (max-width: 640px) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 14px;
    }
`;

Object.freeze(content);
export default content;
