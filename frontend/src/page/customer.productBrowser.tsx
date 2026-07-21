import react          from "react";
import styled         from "styled-components";
import ctx            from "#context/common.ts";
import ctxCustomer    from "#context/customer.ts";
import cmmNavigation  from "#util/common.navigation.ts";
import apiStorage     from "#util/api.storage.ts";

import { useSearchParams } from "react-router";
import type { MouseEvent } from "react";

import { RefreshCwOff, ShoppingBasket } from "lucide-react";

/**
 * ส่วนประกอบหน้าต่างเลือกสินค้า
*/
const content = function ProductBrowser ()
{
  return (<>
    <content.List/>
    <content.Filter/>
    <content.Cart/>
  </>);
}
content.List = function ProductBrowserList ()
{  
  const [serachParam] = useSearchParams ();
  const search = serachParam.get ("search");
  const queryList = ctxCustomer.useProductList ({
    search: search ?? ""
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

      return <content.ListItem 
        key={key}
        id={id}
        name={name}
        artwork={artwork}
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
    <StyledListItemContainer onClick={onClick}>
      <StyledListItem src={prop.artwork}/>
      <StyledListItemText>{prop.name}</StyledListItemText>
    </StyledListItemContainer>
  )
}
/**
 * ส่วนประกอบแสดงตัวเลือกการค้นหาสินค้า
*/
content.Filter = function ProductBrowserFilter ()
{
  return (
    <StyledFilter>
      <StyledFilterLabel>ตัวเลือก</StyledFilterLabel>
      <div>
        <input type="checkbox"/>
        <label></label>
      </div>
    </StyledFilter>
  );
}
/**
 * ส่วนประกอบแสดงผลไอคอนตะกร้า
*/
content.Cart = function ProductBrowserCart ()
{
  const auth = ctx.useAuth ();
  const cart = ctxCustomer.useCart ();
  const cartQuery = ctxCustomer.useCartQuery ();

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
    <StyledCart onClick={onClick} $visible={ctx.authSigned (auth)}>
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
    min-width: 200px;
    min-height: 300px;

    max-width: 200px;
    max-height: 300px;
  }
  @media (max-width: 640px)
  {
    min-width: 100px;
    min-height: 175px;

    max-width: 100px;
    max-height: 175px;
  }
  /* @media (max-width: 512px)
  {
    min-width: 75px;
    min-height: 150px;

    max-width: 75px;
    max-height: 150px;
  } */
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
const StyledCart = styled.button<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
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
/**
 * ส่งออกตัวแปร
*/
export default content;