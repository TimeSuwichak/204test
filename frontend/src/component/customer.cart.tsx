import styled       from "styled-components";
import ctx          from "#context/common.ts";
import ctxCustomer  from "#context/customer.ts";
import apiAccount   from "#util/api.account.ts";
import apiProduct   from "#util/api.product.ts";
import apiStorage   from "#util/api.storage.ts";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

const content = function CustomerCart (prop: PropRoot)
{
  return content.Root (prop);
}
content.Root = function CartRoot (prop: PropRoot)
{
  const visible = prop.visible ?? false;
  const auth = ctx.useAuth ();

  const { data: fetchItem } = useQuery ({
    queryKey: ["Cart"],
    queryFn: () => apiAccount.getCartList (auth.session)
  });

  const Component = ({ productId }: {productId: number;}) =>
  {
      const { data } = useQuery ({
        queryKey: ["Product", "Basic", productId],
        queryFn: () => apiProduct.getBasic (auth.session, productId)
      });

      return (
        <content.ListItem 
          key={productId} 
          name={data?.name ?? ""}
          cover={apiStorage.getUrlStream (data?.cover ?? "")}/>
      );
  }

  const onRenderItem = () =>
  {
    return (fetchItem ? fetchItem.map ((x) =>
    {
      return <Component productId={x.productId} key={x.itemId}/>
    }) : []);
  }
  return (
    <content.View visible={visible}>
      <content.ViewPanel>
        <content.Header onClose={prop.onClose}/>
        <content.List>
          {onRenderItem ()}
        </content.List>
      </content.ViewPanel>
    </content.View>
  );
}
content.View = function CartView (prop: PropView)
{
  return (
    <StyleView $visible={prop.visible ?? true}>
      <StyleViewInner $visible={prop.visible ?? true}>
        {prop.children}
      </StyleViewInner>
    </StyleView>
  )
}
content.ViewPanel = function CartViewPanel (prop: PropViewPanel)
{
  return (
    <StyleViewPanel>
      {prop.children}
    </StyleViewPanel>
  );
}
content.Header = function CartHeader (prop: PropHeader)
{
  const onClick = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClose) {
      prop.onClose ();
    }
  }

  return (
    <StyleHeader>
      <StyleHeaderText>ตะกร้าสินค้าของคุณ</StyleHeaderText>
      <StyleHeaderClose onClick={onClick}>
        <XIcon/>
      </StyleHeaderClose>
    </StyleHeader>
  )
}
content.List = function CartList (prop: PropList)
{
  return (
    <StyleItemContainer>{prop.children}</StyleItemContainer>
  );
}
content.ListItem = function CartListItem (prop: PropListItem)
{
  return (
    <StyleItem>
      <StyleItemImg src={prop.cover}/>
      <StyleItemText>{prop.name}</StyleItemText>
    </StyleItem>
  );
}

content.Provider = function CartProvider ()
{
  const context = ctxCustomer.useCart ();
  const close = useRef (() => { return });
  const [visible, setVisible] = useState (false);

  useEffect (() =>
  {
    context.setVisible = (value) =>
    {
      setVisible (value);
    }
    context.setClose = (value) =>
    {
      close.current = value;
    }

    return () =>
    {
      context.setVisible = () => { return; }
      context.setClose = () => { return; }
    }
  });

  return (
    <content.Root 
      visible={visible} 
      onClose={close.current}/>
  )
}

const StyleView = styled.div<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
  pointer-events: ${prop => prop.$visible ? "all" : "none"};
  position: fixed;
  overflow: hidden;
  overscroll-behavior: none;
  inset: 0px;
`;
const StyleViewInner = styled.div<{ $visible: boolean; }>`
  width: 100%;
  height: 100%;
  background-color: 
    ${prop => prop.$visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)"};

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;
const StyleViewPanel = styled.div`
  max-width: 1268px;
  max-height: 768px;
  width: 100%;
  height: 100%;
  pointer-events: all;
  background-color: var(--bg-primary);
  border: 2px solid var(--bg-primary-border);
  border-radius: 4px;
  padding: 16px;

  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;
const StyleHeader = styled.header`
  width: 100%;
  height: 64px;
`;
const StyleHeaderText = styled.h1`
  font-size: 2rem;
  font-weight: normal;
`;
const StyleHeaderClose = styled.button`
  position: absolute;
  inset: 16px 16px auto auto;
  width: 40px;
  height: 40px;
  padding: 0px;
  margin: 0px;

  & > img, & > svg
  {
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: middle;
  }
`;

const StyleItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;
const StyleItem = styled.button`

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
const StyleItemText = styled.label`
  display: block;
  margin-top: 8px;
`;
const StyleItemImg = styled.img`
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

interface PropRoot
{
  visible ?: boolean;
  onClose ?: () => void;
}
interface PropView
{
  visible ?: boolean;
  children ?: ReactNode;
}
interface PropViewPanel
{
  children ?: ReactNode;
}
interface PropHeader
{
  onClose ?: () => void;
}
interface PropList
{
  children ?: ReactNode;
}
interface PropListItem
{
  name: string;
  cover: string;
}

/**
 * ส่งออกตัวแปร
*/
export default content;