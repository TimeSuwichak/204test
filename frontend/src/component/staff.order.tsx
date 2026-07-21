import { useState } from "react";
import styled from "styled-components";

// Order
interface OrderItem {
  id: string;
  orderDate: string;
  deliveryDate: string;
  status: "กำลังจัดส่ง" | "ส่งแล้ว" | "ล่าช้า" | "ยกเลิก";
  items: OrderProduct[];
}

// product in order
interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Order() {
  // MockUp ข้อมูล Order
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "ORD001",
      orderDate: "2026-07-10",
      deliveryDate: "2026-07-13",
      status: "ส่งแล้ว",
      items: [
        { productId: "P001", name: "Product A", price: 250, quantity: 2 },
        { productId: "P003", name: "Product C", price: 120, quantity: 1 }
      ]
    },
    {
      id: "ORD002",
      orderDate: "2026-07-12",
      deliveryDate: "2026-07-15",
      status: "กำลังจัดส่ง",
      items: [
        { productId: "P002", name: "Product B", price: 500, quantity: 1 }
      ]
    },
    {
      id: "ORD003",
      orderDate: "2026-07-11",
      deliveryDate: "2026-07-16",
      status: "ล่าช้า",
      items: [
        { productId: "P003", name: "Product C", price: 120, quantity: 5 },
        { productId: "P005", name: "Product E", price: 350, quantity: 2 }
      ]
    },
    {
      id: "ORD004",
      orderDate: "2026-07-14",
      deliveryDate: "-",
      status: "ยกเลิก",
      items: [
        { productId: "P004", name: "Product D", price: 990, quantity: 1 }
      ]
    },
    {
      id: "ORD005",
      orderDate: "2026-07-15",
      deliveryDate: "2026-07-18",
      status: "กำลังจัดส่ง",
      items: [
        { productId: "P001", name: "Product A", price: 250, quantity: 1 },
        { productId: "P005", name: "Product E", price: 350, quantity: 3 }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const statusOptions: OrderItem["status"][] = ["กำลังจัดส่ง", "ส่งแล้ว", "ล่าช้า", "ยกเลิก"];
  const filterStatusList = ["All", ...statusOptions];

  const activeOrder = orders.find((o) => o.id === activeOrderId) || null;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getTotalQuantity = (items: OrderProduct[]) => items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = (items: OrderProduct[]) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ฟังก์ชันสำหรับกดเปลี่ยนสถานะของ Order ใน Modal
  const handleUpdateStatus = (orderId: string, newStatus: OrderItem["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Order status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ส่งแล้ว": return { bg: "#d4edda", text: "black" };
      case "กำลังจัดส่ง": return { bg: "#cce5ff", text: "black" };
      case "ล่าช้า": return { bg: "#fff3cd", text: "black" };
      case "ยกเลิก": return { bg: "#f8d7da", text: "black" };
      default: return { bg: "#e2e8f0", text: "black" };
    }
  };

  return (
    <OrderContainer>
      <HeaderSection>
        <h1 style={{ color: "var(--text-primary)"}}>Order Section</h1>

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
                <option key={status} value={status}>{status}</option>
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
            {filteredOrders.map((order) => {
              const colors = getStatusColor(order.status);
              return (
                <tr key={order.id} onClick={() => setActiveOrderId(order.id)}>
                  <td>{order.id}</td>
                  <td>{order.orderDate}</td>
                  <td>
                    {order.status === "กำลังจัดส่ง" || order.status === "ยกเลิก"
                      ? "-"
                      : order.deliveryDate}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <StatusBadge bg={colors.bg} color={colors.text}>
                      {order.status}
                    </StatusBadge>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                  ไม่พบข้อมูลคำสั่งซื้อในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>

      {/* Order modal */}
      {activeOrder && (
        <ModalOverlay onClick={() => setActiveOrderId(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Order Details ({activeOrder.id})</h2>
              <CloseButton onClick={() => setActiveOrderId(null)}>&times;</CloseButton>
            </ModalHeader>

            <ModalBody>
              <DetailRow>
                <span className="label">Order ID:</span>
                <span className="value"><strong>{activeOrder.id}</strong></span>
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
                    <span className="p-name">{item.name} (x{item.quantity})</span>
                    <span className="p-price">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </ProductItemRow>
                ))}
              </ProductListContainer>

              <DetailRow className="highlight-row">
                <span className="label">ราคารวม:</span>
                <span className="value total-price">฿{getTotalPrice(activeOrder.items).toLocaleString()}</span>
              </DetailRow>

              <DetailRow>
                <span className="label">วันที่สั่ง:</span>
                <span className="value">{activeOrder.orderDate}</span>
              </DetailRow>

              {activeOrder.status !== "กำลังจัดส่ง" && activeOrder.status !== "ยกเลิก" && (
                <DetailRow>
                  <span className="label">วันที่ส่งถึง:</span>
                  <span className="value">{activeOrder.deliveryDate}</span>
                </DetailRow>
              )}

              <StatusEditRow>
                <span className="label">สถานะ (กดเพื่อแก้ไข):</span>
                <select
                  value={activeOrder.status}
                  onChange={(e) => handleUpdateStatus(activeOrder.id, e.target.value as OrderItem["status"])}
                  style={{
                    backgroundColor: getStatusColor(activeOrder.status).bg,
                    color: getStatusColor(activeOrder.status).text
                  }}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </StatusEditRow>
            </ModalBody>

            <CloseModalButton onClick={() => setActiveOrderId(null)}>ปิดหน้าต่าง</CloseModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </OrderContainer>
  );
}

const OrderContainer = styled.div`
  background: #0b1220;
  min-height: 100vh;
  padding: 28px;
  color: #fff;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 2.3rem;
    font-weight: 800;
    color: white;
  }
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

  select {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    outline: none;
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