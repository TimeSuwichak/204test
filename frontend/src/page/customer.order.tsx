import { useState } from "react";
import { HistoryIcon, BoxIcon, TruckIcon, HashIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import styled from "styled-components";
import ctx from "#context/common.ts"
import ctxCustomer from "#context/customer.ts";

/**
 * Item structure within an order
 */
interface ProductItem {
  name: string;
  qty: number;
  price: string;
}

/**
 * Interface / Types for Order Receipt Items
 */
interface OrderItemProps {
  orderNumber: string;
  status: string;
  shippingDate: string;
  items: ProductItem[];
  totalPrice: string;
}

/**
 * Order History Page Component
 */
const content = function Order() {
  return <content.Root />;
};

content.Root = function OrderRoot() {

  const queryList = ctxCustomer.useAccountOrder ();

  const list = queryList.data;


  return (
    <StyleRoot>
      <StyleInner>
        <StyleView>
          <StyleViewContainer>
            <StyleTitle>ประวัติคำสั่งซื้อ</StyleTitle>

            {/* Active Orders Section */}
            <StyleSub>
              <BoxIcon />
              <span>กำลังดำเนินการ</span>
            </StyleSub>
            <StyleList>
              {(!list) ?
                (<></>) :
                (list.map ((x) =>
                {
                  const status = 
                    x.status === 1 ?"กำลังจัดส่ง" :
                    x.status === 2 ? "ส่งแล้ว" :
                    x.status === 3 ? "ล่าช้า" :
                    x.status === 4 ? "ยกเลิก" :
                    "";
                  const shippingDate = x.delivered ? 
                    `${x.delivered.getDate ().toString ().padStart (2, "0")}-${x.delivered.getMonth ().toString ().padStart (2, "0")}-{${x.delivered.getFullYear ().toString ().padStart (4, "0")}} ` : ``;

                  return <content.Item
                    orderNumber={`ORD-2026-${x.orderId}`}
                    status={status}
                    shippingDate={shippingDate}
                    totalPrice={`0 ฿"`}
                    items={[
                      { name: "Battlefield 1", qty: 1, price: "฿ 1,290.00" },
                      { name: "Cyberpunk 2077", qty: 1, price: "฿ 1,790.00" },
                      { name: "Steam Gift Card 500 THB", qty: 2, price: "฿ 1,800.00" },
                    ]}
                  />
                }))
              }
            </StyleList>

            {/* Past Orders Section */}
            <StyleSub>
              <HistoryIcon />
              <span>ข้อมูลย้อนหลัง</span>
            </StyleSub>
            <StyleList>
            </StyleList>
          </StyleViewContainer>
        </StyleView>
      </StyleInner>
    </StyleRoot>
  );
};

content.Item = function OrderItem({
  orderNumber,
  status,
  shippingDate,
  items,
  totalPrice,
}: OrderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isCompleted = status === "จัดส่งสำเร็จแล้ว";
  const hasMultipleItems = items.length > 1;

  // Header display title
  const summaryTitle = hasMultipleItems
    ? `${items[0].name} และอีก ${items.length - 1} รายการ`
    : items[0]?.name;

  return (
    <StyleReceiptItem>
      <StyleReceiptTopBorder />

      <StyleReceiptBody>
        {/* Receipt Top Meta */}
        <StyleOrderHeader>
          <StyleOrderMeta>
            <HashIcon size={14} />
            <span>{orderNumber}</span>
          </StyleOrderMeta>
          <StyleBadge $isCompleted={isCompleted}>{status}</StyleBadge>
        </StyleOrderHeader>

        {/* Primary Summary Bar or Toggle Button */}
        <StyleSummaryRow 
          onClick={() => hasMultipleItems && setIsOpen(!isOpen)} 
          $isClickable={hasMultipleItems}
        >
          <StyleItemTitle>{summaryTitle}</StyleItemTitle>
          {hasMultipleItems && (
            <StyleToggleButton type="button">
              <span>{isOpen ? "ซ่อนรายละเอียด" : "ดูรายการทั้งหมด"}</span>
              {isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
            </StyleToggleButton>
          )}
        </StyleSummaryRow>

        {/* Collapsible Section (Shown directly if only 1 item, or when expanded) */}
        {(isOpen || !hasMultipleItems) && (
          <StyleItemList>
            {items.map((item, index) => (
              <StyleProductRow key={index}>
                <StyleProductName>
                  <span>{item.name}</span>
                  <StyleQty>x{item.qty}</StyleQty>
                </StyleProductName>
                <StyleProductPrice>{item.price}</StyleProductPrice>
              </StyleProductRow>
            ))}
          </StyleItemList>
        )}

        {/* Receipt Footer */}
        <StyleReceiptFooter>
          <StyleFooterMeta>
            <TruckIcon size={14} />
            <span>วันจัดส่ง: <strong>{shippingDate}</strong></span>
          </StyleFooterMeta>
          <StyleTotalGroup>
            <StyleTotalLabel>ยอดรวมสุทธิ</StyleTotalLabel>
            <StylePrice>{totalPrice}</StylePrice>
          </StyleTotalGroup>
        </StyleReceiptFooter>
      </StyleReceiptBody>
    </StyleReceiptItem>
  );
};

/* ==========================================================================
   Styled Components
   ========================================================================== */

const StyleRoot = styled.div`
  margin: 32px 0 0 0;
  color: #374151;
`;

const StyleInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyleView = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyleViewContainer = styled.div`
  max-width: 720px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
`;

const StyleTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin-bottom: 24px;
  color: #111827;
`;

const StyleSub = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 32px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #374151;

  & > svg {
    color: #2563eb;
  }
`;

const StyleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyleReceiptItem = styled.div`
  position: relative;
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const StyleReceiptTopBorder = styled.div`
  height: 4px;
  width: 100%;
  background: repeating-linear-gradient(
    90deg,
    #2563eb,
    #2563eb 12px,
    #e5e7eb 12px,
    #e5e7eb 24px
  );
`;

const StyleReceiptBody = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyleOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyleOrderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.825rem;
  font-family: monospace;
  font-weight: 600;
  color: #6b7280;
`;

const StyleBadge = styled.span<{ $isCompleted?: boolean }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => (props.$isCompleted ? "#f3f4f6" : "#eff6ff")};
  color: ${(props) => (props.$isCompleted ? "#4b5563" : "#2563eb")};
  border: 1px solid ${(props) => (props.$isCompleted ? "#e5e7eb" : "#bfdbfe")};
`;

const StyleSummaryRow = styled.div<{ $isClickable?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props) => (props.$isClickable ? "pointer" : "default")};
  user-select: none;
`;

const StyleItemTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const StyleToggleButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.825rem;
  font-weight: 500;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const StyleItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #f3f4f6;
  margin-top: 4px;
`;

const StyleProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const StyleProductName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
`;

const StyleQty = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  background: #e5e7eb;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
`;

const StyleProductPrice = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
`;

const StyleReceiptFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
`;

const StyleFooterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #4b5563;

  strong {
    color: #111827;
    font-weight: 600;
  }
`;

const StyleTotalGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const StyleTotalLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const StylePrice = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
`;

export default content;