import styled       from "styled-components";
import ctx          from "#context/common.ts";
import ctxUI        from "#context/common.ui.ts";
import ctxCustomer  from "#context/customer.ts";
import apiAccount   from "#util/api.account.ts";
import apiStorage   from "#util/api.storage.ts";

import { useEffect, useRef, useState } from "react";
import { XIcon, MinusIcon, PlusIcon } from "lucide-react";
import { type MouseEvent } from "react";

/**
 * ส่วนประกอบการแสดงผลรายการในตะกร้าและการสั่งซื้อสินค้า
*/
const content = function CustomerCart (prop: PropRoot)
{
  return content.Root (prop);
}
/**
 * ส่วนประกอบรวมทุกส่วนประกอบย่อยเข้าด้วยกัน 
 * พร้อมเพิ่มเติมตรรกะของระบบ
*/
content.Root = function CartRoot (prop: PropRoot)
{
  const onClickClose = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (prop.onClose) {
      prop.onClose ();
    }
  }

  return (
    <StyleView $visible={prop.visible ?? true}>
      <StyleViewInner $visible={prop.visible ?? true}>
        <StyleViewPanel>
            <StyleHeader>
            <StyleHeaderText>ตะกร้าสินค้าของคุณ</StyleHeaderText>
            <StyleHeaderClose onClick={onClickClose}>
              <XIcon/>
            </StyleHeaderClose>
          </StyleHeader>
          <StyleMain>
            <content.List/>
            <StyleMainSidebar>
              <content.Receipt/>
              <content.Summary/>
              <button>สั่งซื้อสินค้า</button>
            </StyleMainSidebar>
          </StyleMain>
        </StyleViewPanel>
      </StyleViewInner>
    </StyleView>
  );
}
content.List = function CartList ()
{
  const queryList = ctxCustomer.useCartQuery ();
  const queryData = queryList.data;

  return (
    <StyleItemContainer>
      {(queryData) ?
        (queryData.map ((x) => <content.ListItem 
          key={x.itemId} pid={x.productId}/>)) : 
        (<></>)
      }
    </StyleItemContainer>
  );
}
content.ListItem = function CartListItem ({ pid }: { pid: number; })
{
  const queryData = ctxCustomer.useProduct (pid);
  const data = queryData.data;
  const cover = data ? apiStorage.getUrlStream (data.cover) : undefined;
  const name = data ? data.name : "";

  return (
    <StyleItem>
      <StyleItemImg src={cover}/>
      <StyleItemText>{name}</StyleItemText>
    </StyleItem>
  );
}
content.Receipt = function CartReceipt ()
{
  const queryList = ctxCustomer.useCartQuery ();
  const queryData = queryList.data;

  return (
    <StyleReceipt>
      <StyleReceipLabel>รายการสินค้า</StyleReceipLabel>
      <StyleReceiptBody>
        {(queryData) ?
          (queryData.map ((x) => <content.ReceiptItem 
            key={x.itemId} uid={x.itemId} pid={x.productId}/>)) : 
          (<></>)
        }
      </StyleReceiptBody>
    </StyleReceipt>
  );
}
content.ReceiptItem = function CartReceiptItem ({ uid, pid }: { 
  uid: number; pid: number; })
{
  const auth = ctx.useAuth ();
  const toast = ctxUI.useToast ();
  const queryList = ctxCustomer.useCartQuery ();
  const queryItem = ctxCustomer.useProduct (pid);
  const list = queryList.data;
  const item = queryItem.data;
  const name = item ? item.name : "";
  const quantityFind = list ? list.find (x => x.itemId === uid) : undefined;
  const quantity = quantityFind ? quantityFind.quantity : 0;
  const pending = queryList.isLoading;

  const onClickIncrement = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    void apiAccount.updateCart (auth.session, {
      itemId: uid,
      quantity: quantity + 1
    })
    .then (() => queryList.refetch ());
  }
  const onClickDecrement = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (quantity === 1)
    {
      void apiAccount.deleteCart (auth.session, uid)
        .then (() => queryList.refetch ())
        .then (() =>
        {
          toast.setText (`ลบ ${name} ออกเรียบร้อย`);
          toast.setDuration (5000);
          toast.setVisible (true);
        });
    }
    else
    {
      void apiAccount.updateCart (auth.session, {
        itemId: uid,
        quantity: quantity - 1
      })
      .then (() => queryList.refetch ());
    }
  }
  
  return (
    <StyleReceiptItem>
      <StyleReceiptItemText1>{name}</StyleReceiptItemText1>
      <StyleReceiptItemText2>{quantity} จำนวน</StyleReceiptItemText2>
      <StyleReceiptItemBtn1 onClick={onClickIncrement} disabled={pending}>
        <PlusIcon/>
      </StyleReceiptItemBtn1>
      <StyleReceiptItemBtn2 onClick={onClickDecrement} disabled={pending}>
        <MinusIcon/>
      </StyleReceiptItemBtn2>
    </StyleReceiptItem>
  );
}
content.Summary = function CartSummary ()
{
  const queryList = ctxCustomer.useCartQuery ();
  const queryBasics = ctxCustomer.useProducts (!queryList.data ? [] : 
    queryList.data.map ((x) => x.productId)
  );
  
  const list = queryList.data;
  const basic = queryBasics;
  
  const quantity = list ? 
    list.reduce ((x, y) => x += y.quantity, 0) : 0;

  const sum = list ? list.map ((x) =>
  {
    const prod = basic.find (y => x.productId == y.data?.id);
    const price = prod ? prod.data?.price ?? 0 : 0;
    const sum = price * x.quantity;

    return sum;

  }).reduce ((x, y) => x + y, 0) : 0;

  const discount = 0;
  const total = sum - discount;

  return (
    <>
      <p>
        ทั้งหมด {quantity} ชิ้น
        รวมเป็นจำนวนเงิน {sum} บาท
        <br/>
        ส่วนลด {discount} บาท
        ทั้งหมด {total} บาท
        <br/>
        (การคำนวณนี้ไม่รวมภาษี)
      </p>
    </>
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

  @media (max-width: 860px)
  {
    max-width: 100%;
    max-height: 100%;
  }
`;
const StyleHeader = styled.header`
  width: 100%;
  height: 64px;
`;
const StyleMain = styled.main`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 860px)
  {
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;
const StyleMainSidebar = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;

  @media (max-width: 1268px)
  {
    width: 324px;
  }
  @media (max-width: 860px)
  {
    width: 100%;
  }
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
  width: 75%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding: 2px 2px 8px 2px;

  @media (max-width: 860px)
  {
    width: 100%;
  }
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

const StyleReceipt = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  padding: 8px 16px;
`;
const StyleReceipLabel = styled.label`
  display: block;
  font-size: 1.25rem;
`;
const StyleReceiptBody = styled.div`
  padding: 16px 0px;
`;
const StyleReceiptItem = styled.div`
  width: 100%;
  height: 48px;
  position: relative;
`;
const StyleReceiptItemText1 = styled.label`
  display: block;
  width: 100%;
  color: var(--text-primary);
`;
const StyleReceiptItemText2 = styled.label`
  display: block;
  width: 100%;
  color: #adadad;
`;
const StyleReceiptItemBtn1 = styled.button`
  position: absolute;
  inset: 4px 4px 4px auto;
  display: block;
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
const StyleReceiptItemBtn2 = styled.button`
  position: absolute;
  inset: 4px 48px 4px auto;
  display: block;
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
interface PropRoot
{
  visible ?: boolean;
  onClose ?: () => void;
}
/**
 * ส่งออกตัวแปร
*/
export default content;