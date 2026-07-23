import react, { useState }          from "react";
import styled         from "styled-components";
import cmmNavigation  from "#util/common.navigation.ts";
import apiStorage     from "#util/api.storage.ts";

import Filter         from "#component/customer.productBrowser.filter.tsx";
import { type FilterState } from "#component/customer.productBrowser.filter.tsx";

import { useSearchParams } from "react-router";
import type { Dispatch, MouseEvent, SetStateAction } from "react";

import { RefreshCwOff, ShoppingBasket, ShoppingCart } from "lucide-react";
import { useAccountBasic, useCart, useCartQuery, useProductList } 
from "#context/customer.ts";

/**
 * ส่วนประกอบหน้าต่างเลือกสินค้า
*/
const content = function ProductBrowser ()
{
  const [filter, setFilter] = useState<FilterState | undefined> (undefined);

  return (<>
    <content.List filter={filter}/>
    <content.Filter filter={[filter, setFilter]}/>
    <content.Cart/>
  </>);
}
content.List = function ProductBrowserList ({ filter }: { filter: FilterState | undefined; })
{  
  const [serachParam] = useSearchParams ();
  const search = serachParam.get ("search");
  const queryList = useProductList ({
    search: search ?? "",
    category: filter ? [] : undefined,
    minPrice: filter ? filter.price.min : undefined,
    maxPrice: filter ? filter.price.max : undefined,
  });
  
  const showQuery = queryList;
  const showContent = !showQuery.isError;
  const showAlert = showQuery.isLoadingError || showQuery.isFetching;
  const isLoading = showQuery.isLoading;
  const isLoadingError = showQuery.isLoadingError;

  react.useEffect (() =>
  {
    void queryList.refetch ();
  },
  [search]);
  
  /**
   * ทำงานเมื่อผู้ใช้กดเลือกสินค้าบนรายการ
  */
  const onClick = (id: number) =>
  {
    void cmmNavigation.toProduct (id);
    return;
  }
  /**
   * แสดงผลรายการหลังจากข้อมูลโหลดเรียบร้อยแล้ว
  */
  const onRender = () =>
  {
    const query = queryList;

    if (!query.data) 
    {
      return (<></>);
    }
    return (query.data.map ((x) =>
    {
      const key = String (x.id);
      const id = x.id;
      const name = x.name;
      const artwork = (x.cover.length > 0) ? 
        apiStorage.getUrlStream (x.cover) : undefined;
      const price = x.price;

      return <content.ListItem 
        key={key}
        id={id}
        name={name}
        artwork={artwork}
        price={price}
        onClick={onClick}/>
    }));
  }
  /**
   * แสดงผลการแจ้งเตือนในขณะที่ระบบกำลังดำเนินการ
  */
  const onRenderAlert = () =>
  {
    if (isLoadingError) 
    {
      return <>
        <RefreshCwOff size={64}/>
        <p>เกิดข้อผิดพลาดการโหลดรายการสินค้า</p>
      </>
    }
    if (isLoading) 
    {
      return <p>กำลังโหลดรายการสินค้า</p>
    }
    return <></>;
  }

  return (
    <SyledList>
      <StyleListContent $visible={showContent}>
        { onRender () }
      </StyleListContent>
      <StyleListAlert $visible={showAlert}>
        { onRenderAlert () }
      </StyleListAlert>
    </SyledList>
  );
}
/**
 * ส่วนประกอบแสดงชิ้นสินค้าในรายการสินค้า 
*/
content.ListItem = function ProductBrowserListItem (prop: PropListItem)
{
  /**
   * ทำงานเมื่อผู้ใช้กดเลือกสินค้าดังกล่าว
  */
  const onClick = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();
    prop.onClick (prop.id);
  }

  return (
    <Card aria-label={`ดูรายละเอียด ${prop.name}`} onClick={onClick}>
      <ImageWrapper>
          {
              prop.artwork
                  ? <Image src={prop.artwork} alt={prop.name}/>
                  : <Placeholder>
                      <PlaceholderMark>✦</PlaceholderMark>
                      <PlaceholderText>รูปเกม</PlaceholderText>
                    </Placeholder>
          }
          <Overlay/>
      </ImageWrapper>

      <Info>
          <ProductName>{prop.name}</ProductName>
          <Footer>
              <PriceGroup>
                  <PriceLabel>ราคา</PriceLabel>
                  <Price>{prop.price.toFixed (2)} <span style={{ color: "white" }}>฿</span></Price>
              </PriceGroup>
              <AddButton onClick={onClick} aria-label="เพิ่มลงตะกร้า">
                  <ShoppingCart size={16}/>
              </AddButton>
          </Footer>
      </Info>
  </Card>
  )
}
/**
 * ส่วนประกอบแสดงตัวเลือกการค้นหาสินค้า
*/
content.Filter = function ProductBrowserFilter (
  { filter}: 
  { filter: [FilterState | undefined, Dispatch<SetStateAction<FilterState | undefined>>];})
{
  return (
    <StyledFilter>
      <StyledFilterInner>
        <Filter onChange={(next) => { filter[1] (next); }}/>
      </StyledFilterInner>
    </StyledFilter>
  );
}
/**
 * ส่วนประกอบแสดงผลไอคอนตะกร้า
*/
content.Cart = function ProductBrowserCart ()
{
  const cart = useCart ();
  const cartQuery = useCartQuery ();
  const accountQuery = useAccountBasic ();

  /**
   * ทำงานเมื่อผู้ใช้ต้องกดเปิดตะกร้าของตนเอง
  */
  const onClick = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    cart.setVisible (true);
    cart.setClose (() => { cart.setVisible (false); });
  }

  const data = cartQuery.data;
  const count = data ? data.reduce ((x, y) => x += y.quantity, 0) : 0;

  return (
    <StyledCart onClick={onClick} $visible={accountQuery.data !== undefined}>
      <StyledCartLabel>{count}</StyledCartLabel>
      <ShoppingBasket/>
    </StyledCart>
  );
}

/**
 * โครงสร้างข้อมูลที่ส่วนประกอบต้องการใช้งาน: ตัวสินค้า
*/
interface PropListItem
{
  /**
   * รหัสสินค้า
  */
  id: number;
  /**
   * ชื่อสินค้า
  */
  name: string;
  /**
   * ปกสินค้า
  */
  artwork: string | undefined;
  /**
   * ราคา
  */
  price: number;
  /**
   * ทำงานเมื่อผู้ใช้กดเลือกสินค้า
  */
  onClick: (id: number) => void;
}

const SyledList = styled.div`

  position: relative;
  gap: 8px;
  overflow: hidden auto;
  margin: 48px 510px 0px 254px;
  padding: 16px 2px 16px 2px;

  @media (max-width: 1600px)
  {
    margin: 48px 510px 16px 126px;
  }
  @media (max-width: 1440px)
  {
    margin: 48px 382px 16px 30px;
  }
  @media (max-width: 1200px)
  {
    margin: 48px 382px 16px 14px;
  }
  @media (max-width: 1024px)
  {
    margin: 48px 62px 16px 62px;
  }
  @media (max-width: 768px)
  {
    margin: 48px 14px 16px 14px;
  }
`;
const StyleListAlert = styled.div<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "flex" : "none"};
  flex-direction: column;
  gap: 16px;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
`;
const StyleListContent = styled.div<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "flex" : "none"};
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;
const StyledFilter = styled.div`
  position: fixed;
  inset: 64px 144px 16px auto;
  width: 324px;
  background-color: var(--bg-primary);
  border-radius: 4px;

  @media (max-width: 1920px)
  {
    inset: 64px 192px 16px auto;
  }
  @media (max-width: 1440px)
  {
    inset: 64px 64px 16px auto;
  }
  @media (max-width: 1024px)
  {
    display: none;
    inset: 0px 0px 0px 0px;
  }
`;
const StyledFilterInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  overflow-y: scroll;
`;

const StyledCart = styled.button<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
  position: fixed;
  inset: auto 64px 64px auto;
  width: 64px;
  height: 64px;
  padding: 0px;
  margin: 0px;
  border-radius: 100%;

  & > img,
  & > svg
  {
    display: inline-block;
    min-width: 32px;
    min-height: 32px;
    vertical-align: middle;
  }
  @media (max-width: 1024px)
  {
    bottom: 24px;
    right: 32px;
  }
`;
const StyledCartLabel = styled.label`
  position: absolute;
  inset: auto -16px 0px auto;
  font-size: 1rem;

  min-width: 24px;
  min-height: 24px;
  padding: 0px 4px;
  text-align: center;

  background-color: #FF7373;
  border-radius: 4px;
`;

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
    max-height: 324px;
    min-width: 100px;
    min-height: 300px;
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
    font-size: 1.0rem;
    text-transform: uppercase;
    color: var(--text-muted);
`;
const Price = styled.span`
    font-size: 1.25rem;
    color: var(--text-accent);
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

/**
 * ส่งออกตัวแปร
*/
export default content;