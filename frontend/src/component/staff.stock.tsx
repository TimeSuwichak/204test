import { useEffect, useState } from "react";
import productApi from "../util/api.product";
import type { FetchBasic } from "../util/api.product";

export default function Stock() {
  const [products, setProducts] = useState<FetchBasic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const session = localStorage.getItem("session") ?? "";
      const data = await productApi.getBasicByList(session);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <StockContainer>
      <HeaderSection>
        <div>
          <div>
          <h1>Stock Section</h1>
          <button>Create</button>
          </div>
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
        </div>
      </HeaderSection>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Platform</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Adjust</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>

                <td>{product.name}</td>

                <td>{product.platform}</td>

                <td>0</td>

                <td>{product.price}</td>

                <td><button>Edit</button><button>Delete</button></td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  ไม่พบข้อมูลสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
    </StockContainer>
  );
}

import styled from "styled-components";

const StockContainer = styled.div`
  background: #0b1220;
  min-height: 100vh;
  padding: 28px;
  color: #fff;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 2.3rem;
    font-weight: 800;
    color: white;
  }

  p {
    margin-top: 8px;
    color: #94a3b8;
    font-size: 0.95rem;
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
    text-align:left;
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

  img {
    width: 58px;
    height: 78px;
    object-fit: cover;
    border-radius: 8px;
  }
`;
