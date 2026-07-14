import { useState } from "react";
import styled from "styled-components";

export default function Stock() {
  const [products, setProducts] = useState([
    { id: "P001", name: "Product A", quantity: 50, genre: "Turn-Based" },
    { id: "P002", name: "Product B", quantity: 12, genre: "RTS" },
    { id: "P003", name: "Product C", quantity: 120, genre: "Action" },
    { id: "P004", name: "Product D", quantity: 0, genre: "Adventure" },
    { id: "P005", name: "Product E", quantity: 85, genre: "Puzzle" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGenre, setNewGenre] = useState("Action");
  const [newQuantity, setNewQuantity] = useState(0);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkAmount, setBulkAmount] = useState<number>(0);

  const genresList = ["All", ...Array.from(new Set(products.map((p) => p.genre)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || product.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return alert("กรุณากรอกชื่อสินค้า");

    const newProduct = {
      id: `P${String(products.length + 1).padStart(3, "0")}`,
      name: newName,
      genre: newGenre,
      quantity: Number(newQuantity),
    };

    setProducts([...products, newProduct]);
    setNewName("");
    setNewQuantity(0);
    setIsOpenCreate(false);
  };

  const handleUpdateSingleQuantity = (id: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, p.quantity + amount) } : p))
    );
  };

  const handleDirectQuantityChange = (id: string, value: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(0, value) } : p))
    );
  };

  const handleApplyBulkQuantity = () => {
    if (selectedProductIds.length === 0) {
      return alert("กรุณาเลือกสินค้าผ่าน Checkbox อย่างน้อย 1 ชิ้น");
    }
    
    setProducts((prev) =>
      prev.map((p) =>
        selectedProductIds.includes(p.id)
          ? { ...p, quantity: Math.max(0, p.quantity + bulkAmount) }
          : p
      )
    );
    setBulkAmount(0);
    setSelectedProductIds([]);
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentFilteredIds = filteredProducts.map((p) => p.id);
      setSelectedProductIds(currentFilteredIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  return (
    <StockContainer>
      <HeaderSection>
        <div>
          <h1>Stock Section</h1>
          
          <ToolbarRow>
            <SearchWrapper>
              <label htmlFor="search-input">Search Product: </label>
              <SearchInput 
                id="search-input"
                type="text"
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchWrapper>

            <FilterWrapper>
              <label htmlFor="genre-select">Filter by Genre: </label>
              <StyledSelect 
                id="genre-select"
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genresList.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </StyledSelect>
            </FilterWrapper>
          </ToolbarRow>

          <CreateButton onClick={() => setIsOpenCreate(true)}>
            + Create Product
          </CreateButton>
        </div>

        <BulkActionSection isActive={selectedProductIds.length > 0}>
          <span style={{ color: "black" }}>เลือกอยู่ <strong style={{ color: "black" }}>{selectedProductIds.length}</strong> รายการ | ปรับจำนวน:</span>
          <BulkInputWrapper>
            <input
              type="number"
              placeholder="ใส่ตัวเลข"
              value={bulkAmount === 0 ? "" : bulkAmount}
              onChange={(e) => setBulkAmount(Number(e.target.value))}
            />
            <ApplyButton onClick={handleApplyBulkQuantity}>เพิ่ม</ApplyButton>
          </BulkInputWrapper>
        </BulkActionSection>
      </HeaderSection>

      {isOpenCreate && (
        <ModalOverlay onClick={() => setIsOpenCreate(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Create New Product</h2>
              <CloseButton onClick={() => setIsOpenCreate(false)}>&times;</CloseButton>
            </ModalHeader>
          
            <form onSubmit={handleCreateProduct}>
              <FormGroup>
                <label>Name:</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Product Name" />
              </FormGroup>
              <FormGroup>
                <label>Genre:</label>
                <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)}>
                  <option value="Action">Action</option>
                  <option value="Adventure">Adventure</option>
                  <option value="RTS">RTS</option>
                  <option value="Turn-Based">Turn-Based</option>
                  <option value="Puzzle">Puzzle</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>Quantity:</label>
                <input type="number" min="0" value={newQuantity} onChange={(e) => setNewQuantity(Number(e.target.value))} />
              </FormGroup>
              <SubmitButton type="submit">Save Product</SubmitButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th style={{ width: "40px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>NAME</th>
              <th>GENRE</th>
              <th style={{ textAlign: "center" }}>QUANTITY CONTROL</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className={selectedProductIds.includes(product.id) ? "selected-row" : ""}>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td>{product.id}</td>
                <td className="product-name">{product.name}</td>
                <td>{product.genre}</td>
                <td>
                  <QuantityManagerColumn>
                    <QtyButton onClick={() => handleUpdateSingleQuantity(product.id, -1)}>-</QtyButton>

                    <QtyInputWrapper>
                      <input
                        type="number"
                        min="0"
                        value={product.quantity}
                        onChange={(e) => handleDirectQuantityChange(product.id, Number(e.target.value))}
                      />
                      {product.quantity === 0 && <span className="error-lbl">Out of Stock</span>}
                    </QtyInputWrapper>

                    <QtyButton onClick={() => handleUpdateSingleQuantity(product.id, 1)}>+</QtyButton>
                  </QuantityManagerColumn>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                  ไม่พบสินค้าในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
    </StockContainer>
  );
}

const StockContainer = styled.div`
  color: black;
  font-family: sans-serif;
`;

const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
  h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: black;
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  width: 100%;
  gap: 1rem;
`;

const SearchWrapper = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-left: 0.5rem;
  width: 200px;
  background-color: white;
  color: black;
`;

const FilterWrapper = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: black;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select`
  padding: 6px 12px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-left: 0.5rem;
  cursor: pointer;
  background-color: white;
  color: black;
  option { background-color: white; color: black; }
`;

const CreateButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.2s;
  &:hover { background-color: #218838; }
`;

const BulkActionSection = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 1rem;
  opacity: ${(props) => (props.isActive ? "1" : "0.5")};
  pointer-events: ${(props) => (props.isActive ? "auto" : "none")};
  transition: all 0.2s ease;
  color: black ;
`;

const BulkInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    width: 120px;
    padding: 6px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    font-size: 0.95rem;
    background-color: white;
    color: black;
  }
`;

const ApplyButton = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 6px 16px;
  font-size: 0.95rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background-color: #1d4ed8; }
  &:active { transform: scale(0.97); }
`;

const QuantityManagerColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const QtyButton = styled.button`
  background-color: #e2e8f0;
  color: black;
  border: 1px solid #cbd5e1;
  width: 32px;
  height: 32px;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background-color: #cbd5e1; }
`;

const QtyInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  input {
    width: 65px;
    text-align: center;
    padding: 6px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    color: black;
  }
  .error-lbl {
    font-size: 0.7rem;
    color: red;
    font-weight: bold;
    margin-top: 2px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;
  h2 { margin: 0; font-size: 1.5rem; }
`;

const CloseButton = styled.button`
  background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #aaa;
  &:hover { color: #333; }
`;

// รูปแบบฟอร์มและปุ่มสร้างสินค้า
const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label { font-weight: bold; font-size: 0.95rem; color: black; }
  input, select {
    width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;
    font-size: 1rem; background-color: white; color: black;
  }
`;

const SubmitButton = styled.button`
  background-color: blue; color: white; border: none; width: 100%;
  padding: 10px; font-size: 1rem; font-weight: bold; border-radius: 4px; cursor: pointer;
  &:hover { background-color: darkblue; }
`;

// รูปแบบตาราง
const TableContainer = styled.div`
  width: 100%; overflow-x: auto; border: 1px solid #ccc; border-radius: 8px;
`;

const StyledTable = styled.table`
  width: 100%; border-collapse: collapse; text-align: left; font-size: 1rem;
  thead { background-color: blue; color: white; }
  th { padding: 12px 16px; font-weight: 600; text-transform: uppercase; font-size: 0.9rem; }
  td { padding: 12px 16px; border-bottom: 1px solid #ddd; color: black; }
  .product-name { font-weight: 500; }
  
  tbody tr:nth-child(even) { background-color: lightyellow; }
  tbody tr:hover { background-color: #f1f5f9; }
  
  /* Highlight สีแถวที่ถูกเลือก checkbox */
  tbody tr.selected-row { background-color: #e0f2fe !important; }

  input[type="checkbox"] {
    transform: scale(1.2);
    cursor: pointer;
  }
`;