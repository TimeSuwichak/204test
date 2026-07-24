import apiAccount from "#util/api.account";
import apiProduct from "#util/api.product";
import { styled } from "styled-components";
import { useAuth } from "#context/common.js";
import { useEffect, useState, useMemo } from "react";
import { type BasicFetch as Order } from "#util/api.order";
import { type BasicFetch as Product } from "#util/api.product";
import 
{ 
  HistoryIcon, BoxIcon, TruckIcon, HashIcon, 
  ChevronDownIcon, ChevronUpIcon, PackageXIcon, CheckCircle2Icon,
  ClockIcon, AlertCircleIcon, Loader2Icon,
  MapPin
} 
from "lucide-react";


/* ==========================================================================
   Card Component (การ์ดแสดงผลสไตล์เดียวกับ Modal Admin)
   ========================================================================== */
const OrderCard = ({ order }: OrderCardProps) => 
{
  const [isOpen, setIsOpen] = useState(false);

  const hasMultipleItems = order.items.length > 1;
  const statusInfo = formatStatusInfo(order.status);

  //
  // คำนวณยอดรวมราคาทั้งหมด
  //
  const totalPrice = useMemo(() => 
  {
    return order.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0);
  }, 
  [order.items]);

  //
  // สรุปชื่อสินค้า
  //
  const summaryTitle = useMemo(() => 
  {
    if (order.items.length === 0) {
      return "ไม่มีรายการสินค้า";
    }
    const firstName = order.items[0].name;
    return hasMultipleItems
      ? `${firstName} และอีก ${String (order.items.length - 1)} รายการ`
      : firstName;
  }, 
  [order.items, hasMultipleItems]);

  //
  // ขยายรายการ
  //
  const onClickExpand = () =>
  {
    if (!hasMultipleItems) {
      return;
    }
    setIsOpen ((prev) => !prev);
  }

  return (
    <StyleReceiptItem>
      <StyleReceiptBody>
        {/* Header: ORD ID & Badge */}
        <StyleOrderHeader>
          <StyleOrderMeta>
            <HashIcon size={14} />
            <span>ORD{String(order.id).padStart(3, "0")}</span>
          </StyleOrderMeta>
          <StyleBadge $bg={statusInfo.bg} $color={statusInfo.text}>
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </StyleBadge>
        </StyleOrderHeader>

        {/* Toggle / Main Summary */}
        <StyleSummaryRow
          onClick={onClickExpand}
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

        {/* Item List Detail (โครงสร้างเหมือนใน Modal) */}
        {(isOpen || !hasMultipleItems) && order.items.length > 0 && (
          <ProductListContainer>
            {order.items.map((item, index) => (
              <ProductItemRow key={item.productId || index}>
                <span className="p-name">
                  {item.name} <StyleQty>x{item.quantity}</StyleQty>
                </span>
                <span className="p-price">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </ProductItemRow>
            ))}
          </ProductListContainer>
        )}

        {/* Footer */}
        <StyleReceiptFooter>
          <StyleFooterMeta>
            <TruckIcon size={16} />
            <span>
              วันจัดส่ง: <strong>{formatDate(order.deliveryDate)}</strong>
            </span>
            <br/>
            <MapPin size={16}/>
            <span>
              ที่จัดส่ง: <strong>{order.address}</strong>
            </span>
          </StyleFooterMeta>
          <StyleTotalGroup>
            <StyleTotalLabel>ยอดรวมสุทธิ</StyleTotalLabel>
            <StylePrice>{formatCurrency(totalPrice)}</StylePrice>
          </StyleTotalGroup>
        </StyleReceiptFooter>
      </StyleReceiptBody>
    </StyleReceiptItem>
  );
};

/* ==========================================================================
   Main Customer Order Page
   ========================================================================== */
export default function CustomerOrder () 
{
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const auth = useAuth ();

  useEffect(() => 
  {
    const loadOrders = async () => 
    {
      try 
      {
        setLoading(true);
        setErrorMsg(null);
        const session = auth.session;
  
        // 1. ดึง Order และ Product List ทั้งหมดแบบ Parallel เพียง 2 requests
        const [rawOrders, rawProducts] = await Promise.all(
        [
          apiAccount.getOrder(session).catch((e: unknown) => 
          {
            console.error("Order API Error:", e);
            return [] as Order[];
          }),
          apiProduct.getBasicList(session).catch((e: unknown) => 
          {
            console.error("Product API Error:", e);
            return [] as Product[];
          }),
        ]);
  
        // 2. ทำ Product Cache (Map) เพื่อให้ค้นหาข้อมูลสินค้าได้เร็ว ไม่ต้องยิง API เพิ่ม
        const productMap = new Map<number, Product>();
        if (Array.isArray(rawProducts)) {
          rawProducts.forEach((p) => productMap.set(p.id, p));
        }
  
        // 3. Map ข้อมูล Order เข้ากับข้อมูลสินค้า
        const extendedOrders: OrderItem[] = rawOrders.map((x) => 
        {
          const itemsWithDetails: OrderProduct[] = x.item.map((it) => 
          {
            const prod = productMap.get(it.productId);
            return {
              productId: it.productId,
              name: prod ? prod.name : `สินค้า ID: ${String (it.productId)}`,
              price: prod ? prod.price : 0,
              quantity: it.quantity,
            };
          });

          return {
            id: x.orderId,
            orderDate: new Date(x.created),
            deliveryDate: x.delivered ? new Date(x.delivered) : null,
            status: x.status,
            items: itemsWithDetails,
            address: x.shipAddress
          };
        });
  
        setOrders(extendedOrders);
      } 
      catch (err: unknown) 
      {
        console.error ("Failed to load orders:", err);
        setErrorMsg ("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ");
      } 
      finally 
      {
        setLoading(false);
      }
    };
    void loadOrders ();
  }, 
  [auth.session]);

  // แยก Active Orders & Past Orders
  const { activeOrders, pastOrders } = useMemo(() => {
    return {
      activeOrders: orders.filter((x) => x.status === 1 || x.status === 3),
      pastOrders: orders.filter((x) => x.status === 2 || x.status === 0 || x.status === 4),
    };
  }, [orders]);

  if (loading) {
    return (
      <StyleRoot>
        <StyleLoadingBox>
          <Loader2Icon className="spin" size={36} />
          <p>กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
        </StyleLoadingBox>
      </StyleRoot>
    );
  }

  if (errorMsg) {
    return (
      <StyleRoot>
        <StyleEmptyBox style={{ color: "#ef4444" }}>
          <AlertCircleIcon size={32} />
          <p>{errorMsg}</p>
        </StyleEmptyBox>
      </StyleRoot>
    );
  }

  return (
    <StyleRoot>
      <StyleInner>
        <StyleView>
          <StyleViewContainer>
            <StyleHeaderGroup>
              <StyleTitle>ประวัติคำสั่งซื้อ</StyleTitle>
              <StyleSubtitle>ติดตามสถานะคำสั่งซื้อและเรียกดูประวัติการสั่งซื้อของคุณ</StyleSubtitle>
            </StyleHeaderGroup>

            {/* Section: กำลังดำเนินการ */}
            <StyleSub>
              <BoxIcon size={20} />
              <span>กำลังดำเนินการ ({activeOrders.length})</span>
            </StyleSub>

            <StyleList>
              {activeOrders.length === 0 ? (
                <StyleEmptyBox>
                  <ClockIcon size={32} color="#64748b" />
                  <p>ไม่มีคำสั่งซื้อที่อยู่ระหว่างดำเนินการ</p>
                </StyleEmptyBox>
              ) : (
                activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </StyleList>

            {/* Section: ประวัติย้อนหลัง */}
            <StyleSub>
              <HistoryIcon size={20} />
              <span>ประวัติย้อนหลัง ({pastOrders.length})</span>
            </StyleSub>

            <StyleList>
              {pastOrders.length === 0 ? (
                <StyleEmptyBox>
                  <PackageXIcon size={32} color="#64748b" />
                  <p>ไม่มีประวัติคำสั่งซื้อย้อนหลัง</p>
                </StyleEmptyBox>
              ) : (
                pastOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </StyleList>
          </StyleViewContainer>
        </StyleView>
      </StyleInner>
    </StyleRoot>
  );
}


/* ==========================================================================
   Helpers
   ========================================================================== 
*/

/**
 * รับข้อความสกุลเงิน
*/
function formatCurrency (amount: number) 
{
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  })
  .format(amount);
};

/**
 * รับข้อความแสดงวันที่
*/
function formatDate (date: Date | null)
{
  if (!date) {
    return "อยู่ระหว่างจัดเตรียม";
  }
  const d = new Date(date);
  return isNaN (d.getTime()) ? "อยู่ระหว่างจัดเตรียม" : 
    d.toLocaleDateString ("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};
  
/**
 * รับข้อความสถานะการจัดส่ง
*/
function formatStatusInfo (status: number) 
{
  switch (status) 
  {
    case 1: return { 
      label: "รอดำเนินการ", icon: <ClockIcon size={13} />, 
      bg: "#cce5ff", text: "#004085" 
    };
    case 2: return { 
      label: "จัดส่งสำเร็จแล้ว", icon: <CheckCircle2Icon size={13} />, 
      bg: "#d4edda", text: "#155724" 
      };
    case 3: return { 
      label: "ล่าช้า", icon: <AlertCircleIcon size={13} />, 
      bg: "#fff3cd", text: "#856404" 
      };
    case 0:
    case 4: return { 
      label: "ยกเลิกแล้ว", icon: <PackageXIcon size={13} />, 
      bg: "#f8d7da", text: "#721c24" 
    };
    default: return { 
      label: "รอดำเนินการ", icon: <ClockIcon size={13} />, 
      bg: "#e2e8f0", text: "#334155" 
    };
  }
};

/* ==========================================================================
   Styled Components (Dark Theme - ตรงกับ Theme Modal Admin ของคุณ)
   ========================================================================== */

const StyleRoot = styled.div`
  background: #0b1220;
  min-height: 100vh;
  padding: 24px 0 64px 0;
  color: #ffffff;
  margin-top: 48px;
`;

const StyleInner = styled.div`
  width: 100%;
`;

const StyleView = styled.div`
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

const StyleHeaderGroup = styled.div`
  margin-bottom: 28px;
`;

const StyleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: #ffffff;
`;

const StyleSubtitle = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
`;

const StyleSub = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 32px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #38bdf8;
`;

const StyleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyleEmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #111827;
  border: 1px dashed #334155;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 0.95rem;
  gap: 10px;

  p {
    margin: 0;
  }
`;

const StyleLoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #38bdf8;
  gap: 16px;

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  p {
    color: #94a3b8;
    margin: 0;
  }
`;

const StyleReceiptItem = styled.div`
  background: #111827;
  border-radius: 16px;
  border: 1px solid #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #334155;
  }
`;

const StyleReceiptBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  font-size: 0.85rem;
  font-family: monospace;
  font-weight: 600;
  color: #94a3b8;
`;

const StyleBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
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
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
`;

const StyleToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #38bdf8;
  font-size: 0.85rem;
  font-weight: 600;
`;

/* Container รายการสินค้า ดีไซน์เดียวกับ ProductListContainer ใน Modal */
const ProductListContainer = styled.div`
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProductItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;

  .p-name {
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .p-price {
    color: #ffffff;
    font-weight: 600;
  }
`;

const StyleQty = styled.span`
  font-size: 0.75rem;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
`;

const StyleReceiptFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px dashed #334155;
`;

const StyleFooterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.825rem;
  color: #94a3b8;

  strong {
    color: #f8fafc;
  }
`;

const StyleTotalGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const StyleTotalLabel = styled.span`
  font-size: 0.8rem;
  color: #94a3b8;
`;

const StylePrice = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: #3b82f6;
`;


/* ==========================================================================
   Interfaces
   ========================================================================== 
*/
interface OrderProduct 
{
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem 
{
  id: number;
  address: string;
  orderDate: Date;
  deliveryDate: Date | null;
  status: number;
  /**
   * รายการสินค้า
  */
  items: OrderProduct[];
}

interface OrderCardProps 
{
  order: OrderItem;
}
