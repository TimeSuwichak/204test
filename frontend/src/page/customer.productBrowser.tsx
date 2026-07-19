import react      from "react";
import styled     from "styled-components";

import cmmCtx from "#context/common.ts";
import cmmNavigation from "#util/common.navigation.ts";
import apiAccount from "#util/api.account.ts";
import apiProduct from "#util/api.product.ts";

import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { BasicFetch as ProductBasicFetch } from "#util/api.product.ts";
import type { CartFetch } from "#util/api.account.ts";

import { ShoppingBasket } from "lucide-react";

/**
 * ส่วนประกอบหน้าต่างเลือกสินค้า
*/
const content = function ProductBrowser ()
{
  const [serachParam] = useSearchParams ();
  const search = serachParam.get ("search");
  const auth = cmmCtx.useAuth ();

  const queryList = useQuery ({
    queryKey: ["Product", "GetBasicByList"],
    queryFn: () => apiProduct.getBasicList (auth.session, {
      search: search ?? undefined
    }),
  });
  const queryCart = useQuery ({
    queryKey: ["Cart"],
    queryFn: () => apiAccount.getCartList (auth.session)
  });

  react.useEffect (() =>
  {
    void queryList.refetch ();
  },
  [search]);

  return (<>
    <content.List queryList={queryList}/>
    <content.Filter/>
    <content.Cart queryCart={queryCart}/>
  </>);
}
content.List = function ProductBrowserList (prop: PropList)
{
  const [children, setChildren] = react.useState<ReactNode> ([]);

  const onClick = (id: number) =>
  {
    void cmmNavigation.toProduct (id);
    return;
  }
  const onRender = () =>
  {
    const query = prop.queryList;

    if (!query.data) {
      return <></>;
    }
    if (query.error) {
      console.error (query.error);
    }
    setChildren (query.data.map ((x) =>
    {
      const key = String (x.id);
      const id = x.id;
      const name = x.name;
      const artwork = (x.artwork.length > 0) ? x.artwork : undefined;

      return <content.ListItem 
        key={key}
        id={id}
        name={name}
        artwork={artwork}
        onClick={onClick}/>
    }));
  }
  react.useEffect (() =>
  {
    onRender ();
    return;
  },
  [prop.queryList]);

  return (
    <SyledList>
      {children}
    </SyledList>
  );
}
content.ListItem = function ProductBrowserListItem (prop: PropListItem)
{
  const onClick = (event: react.MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    prop.onClick (prop.id);
  }

  return (
    <StyledListItemContainer onClick={onClick}>
      <StyledListItem src={prop.artwork}/>
      <StyledListItemText>{prop.name}</StyledListItemText>
    </StyledListItemContainer>
  )
}
content.Filter = function ProductBrowserFilter ()
{
  return (
    <StyledFilter>
      <StyledFilterLabel>ตัวเลือก</StyledFilterLabel>
    </StyledFilter>
  );
}
content.Cart = function ProductBrowserCart (prop: PropCart)
{
  const [count, setCount] = react.useState ("");

  react.useEffect (() =>
  {
    const query = prop.queryCart;
    const data = query.data;

    if (!data) {
      setCount ("0");
      return;
    }
    setCount (String (data.length));
  },
  [prop.queryCart]);

  return (
    <StyledCart>
      <StyledCartLabel>{count}</StyledCartLabel>
      <ShoppingBasket/>
    </StyledCart>
  );
}


/**
 * โครงสร้างข้อมูลที่ส่วนประกอบต้องการใช้งาน: รายการสินค้า
*/
interface PropList
{
  /**
   * ระบบดึงข้อมูลรายการสินค้า
  */
  queryList: UseQueryResult<ProductBasicFetch []>;
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
   * ทำงานเมื่อผู้ใช้กดเลือกสินค้า
  */
  onClick: (id: number) => void;
}
interface PropCart
{
  /**
   * ระบบดึงข้อมูลตะกร้าสินค้า
  */
  queryCart: UseQueryResult<CartFetch []>;
}

const SyledList = styled.div`

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
const StyledListItemContainer = styled.button`

  min-width: 200px;
  min-height: 300px;

  max-width: 200px;
  max-height: 300px;

  display: block;
  margin: 0px;
  padding: 0px 0px 40px 0px;

  outline: var(--bg-primary-border) solid 0px;
  background-color: transparent;
  transition: outline 66ms cubic-bezier(0.16, 1, 0.3, 1);
  transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
  transition: height 500ms cubic-bezier(0.16, 1, 0.3, 1);

  &:hover, &:focus
  {
    outline-width: 2px;
  }
  &:active
  {
    outline-width: 2px;
  }

  @media (max-width: 960px)
  {
    min-width: 150px;
    min-height: 200px;

    max-width: 150px;
    max-height: 200px;
  }
  @media (max-width: 640px)
  {
    min-width: 125px;
    min-height: 175px;

    max-width: 125px;
    max-height: 175px;
  }
  @media (max-width: 512px)
  {
    min-width: 100px;
    min-height: 150px;

    max-width: 100px;
    max-height: 150px;
  }
`;
const StyledListItemText = styled.label`
  display: block;
  margin-top: 8px;
`;
const StyledListItem = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -ms-user-select: none;
`;
const StyledFilter = styled.div`
  position: fixed;
  inset: 64px 144px auto auto;
  width: 324px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  padding: 8px 16px;

  @media (max-width: 1920px)
  {
    inset: 64px 192px auto auto;
  }
  @media (max-width: 1440px)
  {
    inset: 64px 64px auto auto;
  }
  @media (max-width: 1024px)
  {
    display: none;
    inset: 0px 0px 0px 0px;
  }
`;
const StyledFilterLabel = styled.label`
  width: 100%;
  height: 32px;
  display: block;
  font-size: 1.25rem;
  font-weight: normal;
`;
const StyledCart = styled.button`
  position: absolute;
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
`;
const StyledCartLabel = styled.label`
  position: absolute;
  inset: auto -8px 0px auto;
  font-size: 1rem;

  width: 24px;
  height: 24px;
  text-align: center;

  background-color: #FF7373;
  border-radius: 100%;
`;

/**
 * แข็งวัตถุ (ความปลอดภัย)
*/
Object.freeze (content);
/**
 * ส่งออกตัวแปร
*/
export default content;