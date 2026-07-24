import { useEffect, useState } from "react";
import styled from "styled-components";
import orderApi from "../util/api.order";
import productApi from "../util/api.product";
import type { BasicFetch as RawOrder } from "../util/api.order";
import type { BasicFetch as ProductFetch } from "../util/api.product";
import { useAuth } from "#context/common.ts";

interface OrderProduct {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  id: number;
  orderDate: Date;
  deliveryDate: Date | null;
  status: number;
  items: OrderProduct[];
}

export default function Order() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

  const auth = useAuth();

  // กำหนด mapping ตามเงื่อนไขที่คุณแจ้งไว้
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1: return "รอดำเนินการ";
      case 2: return "จัดส่งแล้ว";
      case 0: return "ยกเลิก";
      default: return "กำลังจัดส่ง";
    }
  };

  const getStatusNumber = (statusText: string): number => {
  switch (statusText) {
    case "รอดำเนินการ": return 1;
    case "จัดส่งแล้ว": return 2;
    case "ยกเลิก": return 0;
    case "กำลังจัดส่ง": return 3;
    default: return 1;
  }
};

  const statusOptions = ["รอดำเนินการ", "กำลังจัดส่ง", "จัดส่งแล้ว", "ยกเลิก"];
  const filterStatusList = ["All", ...statusOptions];

  const loadOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const session = auth.session;

      const rawOrders: RawOrder[] = await orderApi.getBasicList(session);

      const extendedOrders: OrderItem[] = await Promise.all(
        rawOrders.map(async (ord) => {
          const itemsWithDetails: OrderProduct[] = await Promise.all(
            ord.item.map(async (it) => {
              try {
                const prod: ProductFetch = await productApi.getBasic(session, it.productId);
                return {
                  productId: it.productId,
                  name: prod.name,
                  price: prod.price,
                  quantity: it.quantity,
                };
              } catch {
                return {
                  productId: it.productId,
                  name: `สินค้า ID: ${it.productId}`,
                  price: 0,
                  quantity: it.quantity,
                };
              }
            })
          );

          return {
            id: ord.orderId,
            orderDate: new Date(ord.created),
            deliveryDate: ord.delivered ? new Date(ord.delivered) : null,
            status: ord.status,
            items: itemsWithDetails,
          };
        })
      );

      setOrders(extendedOrders);
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;

  const filteredOrders = orders.filter((order) => {
    const statusText = getStatusText(order.status);
    const orderIdStr = `ORD${String(order.id).padStart(3, "0")}`;

    const matchesSearch =
      orderIdStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = selectedStatus === "All" || statusText === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getTotalQuantity = (items: OrderProduct[]) =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = (items: OrderProduct[]) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateStatus = async (orderId: number, newStatusNum: number) => {
    try {
      const session = auth.session;
      const now = new Date();
      const newDeliveryDate = newStatusNum === 2 ? now : null;
  
      await orderApi.updateBasic(session, {
        orderId: orderId,
        status: newStatusNum,
        delivered: newDeliveryDate, 
      });
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatusNum, deliveryDate: newDeliveryDate }
            : order
        )
      );
  
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert(err.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  const getStatusColor = (statusText: string) => {
    switch (statusText) {
      case "จัดส่งแล้ว": return { bg: "#d4edda", text: "#155724" };
      case "กำลังจัดส่ง": return { bg: "#cce5ff", text: "#004085" };
      case "รอดำเนินการ": return { bg: "#fff3cd", text: "#856404" };
      case "ยกเลิก": return { bg: "#f8d7da", text: "#721c24" };
      default: return { bg: "#e2e8f0", text: "#334155" };
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toISOString().split("T")[0];
  };

  return (
    <OrderContainer>
      <HeaderSection>
        <h1 style={{ color: "var(--text-primary, #ffffff)" }}>Order Section</h1>

        <ToolbarRow>
          <SearchWrapper>
            <label htmlFor="search-input">Search Order: </label>
            <SearchInput
              id="search-input"
              type="text"
              placeholder="ค้นหา ID หรือ ชื่อสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <FilterWrapper>
            <label htmlFor="status-select">Filter by Status: </label>
            <StyledSelect
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {filterStatusList.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </StyledSelect>
          </FilterWrapper>
        </ToolbarRow>
      </HeaderSection>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>วันที่สั่ง</th>
              <th>วันที่ส่งถึง</th>
              <th style={{ textAlign: "center" }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                  กำลังโหลดข้อมูลคำสั่งซื้อ...
                </td>
              </tr>
            ) : errorMsg ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
                  {errorMsg}
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                  ไม่พบข้อมูลคำสั่งซื้อในระบบ
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const statusText = getStatusText(order.status);
                const colors = getStatusColor(statusText);
                return (
                  <tr key={order.id} onClick={() => setActiveOrderId(order.id)}>
                    <td>ORD{String(order.id).padStart(3, "0")}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    <td style={{ textAlign: "center" }}>
                      <StatusBadge bg={colors.bg} color={colors.text}>
                        {statusText}
                      </StatusBadge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </StyledTable>
      </TableContainer>

      {activeOrder && (
        <ModalOverlay onClick={() => setActiveOrderId(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Order Details (ORD{String(activeOrder.id).padStart(3, "0")})</h2>
              <CloseButton onClick={() => setActiveOrderId(null)}>&times;</CloseButton>
            </ModalHeader>

            <ModalBody>
              <DetailRow>
                <span className="label">Order ID:</span>
                <span className="value">
                  <strong>ORD{String(activeOrder.id).padStart(3, "0")}</strong>
                </span>
              </DetailRow>

              <DetailRow>
                <span className="label">จำนวนสินค้าทั้งหมด:</span>
                <span className="value">{getTotalQuantity(activeOrder.items)} ชิ้น</span>
              </DetailRow>

              {/* List สินค้า */}
              <ProductListContainer>
                <div className="list-title">List สินค้าและราคา:</div>
                {activeOrder.items.map((item, index) => (
                  <ProductItemRow key={item.productId || index}>
                    <span className="p-name">
                      {item.name} (x{item.quantity})
                    </span>
                    <span className="p-price">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </ProductItemRow>
                ))}
              </ProductListContainer>

              <DetailRow className="highlight-row">
                <span className="label">ราคารวม:</span>
                <span className="value total-price">
                  ฿{getTotalPrice(activeOrder.items).toLocaleString()}
                </span>
              </DetailRow>

              <DetailRow>
                <span className="label">วันที่สั่ง:</span>
                <span className="value">{formatDate(activeOrder.orderDate)}</span>
              </DetailRow>

              <DetailRow>
                <span className="label">วันที่ส่งถึง:</span>
                <span className="value">{formatDate(activeOrder.deliveryDate)}</span>
              </DetailRow>

              <StatusEditRow>
                <span className="label">สถานะ:</span>
                <StatusControls>
                  {activeOrder.status === 1 && (
                    <ConfirmShipButton
                      onClick={() => handleUpdateStatus(activeOrder.id, 2)}
                    >
                      ยืนยันการจัดส่ง
                    </ConfirmShipButton>
                  )}

                  <StatusBadge
                    bg={getStatusColor(getStatusText(activeOrder.status)).bg}
                    color={getStatusColor(getStatusText(activeOrder.status)).text}
                  >
                    {getStatusText(activeOrder.status)}
                  </StatusBadge>
                </StatusControls>
              </StatusEditRow>
            </ModalBody>

            <CloseModalButton onClick={() => setActiveOrderId(null)}>
              ปิดหน้าต่าง
            </CloseModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </OrderContainer>
  );
}

// Styled Components
const OrderContainer = styled.div`
  background: #0b1220;
  min-height: 100vh;
  padding: 28px;
  color: #fff;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const ToolbarRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const SearchWrapper = styled.div`
  flex: 1;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #cbd5e1;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: #111827;
  color: white;
  border: 1px solid #334155;
  border-radius: 10px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }

  &::placeholder {
    color: #64748b;
  }
`;

const FilterWrapper = styled.div`
  width: 240px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #cbd5e1;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 14px 18px;
  background: #111827;
  color: white;
  border: 1px solid #334155;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }

  option {
    background: #111827;
    color: white;
  }
`;

const TableContainer = styled.div`
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 16px;
  overflow: hidden;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #0f172a;
  }

  th {
    color: #94a3b8;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 18px;
    border-bottom: 1px solid #1e293b;
    text-align: left;
  }

  td {
    padding: 18px;
    color: white;
    border-bottom: 1px solid #1e293b;
    vertical-align: middle;
  }

  tbody tr {
    transition: background 0.2s ease;
    cursor: pointer;
  }

  tbody tr:hover {
    background: #1e293b;
  }
`;

const StatusBadge = styled.span<{ bg: string; color: string }>`
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 560px;
  background: #111827;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      transform: translateY(-12px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #334155;

  h2 {
    margin: 0;
    font-size: 22px;
    color: white;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 28px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: white;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    color: #94a3b8;
    font-size: 14px;
  }

  .value {
    color: white;
    font-weight: 600;
  }

  .total-price {
    color: #3b82f6;
    font-size: 18px;
    font-weight: 700;
  }

  &.highlight-row {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 12px 14px;
  }
`;

const ProductListContainer = styled.div`
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .list-title {
    color: white;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
  }
`;

const ProductItemRow = styled.div`
  display: flex;
  justify-content: space-between;

  .p-name {
    color: #e2e8f0;
  }

  .p-price {
    color: white;
    font-weight: 600;
  }
`;

const StatusEditRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;

  .label {
    color: #94a3b8;
    font-size: 14px;
  }
`;

const StatusControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  select {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    outline: none;
  }
`;

const ConfirmShipButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #16a34a;
  }
`;

const CloseModalButton = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;  