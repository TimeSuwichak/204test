import { useState } from "react";
import styled from "styled-components";
import type { Product } from "../types/product";

import ProductBrowserProductGrid from "#component/productBrowser.productgrid.tsx";
import ProductBrowserFilterSidebar from "#component/productBrowser.filtersidebar.tsx";

const content = function CustomerProductBrowser()
{
    // const [searchQuery, setSearchQuery] = useState("");
    // const [sortBy, setSortBy] = useState("latest");

    /*
    |------------------------------------------------------------
    | Mock data
    | Replace with API later
    |------------------------------------------------------------
    */

    const products: Product[] =
    Array.from(
        { length:15 },
        (_,i)=>({
            id:i+1,
            name:`ผลิตภัณฑ์ ${i+1}`,
            price:"฿1,990",
            image:null,
        })
    );

    return (
        <PageContainer>

            <ContentContainer>

                <ProductBrowserProductGrid
                    products={products}
                />

                <ProductBrowserFilterSidebar/>

            </ContentContainer>

        </PageContainer>
    );
};

/*
|--------------------------------------------------------------------------
| Styled Components
|--------------------------------------------------------------------------
*/

const PageContainer = styled.div`
    padding-top: 60px;
`;

const ContentContainer = styled.div`
    max-width:1500px;
    margin:auto;
    display:grid;
    grid-template-columns:1fr 280px;
    gap:32px;
    padding:24px 48px;

    @media (max-width:1000px){
        grid-template-columns:1fr;
    }
`;

/**
 * แข็งวัตถุ (ความปลอดภัย)
 */
Object.freeze(content);

/**
 * ส่งออกตัวแปร
 */
export default content;