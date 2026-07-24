import apiAccount from "#util/api.account.ts";
import apiPromotion from "#util/api.promotion.ts";
import apiStorage from "#util/api.storage.ts";

import { useState, type ChangeEvent, type Dispatch, type MouseEvent, type SetStateAction, type SubmitEvent } from "react";
import { styled } from "styled-components";
import { useAuth } from "#context/common.ts";
import { useToast } from "#context/common.ui.ts";
import { useCartQuery, useProduct, useProducts, usePromotion } 
from "#context/customer.ts";

import 
{ 
  XIcon, MinusIcon, PlusIcon, Trash2Icon, 
  TagIcon, TicketIcon, ArrowRightIcon 
} 
from "lucide-react";

export default function CustomerCartList (
  { discount, onContinue, onClose }: 
  { 
    readonly discount: [string, Dispatch<SetStateAction<string>>];
    readonly onContinue: () => void;
    readonly onClose: () => void;
  }
)
{
  /**
   * ทำงานเมื่อผู้ใช้ต้องการกดปิดหน้าตะกร้า
  */
  function onClickClose (event: MouseEvent)
  {
    event.preventDefault();
    event.stopPropagation();

    onClose ();
  }
  /**
   * ทำงานเมื่อผู้ใช้ต้องการกดดำเนินการต่อ
  */
  function onClickContinue (event: MouseEvent)
  {
    event.preventDefault();
    event.stopPropagation();

    onContinue ();
  };

  const qList = useCartQuery();
  const qData = qList.data;
  const canCheckout = qData ? (qData.length > 0) : false;

  return (<>
    <StyleHeader>
      <StyleHeaderText>ตะกร้าสินค้าของคุณ</StyleHeaderText>
      <StyleHeaderClose onClick={onClickClose} aria-label="ปิดตะกร้าสินค้า">
        <XIcon/>
      </StyleHeaderClose>
    </StyleHeader>
    <StyleMain>
    {/* ฝั่งซ้าย: รายการเกมในตะกร้า */}
    <StyleMainContent>
      <SubItemList/>
    </StyleMainContent>
    {/* ฝั่งขวา: รายการสินค้าแบบยืดยาว + สรุปคำสั่งซื้อ และส่วนลด */}
    <StyleMainSidebar>
      <SubReceipt/>
      <SubDiscount st={discount}/>
      <SubSummary st={discount} />
      <StlCheckout 
        onClick={onClickContinue}
        disabled={!canCheckout}>
        <span>สั่งซื้อสินค้า</span>
        <ArrowRightIcon size={18} />
      </StlCheckout>
    </StyleMainSidebar>
  </StyleMain>
  </>);
}

/**
 * ส่วนประกอบแสดงรายการสินค้าในตะกร้า
*/
function SubItemList ()
{
  const qList = useCartQuery();
  const qData = qList.data;

  if (!qData || qData.length === 0) 
  {
    return (
      <StyleEmptyState>
        <p>ไม่มีสินค้าในตะกร้าของคุณ</p>
      </StyleEmptyState>
    );
  }

  return (
    <StyleItemContainer>
      {qData.map((x) => (
        <SubItemChild 
          key={x.itemId} 
          uid={x.itemId} 
          pid={x.productId}/>
      ))}
    </StyleItemContainer>
  );
}
/**
 * ส่วนประกอบแสดงชิ้นสินค้าในรายการ
*/
function SubItemChild ({ uid, pid}: { uid: number; pid: number; })
{
  //
  // ใช้งานบริการระบบ
  //
  const auth = useAuth ();
  const toast = useToast ();

  //
  // ดึงข้อมูลจากเซิร์ฟเวอร์
  //
  const qCart = useCartQuery ();
  const qProdBasic = useProduct (pid);
  
  const cart = qCart.data;
  const prodBasic = qProdBasic.data;
  
  //
  // คำนวณข้อมูลสำหรับการแสดงผล
  //
  const cover = prodBasic ? 
      apiStorage.getUrlStream(prodBasic.cover) : undefined;
  const name = prodBasic ? 
      prodBasic.name : "กำลังโหลด...";
  const developer = "";
  const tags = ["Action", "RPG"];

  const quantityFind = cart ? cart.find((x) => x.itemId === uid) : undefined;
  const quantity = quantityFind ? quantityFind.quantity : 1;
  const pending = qCart.isLoading;

  /**
   * ลดจำนวนสินค้า
  */
  function onDecrement (event: MouseEvent)
  {
    //
    // ป้องกันการกดโดนการ์ด
    //
    event.preventDefault ();
    event.stopPropagation ();

    if (quantity === 1)
    {
      //
      // ลบสินค้าดังกล่าวออกจากตะกร้า
      //
      void apiAccount
        .deleteCart(auth.session, uid)
        .then(() => qCart.refetch())
        .then(() => {
          toast.setText(`ลบ ${name} ออกจากตะกร้าเรียบร้อย`);
          toast.setDuration(4000);
          toast.setVisible(true);
        });
      return;
    }
    void apiAccount
      .updateCart(auth.session, {
        itemId: uid,
        quantity: quantity - 1,
      })
      .then(() => qCart.refetch());
  };
  /**
   * เพิ่มจำนวนสินค้า
  */
  function onIncrement (event: MouseEvent)
  {
    //
    // ป้องกันการกดโดนการ์ด
    //
    event.preventDefault ();
    event.stopPropagation ();

    void apiAccount
        .updateCart(auth.session, {
          itemId: uid,
          quantity: quantity + 1,
        })
        .then(() => qCart.refetch());
  }
  /**
   * นำทางไปยังหน้ารายละเอียดสินค้าเมื่อคลิกการ์ด
  */
  function onClick (event: MouseEvent) 
  {
    event.preventDefault ();
    event.stopPropagation ();
  }

  return (
    <StyleItemCard>
      <StyleItemImgWrapper onClick={onClick}>
        <StyleItemImg src={cover} alt={name} />
      </StyleItemImgWrapper>

      <StyleItemDetails>
        <StyleItemHeaderBlock>
          <StyleItemTitle>{name}</StyleItemTitle>
          <StyleItemDeveloper>ผู้พัฒนา: {developer}</StyleItemDeveloper>
        </StyleItemHeaderBlock>

        <StyleTagContainer>
          {tags.map((tag: string, index: number) => (
            <StyleTagBadge key={index}>
              <TagIcon size={10} />
              <span>{tag}</span>
            </StyleTagBadge>
          ))}
        </StyleTagContainer>

        <StyleItemActionsRow>
          <StyleQuantityControl>
            <StyleQtyBtn
              onClick={onDecrement}
              disabled={pending}
              aria-label="ลดจำนวน"
            >
              <MinusIcon size={16} />
            </StyleQtyBtn>
            <StyleQtyDisplay>{quantity}</StyleQtyDisplay>
            <StyleQtyBtn
              onClick={onIncrement}
              disabled={pending}
              aria-label="เพิ่มจำนวน"
            >
              <PlusIcon size={16} />
            </StyleQtyBtn>
          </StyleQuantityControl>

          <StyleRemoveBtn onClick={onDecrement} disabled={pending}>
            <Trash2Icon size={16} />
            <span>นำออก</span>
          </StyleRemoveBtn>
        </StyleItemActionsRow>
      </StyleItemDetails>
    </StyleItemCard>
  );
}
/**
 * ส่วนประกอบแสดงรายการสินค้าในตะกร้า
*/
function SubReceipt () 
{
  const qList = useCartQuery ();
  const qData = qList.data;

  return (
    <StyleReceipt>
      <StyleReceiptLabel>รายการสินค้า</StyleReceiptLabel>
      <StyleReceiptBody>
        {qData && qData.length > 0 ? (
          qData.map((x) => <SubReceiptItem key={x.itemId} uid={x.itemId} pid={x.productId} />)
        ) : (
          <StyleReceiptEmpty>ไม่มีรายการ</StyleReceiptEmpty>
        )}
      </StyleReceiptBody>
    </StyleReceipt>
  );
}
/**
 * ส่วนประกอบแสดงชิ้นสินค้าบนรายการ
*/
function SubReceiptItem ({ uid, pid }: { uid: number; pid: number; }) 
{
  //
  // ดึงข้อมูลจากเซิร์ฟเวอร์
  //
  const qList = useCartQuery ();
  const qProdBasic = useProduct (pid);
  //
  // คำนวณข้อมูลสำหรับการแสดงผล
  //
  const list = qList.data;
  const item = qProdBasic.data;
  
  const name = item ? item.name : "กำลังโหลด...";
  const price = item ? item.price : 0;
  const quantityFind = list ? list.find((x) => x.itemId === uid) : undefined;
  const quantity = quantityFind ? quantityFind.quantity : 0;

  return (
    <StyleReceiptRow>
      <StyleReceiptItemInfo>
        <StyleReceiptItemName>{name}</StyleReceiptItemName>
        <StyleReceiptItemQty>x{quantity}</StyleReceiptItemQty>
      </StyleReceiptItemInfo>
      <StyleReceiptItemPrice>฿{(price * quantity).toLocaleString()}</StyleReceiptItemPrice>
    </StyleReceiptRow>
  );
};
/**
 * ส่วนประกอบการใช้งานส่วนลด
*/
function SubDiscount ({st}: { st: [string, Dispatch<SetStateAction<string>>]}) 
{
  //
  // ใช้งานบริการระบบ
  //
  const auth = useAuth();
  const toast = useToast();
  //
  // ดึงข้อมูลจากเซิร์ฟเวอร์
  //
  const qCart = useCartQuery ();
  const qProdBasic = useProducts (
    !qCart.data ? [] : qCart.data.map((x) => x.productId)
  );

  const [input, setInput] = useState ("");
  const [output, setOutput] = st;
  //
  // คำนวณข้อมูลสำหรับการแสดงผล
  //
  const list = qCart.data;
  const basic = qProdBasic;

  function onChange (event: ChangeEvent<HTMLInputElement>)
  {
    setInput (event.target.value);
  }
  /**
   * ทำงานเมื่อผู้ใช้เริ่มกดใช้งานโค็ดส่วนลด
  */
  function onSubmit (event: SubmitEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    onActive ();
  }
  /**
   * ทำงานเมื่อผู้ใช้เริ่มกดใช้งานโค็ดส่วนลด
  */
  function onClick (event: MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    onActive ();

  }
  function onActive ()
  {
    void apiPromotion.getBasic (auth.session, output).then ((promotion) =>
    {
      const subtotal = list ? list.map((x) => 
      {
        const prod = basic.find((y) => x.productId == y.data?.id);
        const price = prod ? prod.data?.price ?? 0 : 0;

        return price * x.quantity;
      })
      .reduce((x, y) => x + y, 0) : 0;
  
      if (promotion.minPrice > subtotal)
      {
        toast.setText (
          "ไม่สามารถใช้งานโค้ดส่วนลดนี้ได้ เนื่องจากยอดรวมสินค้าไม่ถึงขั้นต่ำที่กำหนด"
        );
        toast.setDuration (5000);
        toast.setVisible (true);
  
        setOutput ("");
        return;
      }
      if (promotion.used)
      {
        toast.setText (
          "ไม่สามารถใช้งานโค้ดส่วนลดนี้ได้ เนื่องจากคุณได้ใช้งานโค็ดนี้ไปแล้ว"
        );
        toast.setDuration (5000);
        toast.setVisible (true);
        return;
      }
  
      toast.setText ("ใช้งานโค้ดส่วนลดเรียบร้อย");
      toast.setDuration (5000);
      toast.setVisible (true);
  
      setOutput (input);
    })
    .catch (() =>
    {
      toast.setText ("โค้ดส่วนลดไม่ถูกต้อง");
      toast.setDuration (5000);
      toast.setVisible (true);
  
      setOutput ("");
    });
  }

  return (
    <StylePromoBox>
      <StylePromoLabel>
        <TicketIcon size={16} />
        <span>โค้ดส่วนลด</span>
      </StylePromoLabel>
      <StylePromoInputGroup>
        <StylePromoInput
          type="text"
          placeholder="ใส่โค้ดส่วนลดที่นี่"
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <StylePromoApplyBtn 
          onClick={onClick} 
          disabled={list ? list.length === 0 : true}>
          ใช้งาน
        </StylePromoApplyBtn>
      </StylePromoInputGroup>
    </StylePromoBox>
  );
};

function SubSummary ({st}: { st: [string, Dispatch<SetStateAction<string>>]}) 
{
  const [code] = st;
  //
  // ดึงข้อมูลจากเซิร์ฟเวอร์
  //
  const qCart = useCartQuery ();
  const qProd = useProducts (
    !qCart.data ? [] : qCart.data.map((x) => x.productId)
  );
  const qDiscount = usePromotion (code);

  //
  // คำนวณข้อมูลสำหรับการแสดงผล
  //
  const cart = qCart.data;
  const basic = qProd;
  const promotion = qDiscount.data;

  const totalItems = cart ? cart.reduce((x, y) => (x += y.quantity), 0) : 0;

  const subtotal = cart
    ? cart
        .map((x) => {
          const prod = basic.find((y) => x.productId == y.data?.id);
          const price = prod ? prod.data?.price ?? 0 : 0;
          return price * x.quantity;
        })
        .reduce((x, y) => x + y, 0)
    : 0;

  let discount = promotion ? 
    promotion.type === 1 ? promotion.discount :
    promotion.type === 2 ? (subtotal * (promotion.discount / 100)) : 0 : 0;

  discount -= Math.max (0, promotion ? promotion.minPrice - subtotal : 0);
  discount = Math.min (discount, promotion ? promotion.maxDiscount : discount);

  if (promotion && promotion.minPrice > subtotal)
  {
    discount = 0;
  }

  const total = Math.max (0, subtotal - discount);

  return (
    <StyleSummaryBox>
      <StyleSummaryRow>
        <span>ราคารวม ({totalItems} ชิ้น)</span>
        <span>฿{subtotal.toLocaleString()}</span>
      </StyleSummaryRow>
      <StyleSummaryRow>
        <span>ส่วนลด</span>
        <StyleDiscountText $on={code.length > 0}>-฿{discount.toLocaleString()}</StyleDiscountText>
      </StyleSummaryRow>
      {/* <StyleSummaryRow> 
        <span>ภาษีมูลค่าเพิ่ม (7%)</span>
        <span>฿{tax.toLocaleString()}</span>
      </StyleSummaryRow> */}
      <StyleDivider />
      <StyleTotalRow>
        <span>ยอดชำระสุทธิ</span>
        <StlSummaryTotal>฿{total.toLocaleString()}</StlSummaryTotal>
      </StyleTotalRow>
    </StyleSummaryBox>
  );
};

const StyleHeader = styled.header`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyleHeaderText = styled.h1`
  font-size: 2rem;
  font-weight: normal;
  margin: 0;
  color: var(--text-primary, #ffffff);
`;

const StyleHeaderClose = styled.button`
  position: absolute;
  inset: 16px 16px auto auto;
  width: 40px;
  height: 40px;
  padding: 0px;
  margin: 0px;
  background: transparent;
  border: none;
  color: var(--text-primary, #ffffff);
  cursor: pointer;

  & > img,
  & > svg {
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: middle;
  }
`;

const StyleMain = styled.main`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 860px) {
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

const StyleMainContent = styled.div`
  width: 75%;
  overflow-y: auto;

  @media (max-width: 860px) {
    width: 100%;
  }
`;

const StyleMainSidebar = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 12px;

  @media (max-width: 1268px) {
    width: 324px;
  }
  @media (max-width: 860px) {
    width: 100%;
    height: auto;
  }
`;

/* --- Item List Components --- */

const StyleItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 2px 2px 8px 2px;
`;

const StyleEmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary, #a1a1aa);
`;

const StyleItemCard = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  text-align: left;
  background-color: var(--bg-card, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--bg-primary-border, rgba(255, 255, 255, 0.06));
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    border-color: rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 512px) {
    flex-direction: column;
  }
`;

const StyleItemImgWrapper = styled.div`
  height: 192px;
  aspect-ratio: 3 / 4;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #000;

  @media (max-width: 512px) {
    width: 100%;
    height: 160px;
  }
`;

const StyleItemImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
`;

const StyleItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

const StyleItemHeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyleItemTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: normal;
  margin: 0;
  color: var(--text-primary, #ffffff);
`;

const StyleItemDeveloper = styled.span`
  font-size: 1rem;
  font-weight: normal;
  color: var(--text-secondary, #808191);
  margin-top: 2px;
`;

const StyleTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyleTagBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.06);
  font-size: 0.725rem;
  color: var(--text-secondary, #a1a1aa);
`;

const StyleItemActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

const StyleQuantityControl = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 2px;
`;

const StyleQtyBtn = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  padding: 0px;
`;

const StyleQtyDisplay = styled.span`
  font-size: 1rem;
  min-width: 28px;
  text-align: center;
  color: #fff;
`;

const StyleRemoveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #ff4d4f;
  font-size: 0.825rem;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: rgba(255, 77, 79, 0.1);
  }
`;

/* --- Sidebar Components (ส่วนยืดยาวตามแบบเดิม) --- */

const StyleReceipt = styled.div`
  width: 100%;
  height: 100%; /* ยึดเต็มพื้นที่สูงเหมือนต้นฉบับ */
  background-color: var(--bg-secondary);
  border-radius: 4px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyleReceiptLabel = styled.label`
  display: block;
  font-size: 1.25rem;
  color: var(--text-primary, #ffffff);
`;

const StyleReceiptBody = styled.div`
  padding: 12px 0px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyleReceiptEmpty = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary, #72727a);
`;

const StyleReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const StyleReceiptItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
`;

const StyleReceiptItemName = styled.span`
  color: var(--text-secondary, #d1d1d6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
`;

const StyleReceiptItemQty = styled.span`
  color: #72727a;
`;

const StyleReceiptItemPrice = styled.span`
  color: var(--text-primary, #ffffff);
  font-weight: 500;
`;

const StylePromoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StylePromoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.825rem;
  color: var(--text-secondary, #a1a1aa);
`;

const StylePromoInputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const StylePromoInput = styled.input`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: #fff;
  outline: none;

  &:focus {
    border-color: var(--accent-color, #6366f1);
  }
`;

const StylePromoApplyBtn = styled.button`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #fff;
  padding: 0 12px;
  font-size: 0.825rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const StyleSummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 12px;
`;

const StyleSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-primary);
`;

const StyleDiscountText = styled.span<{ $on: boolean; }>`
  color: ${prop => prop.$on ? "#52c41a" : "var(--text-primary)"};
`;

const StyleDivider = styled.hr`
  border: none;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  margin: 2px 0;
`;

const StyleTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary, #ffffff);
`;

const StlSummaryTotal = styled.span`
  font-size: 1.2rem;
  color: var(--accent-color, #61e1fd);
`;

const StlCheckout = styled.button`
  width: 100%;
  height: 44px;
  background: var(--accent-gradient, linear-gradient(135deg, #6366f1 0%, #4f46e5 100%));
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.1s ease, filter 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;
