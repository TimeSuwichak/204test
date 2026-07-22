import styled           from "styled-components";
import ctx              from "#context/common.ts";
import ctxUI            from "#context/common.ui.ts";
import ctxCustomer      from "#context/customer.ts";
import apiAccount       from "#util/api.account.ts";
import apiStorage       from "#util/api.storage.ts";

import MenuBar          from "#component/menu.bar.tsx";

import { useSearchParams } from "react-router";

import { useState, type MouseEvent } from "react";

import { ShoppingCart, Share2Icon, Heart, StarIcon, MessageSquare, TextAlignStart, MonitorCog, Package, ShoppingBasket } from "lucide-react";

/**
 * ส่วนประกอบแสดงรายละเอียดสินค้าที่ผู้ใช้กำลังเลือก
*/
const content = function Product ()
{
  const [param] = useSearchParams ();
  const id = param.get ("id");
  const queryBasic = ctxCustomer.useProduct (Number (id));
  const basic = queryBasic.data;
  const bg = basic ? apiStorage.getUrlStream (basic.background) : undefined;

  return <>
    <StyleRoot>
      <StyleBackground src={bg} $visible={(bg != undefined && bg.length > 0)}/>
      <content.Main/>
      <content.Comment/>
      <content.Cart/>
    </StyleRoot>
  </>;
}
/**
 * ส่วนประกอบแสดงผลไอคอนตะกร้า
*/
content.Cart = function ProductBrowserCart ()
{
  const auth = ctx.useAuth ();
  const cart = ctxCustomer.useCart ();
  const cartQuery = ctxCustomer.useCartQuery ();

  /**
   * ทำงานเมื่อผู้ใช้ต้องกดเปิดตะกร้าของตนเอง
  */
  const onClick = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    cart.setVisible (true);
    cart.setClose (() => { cart.setVisible (false); });
  }

  const data = cartQuery.data;
  const count = data ? data.reduce ((x, y) => x += y.quantity, 0) : 0;

  return (
    <StyledCart onClick={onClick} $visible={ctx.authSigned (auth)}>
      <StyledCartLabel>{count}</StyledCartLabel>
      <ShoppingBasket/>
    </StyledCart>
  );
}
content.Main = function ProductMainContent ()
{
  const [param] = useSearchParams ();
  const id = param.get ("id");
  const auth = ctx.useAuth ();
  const toast = ctxUI.useToast ();
  const queryBasic = ctxCustomer.useProduct (Number (id));
  const queryReview = ctxCustomer.useProductReviewList (Number (id));
  const basic = queryBasic.data;
  const review = queryReview.data;

  const [menu, setMenu] = useState (1);

  /**
   * เพิ่มสินค้านี้ลงในตะกร้าของผู้ใช้งานระบบ
  */
  const onClickAdd = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (ctx.authSigned (auth))
    {
      const query = queryBasic;
      const queryData = query.data;
      const queryId = queryData ? queryData.id : NaN;

      void apiAccount.createCart (auth.session, {
        productId: queryId,
        quantity: 1
      })
      .then (() =>
      {
        toast.setDuration (5000);
        toast.setText (`เพิ่ม ${basic ? basic.name : ""} ลงในตะกร้าเรียบร้อย`);
        toast.setVisible (true);
      })
      .catch (() =>
      {
        toast.setDuration (5000);
        toast.setText (`เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง`);
        toast.setVisible (true);
      });
    }
    else
    {
      toast.setDuration (5000);
      toast.setText ("คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถเพิ่มสินค้าได้");
      toast.setVisible (true);
    }
  }
  /**
   * เพิ่มสินค้านี้ลงในรายการโปรดของผู้ใช้งานระบบ
  */
  const onClickFavorite = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (ctx.authSigned (auth))
    {
      return;
    }
    else
    {
      toast.setDuration (5000);
      toast.setText ("คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถเพิ่มรายการโปรดได้");
      toast.setVisible (true);
    }
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
  const price = basic ? basic.price.toFixed (2) : "";
  const icon = basic ? apiStorage.getUrlStream (basic.cover) : undefined;

  return (
    <StyleMain>
      <StyleCover src={icon}/>
      <StyleMainView>
        <header>
          <StyleMainTitle>{name}</StyleMainTitle>
          <StyleMainTitleSub>{sub}</StyleMainTitleSub>
        </header>
        <main>
          <MenuBar
            direction="row" selected={menu} margin="0px 0px 16px 0px"
            onClick={(v) => { setMenu (v as number); }}>
            <MenuBar.Item icon={<TextAlignStart/>} width="192px" text="รายละเอียด" value={1}/>
            <MenuBar.Item icon={<MonitorCog/>} width="192px" text="ข้อมูลจำเพาะ" value={2}/>
            {/* <MenuBar.Item icon={<Package/>} width="192px" text="การจัดส่ง" value={3}/> */}
          </MenuBar>
          { (menu !== 1) ? (<></>) : (<StyleMainDesc>{desc}</StyleMainDesc>) }
          { (menu !== 2) ? (<></>) : (
            <SpecTable>
              <SpecRow>
                <SpecKey>ผู้ผลิต</SpecKey>
                <SpecVal>—</SpecVal>
              </SpecRow>
              <SpecRow>
                <SpecKey>แพลตฟอร์ม</SpecKey>
                <SpecVal>PlayStation 5</SpecVal>
              </SpecRow>
              <SpecRow>
                <SpecKey>ประเภท</SpecKey>
                <SpecVal>Action</SpecVal>
              </SpecRow>
              <SpecRow>
                <SpecKey>ภาษา</SpecKey>
                <SpecVal>ไทย / อังกฤษ</SpecVal>
                </SpecRow>
              <SpecRow>
                <SpecKey>ปีที่ออก</SpecKey>
                <SpecVal>2024</SpecVal>
              </SpecRow>
            </SpecTable>
          ) }
          { (menu !== 3) ? (<></>) : (
            <StyleMainDesc>
              จัดส่งทั่วประเทศไทยผ่าน Kerry / Flash ภายใน 1-3 วันทำการ
              สั่งซื้อครบ 1,500 ฿ ขึ้นไป จัดส่งฟรี
              สามารถรับสินค้าที่หน้าร้านได้เช่นกัน
            </StyleMainDesc>) 
          }
          <StyleMainReview>
            { (!review) ?
              (<></>) :
              (review.map ((x) => {
                if (x.mime === "text/html") {
                  return <iframe
                    key={x.reviewId} 
                    src={x.link}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen={true}
                    />
                }
                if (x.mime === "image/jpeg" || x.mime === "image/png") {
                  return <img key={x.reviewId} src={x.link}/>
                }
              }))
            }
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
content.Comment = function ProductComment ()
{
  const [param] = useSearchParams ();
  const id = param.get ("id");
  const auth = ctx.useAuth ();
  const queryList = ctxCustomer.useProductCommentList (Number (id));
  const queryData = queryList.data;

  const toast = ctxUI.useToast ();
  const rating = (queryData ? 
      queryData.length > 0 ?
      queryData.reduce ((x, y) => x += y.rating, 0) / queryData.length : 0.0 : 0.0).toFixed (1);
    
  const count = queryData ? queryData.length : 0;
  const empty = queryData ? queryData.length === 0 : true;

  const onClickComment = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (ctx.authSigned (auth))
    {
      return;
    }
    else
    {
      toast.setDuration (5000);
      toast.setText ("คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถแสดงความคิดเห็นได้");
      toast.setVisible (true);
    }
  } 

  return (
    <StyleComment>
      <StyleCommentTitle>ความคิดเห็น</StyleCommentTitle>
      <StyleCommentSummary>
        <StyleCommentStar>
          <StarIcon/>
          <StarIcon/>
          <StarIcon/>
          <StarIcon/>
          <StarIcon/>
        </StyleCommentStar>
        <p>{rating} / 5.0 จากทั้งหมด {count} คน</p>
        <StyleCommentAdd onClick={onClickComment}>
          <MessageSquare size={24}/>
          <span>ให้คะแนนเลย</span>
        </StyleCommentAdd>
      </StyleCommentSummary>
      <StyleCommentBody>
        { (empty) ?
          <p>สินค้ายังไม่ใครรีวิวเลย เป็นคนแรกที่รีวิวเลย</p> : <></>
        }
        { (queryData) ? 
          (queryData.map ((x) => <content.CommentItem id={x.commentId}/>)) : <></>
        }
      </StyleCommentBody>
    </StyleComment>
  );
}
content.CommentItem = function ProductCommentItem ({id}: {id: number;})
{
  const queryComment = ctxCustomer.useProductComment (id);
  const queryAccount = ctxCustomer.useAccountBasic ();

  const comment = queryComment.data;
  const account = queryAccount.data;

  const icon = account ? account.icon : "";
  const name = account ? account.name : "";
  const text = comment ? comment.text : "";

  return (
    <StyleCommentItem>
      <StyleCommentItemIcon src={apiStorage.getUrlStream (icon)}/>
      <StyleCommentItemTitle>{name}</StyleCommentItemTitle>
      <StyleCommentItemText>{text}</StyleCommentItemText>
    </StyleCommentItem>
  );
}

const StyleRoot = styled.div`
  margin: 96px 0px 64px 0px;
  display: block;
`;
const StyleBackground = styled.img<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
  position: fixed;
  inset: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  z-index: -1;
`;
const StyleMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 64px;
  position: relative;

  @media (max-width: 960px)
  {
    height: 100%;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
`;

const StyleCover = styled.img`
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
  display: block;
  width: 40%;
  height: 100%;

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
  min-height: 256px;
`;
const StyleMainReview = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  max-height: 256px;
  margin-bottom: 32px;
  overflow: hidden;
  gap: 8px;

  & > iframe
  {
    min-width: 384px;
    min-height: 256px;
    max-width: 384px;
    max-height: 256px;
  }

  @media (max-width: 768px)
  {
    flex-direction: column;

    & > iframe
    {
      min-width: 100%;
      min-height: 324px;
      max-width: 100%;
      max-height: 324px;
    }
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
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;

  width: 100%;
  height: 40px;

    & > button
  {
    display: inline-block;
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

const StyleComment = styled.div`
  width: 100%;
  min-height: 256px;
  padding: 32px 580px;

  @media (max-width: 1600px)
  {
    padding: 32px 512px;
  }
  @media (max-width: 1440px)
  {
    padding: 32px 384px;
  }
  @media (max-width: 1280px)
  {
    padding: 32px 256px;
  }
  @media (max-width: 1024px)
  {
    padding: 32px 128px;
  }
  @media (max-width: 860px)
  {
    padding: 32px 64px;
  }
  @media (max-width: 680px)
  {
    padding: 32px 16px;
  }
`;
const StyleCommentTitle = styled.label`
  display: block;
  font-size: 2rem;
  font-weight: normal;
  color: var(--text-primary);
`;
const StyleCommentSummary = styled.div`
  width: 100%;
  height: 256px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;
const StyleCommentBody = styled.div`
  margin: 8px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;
`;
const StyleCommentStar = styled.div`
  display: inline-block;
  color: var(--text-primary);
  margin: 4px 0px;

  & > img, & > svg
  {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin: 0px 8px;
  }
`;
const StyleCommentAdd = styled.button`
  & > img, & > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
`;

const StyleCommentItem = styled.div`
  width: 100%;
  height: 100%;
  min-height: 64px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  position: relative;
`;
const StyleCommentItemIcon = styled.img`
  display: block;
  position: absolute;
  background-color: var(--bg-secondary);
  border-radius: 100%;
  inset: 16px auto auto 16px;
  width: 32px;
  height: 32px;
`;
const StyleCommentItemTitle = styled.label`
  display: block;
  position: absolute;
  inset: 20px auto auto 64px;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  font-weight: normal
`;
const StyleCommentItemText = styled.p `
  padding: 48px 0px 16px 64px;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  font-weight: normal
`;

const SpecTable = styled.dl`
    margin: 0;
    display: grid;
    grid-template-columns: 180px 1fr;
    row-gap: 0;
    min-height: 256px;
    margin-bottom: 32px;
    color: var(--text-primary);
`;
const SpecRow = styled.div`
    display: contents;
    & > * { padding: 12px 0; border-bottom: 1px solid var(--bg-hairline); }
`;
const SpecKey = styled.dt`
    color: var(--text-muted);
    font-size: 1rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
`;
const SpecVal = styled.dd`
    margin: 0;
    color: #fff;
    font-size: 0.92rem;
`;
const StyledCart = styled.button<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
  position: fixed;
  inset: auto 64px 64px auto;
  width: 64px;
  height: 64px;
  padding: 0px;
  margin: 0px;
  border-radius: 100%;

  & > img,
  & > svg
  {
    display: inline-block;
    min-width: 32px;
    min-height: 32px;
    vertical-align: middle;
  }
  @media (max-width: 1024px)
  {
    bottom: 24px;
    right: 32px;
  }
`;
const StyledCartLabel = styled.label`
  position: absolute;
  inset: auto -16px 0px auto;
  font-size: 1rem;

  min-width: 24px;
  min-height: 24px;
  padding: 0px 4px;
  text-align: center;

  background-color: #FF7373;
  border-radius: 4px;
`;
/**
 * ส่งออกตัวแปร
*/
export default content;
