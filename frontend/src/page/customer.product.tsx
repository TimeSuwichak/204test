import styled           from "styled-components";
import ctx              from "#context/common.ts";
import ctxCustomer      from "#context/customer.ts";
import apiAccount       from "#util/api.account.ts";
import apiStorage       from "#util/api.storage.ts";

import { useSearchParams } from "react-router";

import type { MouseEvent } from "react";

import { ShoppingCart, Share2Icon, Heart } from "lucide-react";

/**
 * ส่วนประกอบแสดงรายละเอียดสินค้าที่ผู้ใช้กำลังเลือก
*/
const content = function Product ()
{
  return <>
    <StyleRoot>
      <content.Main/>
    </StyleRoot>
  </>;
}
content.Main = function ProductMainContent ()
{
  const [param] = useSearchParams ();
  const id = param.get ("id");
  const auth = ctx.useAuth ();
  const queryBasic = ctxCustomer.useProduct (Number (id));
  const basic = queryBasic.data;

  /**
   * เพิ่มสินค้านี้ลงในตะกร้าของผู้ใช้งานระบบ
  */
  const onClickAdd = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    const query = queryBasic;
    const queryData = query.data;
    const queryId = queryData ? queryData.id : NaN;

    void apiAccount.createCart (auth.session, {
      productId: queryId,
      quantity: 1
    });
  }
  /**
   * เพิ่มสินค้านี้ลงในรายการโปรดของผู้ใช้งานระบบ
  */
  const onClickFavorite = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();
  }
  /**
   * เปิดหน้าต่างแชร์สินค้า
  */
  const onClickShare = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();
  }


  const name = basic ? basic.name : "";
  const sub = "";
  const desc = basic ? basic.description : "";
  const price = basic ? String (basic.price) : "";
  const icon = basic ? apiStorage.getUrlStream (basic.cover) : undefined;

  return (
    <StyleMain>
      <StyleArtwork src={icon}/>
      <StyleMainView>
        <header>
          <StyleMainTitle>{name}</StyleMainTitle>
          <StyleMainTitleSub>{sub}</StyleMainTitleSub>
        </header>
        <main>
          <StyleMainDesc>
            {desc}
          </StyleMainDesc>
          <StyleMainReview>
            <iframe src="https://www.youtube.com/embed/Ux0YNqhaw0I?si=cDRJRNh5VdQ27VLX" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <iframe src="https://www.youtube.com/embed/9W_8_IR51FM?si=ewYauLVedOMaZ1vD" title="YouTube video player"allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </StyleMainReview>
          <StyleMainOption>
            <StyleMainPrice>
              <StyleMainPriceDiscount>99%</StyleMainPriceDiscount>
              <span>{price} ฿</span>
            </StyleMainPrice>
            <StyleMainAction>
              <button onClick={onClickAdd}>
                <ShoppingCart/>
                <span>เพิ่มลงในตะกร้า</span>
              </button>
              <button onClick={onClickFavorite}>
                <Heart/>
                <span>เพิ่มรายการโปรด</span>
              </button>
              <button onClick={onClickShare}>
                <Share2Icon/>
                <span>แชร์</span>
              </button>
            </StyleMainAction>
          </StyleMainOption>
        </main>
      </StyleMainView>
    </StyleMain>
  );
}

const StyleRoot = styled.div`
  margin: 96px 0px 64px 0px;
  display: block;
`;
const StyleMain = styled.div`
  width: 100%;
  height: 100%;
  height: 768px;
  display: flex;
  flex-direction: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 64px;

  @media (max-width: 960px)
  {
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
`;
const StyleArtwork = styled.img`
  display: block;
  width: 550px;
  height: 100%;
  object-fit: cover;

  @media (max-width: 1268px)
  {
    width: 412px;
    height: 75%;
  }
  @media (max-width: 1024px)
  {
    width: 275px;
    height: 50%;
  }
`;
const StyleMainView = styled.div`
  width: 40%;
  height: auto;

  @media (max-width: 960px)
  {
    width: 100%;
    padding: 0px 96px;
  }
  @media (max-width: 768px)
  {
    width: 100%;
    padding: 0px 64px;
  }
  @media (max-width: 680px)
  {
    width: 100%;
    padding: 0px 16px;
  }
`;
const StyleMainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: normal;
`;
const StyleMainTitleSub = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 32px;
`;
const StyleMainDesc = styled.p`
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 32px;
`;
const StyleMainReview = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 256px;
  margin-bottom: 32px;
  gap: 16px;

  & > iframe
  {
    width: 100%;
    height: 100%;
    max-width: 480px;
    max-height: 256px;
  }
`;
const StyleMainOption = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  min-height: 40px;
  align-items: center;
  gap: 48px;

  @media (max-width: 1024px)
  {
    flex-direction: column;
  }
`;
const StyleMainPrice = styled.label`
  display: block;
  position: relative;
  font-size: 1.5rem;
  width: 128px;
`;
const StyleMainPriceDiscount = styled.label`
  font-size: 1.25rem;
  position: absolute;
  inset: auto 16px -32px auto;
  background-color: #FF7373;
  border-radius: 16px;
  padding: 0px 16px;
`;
const StyleMainAction = styled.div`
  display: inline-flex;
  gap: 8px;

  width: 100%;
  height: 40px;

    & > button
  {
    display: inline-block;
    width: 100%;
    min-width: 192px;
    min-height: 40px;
  }
  & > button > img,
  & > button > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
`;

/**
 * ส่งออกตัวแปร
*/
export default content;
