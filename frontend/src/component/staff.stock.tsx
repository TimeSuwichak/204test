import { useEffect, useState } from "react";
import styled from "styled-components";
import productApi from "../util/api.product";
import type { BasicFetch } from "../util/api.product";
import { useAuth } from "#context/common.js";

export default function Stock() {
  const [products, setProducts] = useState<BasicFetch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockCounts, setStockCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const auth = useAuth();

  // ดึงรายการสินค้าพร้อมสต็อก
  const loadData = async () => {
    try {
      setLoading(true);

      const productList = await productApi.getBasicList(auth.session);
      setProducts(productList);

      const stockMap: Record<number, number> = {};
      await Promise.all(
        productList.map(async (item) => {
          try {
            const stockData = await productApi.getStock(auth.session, item.id);
            stockMap[item.id] = stockData.quantity;
          } catch {
            stockMap[item.id] = 0;
          }
        })
      );

      setStockCounts(stockMap);
    } catch (err) {
      console.error("Failed to load products or stocks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (productId: number) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkUpdate = async (type: "add" | "subtract") => {
    if (selectedIds.length === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 รายการ");
      return;
    }
    if (adjustAmount <= 0) {
      alert("ตัวเลขต้องมากกว่า 0");
      return;
    }

    // เช็กสต็อกคงเหลือก่อนทำการลดสต็อก
    if (type === "subtract") {
      const insufficientProducts: string[] = [];

      for (const id of selectedIds) {
        const currentQty = stockCounts[id] ?? 0;
        if (currentQty < adjustAmount) {
          const prod = products.find((p) => p.id === id);
          const name = prod ? prod.name : `ID: ${id}`;
          insufficientProducts.push(`• ${name} (มีอยู่ ${currentQty} ชิ้น)`);
        }
      }

      // ถ้ามีรายการที่สต็อกไม่พอ ให้แจ้งเตือนและหยุดการทำงานทันที
      if (insufficientProducts.length > 0) {
        alert(
          `ไม่สามารถลดสต็อกได้ เนื่องจากสินค้าคงเหลือไม่พอ (${adjustAmount} ชิ้น):\n\n` +
          insufficientProducts.join("\n")
        );
        return;
      }
    }

    const session = auth.session;
    setIsSubmitting(true);

    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const currentQty = stockCounts[id] ?? 0;
          const delta = type === "add" ? adjustAmount : -adjustAmount;
          const newQty = Math.max(0, currentQty + delta);

          await productApi.updateStock(session, {
            productId: id,
            quantity: newQty,
          });

          setStockCounts((prev) => ({ ...prev, [id]: newQty }));
        })
      );

      alert("อัปเดตสต็อกเรียบร้อยแล้ว");
      setSelectedIds([]);
      setAdjustAmount(0);
    } catch (err) {
      console.error("Bulk update failed:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดตบางรายการ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StockContainer>
      <HeaderSection>
        <TopBar>
          <h1>Stock Section</h1>
          <ActionButton
            $active={isEditMode}
            onClick={() => {
              setIsEditMode(!isEditMode);
              setSelectedIds([]);
            }}
          >
            {isEditMode ? "Cancel Edit" : "Edit Stock"}
          </ActionButton>
        </TopBar>

        {/* แถบเครื่องมือจัดการสต็อกเมื่อเปิดโหมด Edit Stock */}
        {isEditMode && (
          <BulkControlBar>
            <SelectedInfo>
              เลือกอยู่ <span>{selectedIds.length}</span> รายการ
            </SelectedInfo>

            <InputWrapper>
              <label>จำนวนที่ต้องการปรับ:</label>
              <NumberInput
                type="number"
                min="1"
                value={adjustAmount || ""}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                placeholder="ระบุตัวเลข..."
              />
            </InputWrapper>

            <ButtonGroup>
              <ConfirmButton
                $color="#10b981"
                disabled={isSubmitting || selectedIds.length === 0}
                onClick={() => void handleBulkUpdate("add")}
              >
                + เพิ่มสต็อก
              </ConfirmButton>
              <ConfirmButton
                $color="#ef4444"
                disabled={isSubmitting || selectedIds.length === 0}
                onClick={() => void handleBulkUpdate("subtract")}
              >
                - ลดสต็อก
              </ConfirmButton>
            </ButtonGroup>
          </BulkControlBar>
        )}

        <ToolbarRow>
          <SearchWrapper>
            <label htmlFor="search-input">Search Product :</label>
            <SearchInput
              id="search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
        </ToolbarRow>
      </HeaderSection>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              {isEditMode && (
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              <th>ID</th>
              <th>Name</th>
              <th>Platform</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={isEditMode ? 6 : 5}
                  style={{ textAlign: "center" }}
                >
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={isEditMode ? 6 : 5}
                  style={{ textAlign: "center" }}
                >
                  ไม่พบข้อมูลสินค้า
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (
                  <tr
                    key={product.id}
                    className={isSelected ? "selected-row" : ""}
                  >
                    {isEditMode && (
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(product.id)}
                        />
                      </td>
                    )}
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.platform}</td>
                    <td>
                      {(() => {
                        const qty = stockCounts[product.id] ?? 0;
                        if (qty === 0) {
                          return <OutOfStockBadge>Out of Stock</OutOfStockBadge>;
                        }
                        return (
                          <StockQuantityWrapper>
                            <span>{qty}</span>
                            {qty < 10 && <LowStockBadge>เหลือน้อย</LowStockBadge>}
                          </StockQuantityWrapper>
                        );
                      })()}
                    </td>
                    <td>{product.price}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
    </StockContainer>
  );
}

/* ==========================================================================
   Styled Components
   ========================================================================== */

const StockContainer = styled.div`
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

const ActionButton = styled.button<{ $active?: boolean }>`
  padding: 10px 20px;
  background: ${(props) => (props.$active ? "#ef4444" : "#3b82f6")};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const BulkControlBar = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #1e293b;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #334155;
  flex-wrap: wrap;
`;

const SelectedInfo = styled.div`
  font-size: 14px;
  color: #94a3b8;

  span {
    color: #3b82f6;
    font-weight: bold;
    font-size: 16px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-size: 14px;
    color: #cbd5e1;
  }
`;

const NumberInput = styled.input`
  width: 120px;
  padding: 8px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  color: white;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ConfirmButton = styled.button<{ $color: string }>`
  padding: 8px 16px;
  background: ${(props) => props.$color};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const SearchWrapper = styled.div`
  flex: 1;
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

  tbody tr:hover {
    background: #1e293b;
  }

  tbody tr.selected-row {
    background: rgba(59, 130, 246, 0.1);
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const OutOfStockBadge = styled.span`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: inline-block;
`;
const StockQuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LowStockBadge = styled.span`
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(245, 158, 11, 0.25);
  display: inline-block;
`;