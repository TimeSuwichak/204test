import react from "react";
import styled from "styled-components";
import { ShoppingCart } from "lucide-react";
import navigatior from "#util/common.navigation.ts";

export interface Product
{
    id: number;
    name: string;
    price: string;
    image: string | null;
}

interface Props { product: Product; }

const content = function CustomerProductBrowserProductCard ({ product }: Props)
{
    function onOpen (event: react.MouseEvent)
    {
        event.preventDefault();
        event.stopPropagation();
        void navigatior.toProduct(1);
    }

    return (
        <Card aria-label={`ดูรายละเอียด ${product.name}`}>
            <ImageWrapper>
                {
                    product.image
                        ? <Image src={product.image} alt={product.name}/>
                        : <Placeholder>
                            <PlaceholderMark>✦</PlaceholderMark>
                            <PlaceholderText>รูปเกม</PlaceholderText>
                          </Placeholder>
                }
                <Overlay/>
            </ImageWrapper>

            <Info>
                <ProductName>{product.name}</ProductName>
                <Footer>
                    <PriceGroup>
                        <PriceLabel>ราคา</PriceLabel>
                        <Price>{product.price}</Price>
                    </PriceGroup>
                    <AddButton onClick={onOpen} aria-label="เพิ่มลงตะกร้า">
                        <ShoppingCart size={16}/>
                    </AddButton>
                </Footer>
            </Info>
        </Card>
    );
};

/*
|--------------------------------------------------------------------------
| Styled
|--------------------------------------------------------------------------
*/

const Card = styled.article`
    --text-accent: #61c4c8;
    --accent: #61c4c8;

    background: var(--bg-primary);
    border: 1px solid var(--bg-hairline);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 220ms ease, border-color 220ms ease,
                box-shadow 220ms ease;
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    color: #fff;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(198,161,91,0.35);
        box-shadow: var(--shadow-hover);
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    background: linear-gradient(160deg, #223148 0%, #0F1A2A 100%);
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease;
    ${Card}:hover & { transform: scale(1.04); }
`;

const Placeholder = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
`;
const PlaceholderMark = styled.span`
    font-size: 2rem;
    color: var(--text-accent);
    opacity: 0.6;
`;
const PlaceholderText = styled.span`
    font-size: 0.7rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
`;

const Overlay = styled.div`
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(198,161,91,0.14);
    border-radius: 2px;
    pointer-events: none;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 14px 14px 14px;
    border-top: 1px solid var(--bg-hairline);
`;

const ProductName = styled.h4`
    color: var(--text-primary);
    font-size: 1rem;
    line-height: 1.35;
    font-weight: 500;
    min-height: 2.7em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const PriceGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;
const PriceLabel = styled.span`
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
`;
const Price = styled.span`
    font-size: 1.15rem;
    color: var(--text-accent);
    font-weight: 600;
`;

const AddButton = styled.button`
    all: unset;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    border: 1px solid var(--btn-ghost-border);
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color 160ms ease, color 160ms ease,
                border-color 160ms ease;

    &:hover {
        background: var(--accent);
        color: var(--accent-contrast);
        border-color: var(--accent);
    }
`;

Object.freeze(content);
export default content;
