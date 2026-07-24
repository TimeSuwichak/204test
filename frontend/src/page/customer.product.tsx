import apiAccount from "#util/api.account.ts";
import apiProduct from "#util/api.product.ts";
import apiStorage from "#util/api.storage.ts";

import MenuBar from "#component/menu.bar.tsx";

import { styled } from "styled-components";
import { useSearchParams } from "react-router";
import { useState, type MouseEvent } from "react";
import { useAuth } from "#context/common.ts";
import { useDialog, useToast } from "#context/common.ui.ts";
import 
{ 
  useAccountBasic, useAccountBasicOf, useCart, useCartQuery, useProduct, useProductComment, useFavoriteQuery,
  useProductCommentList, useProductReviewList 
} 
from "#context/customer.ts";
import 
{ 
  ShoppingCart, Share2Icon, Heart, StarIcon, 
  MessageSquare, TextAlignStart, MonitorCog, ShoppingBasket, 
  ArrowLeftIcon,
  CircleUser
} 
from "lucide-react";

/**
 * ส่วนประกอบแสดงรายละเอียดสินค้าที่ผู้ใช้กำลังเลือก
*/
export default function Product ()
{
  //
  // ดึงข้อมูลรหัสสินค้าปัจจุบัน
  //
  const [param] = useSearchParams ();
  const id = param.get ("id");

  //
  // ดึงข้อมูลจากเซิร์ฟเวอร์
  //
  const qBasic = useProduct (Number (id));

  //
  // ประมวลตัวแปร
  //
  const prodBasic = qBasic.data;
  const bg = prodBasic ? 
    apiStorage.getUrlStream (prodBasic.background) : undefined;

  return (
    <StlRoot>
      <StlBG src={bg} $visible={(bg != undefined && bg.length > 0)}/>
      <ViewMain/>
      <ViewComment/>
      <ViewCart/>
    </StlRoot>
  );
}
/**
 * ส่วนประกอบแสดงผลไอคอนตะกร้า
*/
function ViewCart ()
{
  const cart = useCart ();
  const cartQuery = useCartQuery ();
  const accountQuery = useAccountBasic ();

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
    <StyledCart onClick={onClick} $visible={accountQuery.data !== undefined}>
      <StyledCartLabel>{count}</StyledCartLabel>
      <ShoppingBasket/>
    </StyledCart>
  );
}
function ViewMain ()
{
  //
  // ดึงข้อมูลรหัสสินค้า
  //
  const [param] = useSearchParams ();
  const id = param.get ("id");
  //
  // ดึงบริการระบบ
  //
  const auth = useAuth ();
  const toast = useToast ();
  const [menu, setMenu] = useState (1);
  const [dialog] = useDialog ();
  //
  // ดึงข้อมูลจากเซิร์ฟเวอร์
  //
  const qProdId = Number (id);
  const qProdBasic = useProduct (qProdId);
  const qProdReview = useProductReviewList (Number (id));
  const qActBasic = useAccountBasic ();
  const qActCart = useCartQuery ();
  const qActFavorite = useFavoriteQuery (); // SSSS

  const prodBasic = qProdBasic.data;
  const prodReview = qProdReview.data;
  const actFavorite = qActFavorite.data; // SSSS

  //
  // ประมวลข้อมูลสำหรับการแสดงผล/อื่น ๆ
  //
  const prodName = prodBasic ? prodBasic.name : "";
  const prodSub = "";
  const prodDesc = prodBasic ? prodBasic.description : "";
  const prodPrice = prodBasic ? prodBasic.price.toFixed (2) : "";
  const prodCover = prodBasic ? 
          apiStorage.getUrlStream (prodBasic.cover) : undefined;
  const prodFavor = actFavorite ? 
          actFavorite.find ((x) => x.productId === qProdId) : undefined;

  const prodOutOfStck = prodBasic ? 
    prodBasic.status === apiProduct.STATUS_OUT_OF_STOCK : true;

  /**
   * เพิ่มสินค้านี้ลงในตะกร้าของผู้ใช้งานระบบ
  */
  function onClickAdd (event: MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (qActBasic.data === undefined)
    {
      toast.setDuration (5000);
      toast.setText ("คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถเพิ่มสินค้าได้");
      toast.setVisible (true);
      return;
    }

    //
    // ตรวจสอบจำนวนซ้ำของสินค้า
    //
    const duped = 
      qActCart.data ? 
      qActCart.data.find (x => x.productId === qProdId) : undefined;
    
    const dupedCount = duped ? duped.quantity + 1 : 0;

    if (duped === undefined)
    {
      onClickAddConfirmed ();
      return;
    }
    
    dialog.reset ();
    dialog.setTitle ("ยืนยันเพิ่มสินค้านี้ลงในตะกร้า");
    dialog.setMessage (
      `คุณได้เพิ่มสินค้านี้ลงในตะกร้าแล้ว การดำเนินการนี้จะเพิ่มเป็น ${String (dupedCount)} จำนวน ยืนยันหรือไหม่`
    );
    dialog.setVisible (true);
    dialog.setPrimary ("ยืนยัน", () =>
    {
      dialog.setVisible (false);
      onClickAddConfirmed ();
    });
    dialog.setSecondary ("ยกเลิก", () =>
    {
      dialog.setVisible (false);
    });
  }
  /**
   * ยืนยันการเพิ่มสินค้าลงในตะกร้า
  */
  function onClickAddConfirmed ()
  {    
    const id = prodBasic ? prodBasic.id : NaN;
    const name = prodBasic ? prodBasic.name : "";

    void apiAccount.createCart (auth.session, {
      productId: id,
      quantity: 1
    })
    .then (() =>
    {
      toast.setDuration (5000);
      toast.setText (`เพิ่ม ${name} ลงในตะกร้าเรียบร้อย`);
      toast.setVisible (true);

      //
      // ล้างแคชข้อมูลในตะกร้าของผู้ใช้งาน
      //
      void qActCart.refetch ();
    })
    .catch (() =>
    {
      dialog.reset ();
      dialog.setTitle ("เกิดข้อผิดพลาด");
      dialog.setMessage ("เกิดข้อผิดพลาดบางอย่าง โปรดทำการลองใหม่อีกครั้ง");
      dialog.setPrimary ("เข้าใจแล้ว", () =>
      {
        dialog.setVisible (false);
      });
      dialog.setVisible (true);
    });
  }
  /**
   * เพิ่มสินค้านี้ลงในรายการโปรดของผู้ใช้งานระบบ
  */
  const onClickFavorite = (event: MouseEvent) =>
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (qActBasic.data === undefined) 
    {
      toast.setDuration (5000);
      toast.setText (
        "คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถจัดการรายการโปรดได้"
      );
      toast.setVisible (true);
      return;
    }

    if (prodFavor)
    {
      //
      // กรณีที่ เป็นรายการโปรดอยู่แล้ว -> ให้ลบออก
      //
      void apiAccount.deleteFavorite (auth.session, prodFavor.favoriteId)
        .then (() =>
        {
          toast.setDuration (5000);
          toast.setText (`นำ ${prodBasic ? prodBasic.name : "สินค้า"} ออกจากรายการโปรดแล้ว`);
          toast.setVisible (true);
          void qActFavorite.refetch (); // รีเฟรชข้อมูลรายการโปรด
        })
        .catch (() =>
        {
          dialog.reset ();
          dialog.setTitle ("เกิดข้อผิดพลาด");
          dialog.setMessage (
            "เกิดข้อผิดพลาดในการนำรายการโปรดออก โปรดลองใหม่อีกครั้ง"
          );
          dialog.setPrimary ("เข้าใจแล้ว", () =>
          {
            dialog.setVisible (false);
          });
          dialog.setVisible (true);
      });
      return;
    }
    //
    // กรณีที่ ยังไม่ได้เป็นรายการโปรด -> ให้เพิ่มใหม่
    //
    void apiAccount.createFavorite (auth.session, { productId: qProdId })
      .then (() =>
      {
        toast.setDuration (5000);
        toast.setText (`เพิ่ม ${prodBasic ? prodBasic.name : "สินค้า"} ลงในรายการโปรดเรียบร้อย`);
        toast.setVisible (true);
        void qActFavorite.refetch (); // รีเฟรชข้อมูลรายการโปรด
      })
      .catch (() =>
      {
        dialog.reset ();
        dialog.setTitle ("เกิดข้อผิดพลาด");
        dialog.setMessage (
          "เกิดข้อผิดพลาดในการเพิ่มรายการโปรด โปรดลองใหม่อีกครั้ง"
        );
        dialog.setPrimary ("เข้าใจแล้ว", () =>
        {
          dialog.setVisible (false);
        });
        dialog.setVisible (true);
      });
  }
  /**
   * เปิดหน้าต่างแชร์สินค้า
  */
  function onClickShare (event: MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    void navigator.clipboard.writeText(window.location.href).then (() =>
    {
      toast.setDuration (5000);
      toast.setText ("คัดลอกลิงค์แชร์เรียบร้อย");
      toast.setVisible (true);
    })
    .catch (() =>
    {
      dialog.reset ();
      dialog.setTitle ("คัดลอกลิงค์แชร์ผิดพลาด");
      dialog.setMessage ("เกิดข้อผิดพลาดบางอย่าง โปรดทำการลองใหม่อีกครั้ง");
      dialog.setPrimary ("เข้าใจแล้ว", () =>
      {
        dialog.setVisible (false);
      });
      dialog.setVisible (true);
    })
  }

  return (
    <StlMain>
      <StlCover src={prodCover}/>
      <StleMainView>
        <header>
          <StlMainTitle>{prodName}</StlMainTitle>
          <StlMainTitleSub>{prodSub}</StlMainTitleSub>
        </header>
        <main>
          <MenuBar
            direction="row" selected={menu} margin="0px 0px 16px 0px"
            onClick={(v) => { setMenu (v as number); }}>
            <MenuBar.Item icon={<TextAlignStart/>} width="192px" text="รายละเอียด" value={1}/>
            <MenuBar.Item icon={<MonitorCog/>} width="192px" text="ข้อมูลจำเพาะ" value={2}/>
            {/* <MenuBar.Item icon={<Package/>} width="192px" text="การจัดส่ง" value={3}/> */}
          </MenuBar>
          { (menu !== 1) ? (<></>) : (<StlMainDesc>{prodDesc}</StlMainDesc>) }
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
            <StlMainDesc>
              จัดส่งทั่วประเทศไทยผ่าน Kerry / Flash ภายใน 1-3 วันทำการ
              สั่งซื้อครบ 1,500 ฿ ขึ้นไป จัดส่งฟรี
              สามารถรับสินค้าที่หน้าร้านได้เช่นกัน
            </StlMainDesc>) 
          }
          <StlMainReview>
            { (!prodReview) ?
              (<></>) :
              (prodReview.map ((x) => {
                if (x.mime === "text/html") {
                  return <iframe
                    key={x.reviewId} 
                    src={x.link}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen={true}
                    style={{ aspectRatio: "16 / 9 "}}
                    />
                }
                if (x.mime === "image/jpeg" || x.mime === "image/png") {
                  return <img 
                    key={x.reviewId} 
                    src={x.link} 
                    style={{ aspectRatio: "16 / 9 "}}/>
                }
              }))
            }
          </StlMainReview>
          <StlMainOption>
            <StlMainPrice>
              {/* <StlMainPriceDiscount>99%</StlMainPriceDiscount> */}
              { (prodOutOfStck) ? 
                (<span>สินค้าหมด</span>) : 
                (<span>{prodPrice} ฿</span>) 
              }
            </StlMainPrice>
            <StlMainAction>
              <button onClick={onClickAdd}>
                <ShoppingCart/>
                <span>เพิ่มลงในตะกร้า</span>
              </button>
              {/* SSS */}
              <button onClick={onClickFavorite}>
          <Heart 
            color={prodFavor ? "#ff4d4f" : "currentColor"} 
            fill={prodFavor ? "#ff4d4f" : "none"} 
          />
          <span>{prodFavor ? "นำออกจากรายการโปรด" : "เพิ่มรายการโปรด"}</span> 
        </button>
              {/* SSS */}
              <button onClick={onClickShare}>
                <Share2Icon/>
                <span>แชร์</span>
              </button>
            </StlMainAction>
          </StlMainOption>
        </main>
      </StleMainView>
    </StlMain>
  );
}
/**
 * ส่วนประกอบแสดงรายการความคิดเห็น
*/
function ViewComment ()
{
  //
  // ดึงรหัสสินค้า
  //
  const [param] = useSearchParams ();
  const id = param.get ("id");
  //
  // ใช้งานบริการระบบ
  //
  const auth = useAuth ();
  const toast = useToast ();
  //
  // ดึงข้อมูลจากเซิร์ฟเวอร์
  //
  const qProdComment = useProductCommentList (Number (id));
  const qActBasic = useAccountBasic ();
  //
  // สถานะ UI
  //
  const [edit, setEdit] = useState (false);
  const [editText, setEditText] = useState ("");
  const [editRating, setEditRating] = useState (5);

  const prodComment = qProdComment.data;

  //
  // คำนวณข้อมูลสำหรับการแสดงผล
  //
  const rating = (prodComment ? 
      prodComment.length > 0 ?
      prodComment.reduce ((x, y) => x += y.rating, 0) / prodComment.length : 0.0 : 0.0);
    
  const count = prodComment ? prodComment.length : 0;
  const empty = prodComment ? prodComment.length === 0 : true;

  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มแสดงความคิดเห็น
  */
  function onClickComment (event: MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    if (!qActBasic.data) 
    {
      toast.setDuration (5000);
      toast.setText (
        "คุณจำเป็นต้องลงชื่อเข้าใช้ก่อนจึงจะสามารถแสดงความคิดเห็นได้"
      );
      toast.setVisible (true);
      return;
    }
    if (!qProdComment.data) 
    {
      //
      // รอให้ระบบโหลดเสร็จก่อน
      //
      return;
    }

    const previous = qProdComment.data.find (
      (x) => x.author === qActBasic.data.id
    );

    if (!edit)
    {
      //
      // เปิดใช้งานโหมดแก้ไข
      //
      setEdit (true);

      if (previous !== undefined)
      {
        //
        // มีข้อมูลความคิดเห็นก่อนหน้านี้
        //
        setEditRating (previous.rating);
        setEditText (previous.text);
      }
      return;
    }

    if (previous)
    {
      void apiProduct.updateComment (auth.session, {
        commentId: previous.commentId,
        title: "",
        text: editText,
        rating: editRating,
      })
      .then (() =>
      {
        toast.setText ("อัพเดทความคิดเห็นของคุณแล้ว");
        toast.setDuration (5000);
        toast.setVisible (true);

        void qProdComment.refetch ();
      })
      .catch (() =>
      {
        toast.setText (
          "เกิดข้อผิดพลาดในการอัพเดทความคิดเห็น โปรดลองใหม่อีกครั้ง"
        );
        toast.setDuration (5000);
        toast.setVisible (true);
      });
      return;
    }
    void apiProduct.createComment (auth.session, {
      productId: Number (id),
      title: "",
      text: editText,
      rating: editRating,
    })
    .then (() =>
    {
      toast.setText ("เพิ่มความคิดเห็นของคุณแล้ว");
      toast.setDuration (5000);
      toast.setVisible (true);

      void qProdComment.refetch ();
    })
    .catch (() =>
    {
      toast.setText (
        "เกิดข้อผิดพลาดในการแสดงความคิดเห็น โปรดลองใหม่อีกครั้ง"
      );
      toast.setDuration (5000);
      toast.setVisible (true);
    });
  } 
  /**
   * ทำงานเมื่อผู้ใช้กดปุ่มย้อนกลับ 
   */
  function onClickCommentBack (event: MouseEvent)
  {
    event.preventDefault ();
    event.stopPropagation ();

    setEdit (false);
  }

  return (
    <StlComment>
      <StlCommentTitle>ความคิดเห็น</StlCommentTitle>
      <StlCommentSummary>
        <StlCommentStar>
          { (edit ? editRating >= 1 : rating >= 1) ?
            (<StarIcon color="#f5ec00" absoluteStrokeWidth />) :
            (<StarIcon/>)
          }
          { (edit ? editRating >= 2 : rating >= 2) ?
            (<StarIcon color="#f5ec00" absoluteStrokeWidth />) :
            (<StarIcon/>)
          }
          { (edit ? editRating >= 3 : rating >= 3) ?
            (<StarIcon color="#f5ec00" absoluteStrokeWidth onClick={() => {
              setEditRating (3);
            }}/>) :
            (<StarIcon onClick={() => {
              setEditRating (3);
            }}/>)
          }
          { (edit ? editRating >= 4 : rating >= 4) ?
            (<StarIcon color="#f5ec00" absoluteStrokeWidth onClick={() => {
              setEditRating (4);
            }}/>) :
            (<StarIcon onClick={() => {
              setEditRating (4);
            }}/>)
          }
          { (edit ? editRating >= 5 : rating >= 5) ?
            (<StarIcon color="#f5ec00" absoluteStrokeWidth onClick={() => {
              setEditRating (5);
            }}/>) :
            (<StarIcon onClick={() => {
              setEditRating (5);
            }}/>)
          }

        </StlCommentStar>
        { (edit) ?
          (<></>) :
          (<p>{rating.toFixed (2)} / 5.0 จากทั้งหมด {count} คน</p>)
        }
        { (!edit) ?
          (<></>) :
          (
          <StyleCommentContainer 
            value={editText}
            onChange={(e) => { setEditText (e.target.value); }}>
            </StyleCommentContainer>
          )
        }
        <div style={{ display: 'flex', gap: '8px' }}>
          <StlCommentAdd onClick={onClickComment}>
            <MessageSquare size={24}/>
            <span>ให้คะแนนเลย</span>
          </StlCommentAdd>
          <StlCommentAdd onClick={onClickCommentBack} 
            style={{ display: edit ? "block" : "none"}}>
            <ArrowLeftIcon size={24}/>
            <span>ย้อนกลับ</span>
          </StlCommentAdd>
        </div>
      </StlCommentSummary>
      <StlCommentBody>
        { (empty) ?
          <p>สินค้ายังไม่ใครรีวิวเลย เป็นคนแรกที่รีวิวเลย</p> : <></>
        }
        { (prodComment) ? 
          (prodComment.map ((x) => <ViewCommentItem
            key={x.commentId}
            id={x.commentId}/>)) : <></>
        }
      </StlCommentBody>
    </StlComment>
  );
}
/**
 * ส่วนประกอบแสดงองค์ประกอบความเห็น
*/
function ViewCommentItem ({id}: {id: number;})
{
  const qComment = useProductComment (id);
  const qAuthor = useAccountBasicOf (
    qComment.data ? qComment.data.author : 0);

  const comment = qComment.data;
  const author = qAuthor.data;

  const icon = author ? author.icon : "";
  const name = author ? author.name : "";
  const text = comment ? comment.text : "";

  return (
    <StlCommentItem>
      { (icon.length > 0) ?
        (<StlCommentItemIcon src={apiStorage.getUrlStream (icon)}/>) :
        (<CircleUser/>)
      }
      <StlCommentItemTitle>{name}</StlCommentItemTitle>
      <StlCommentItemText>{text}</StlCommentItemText>
    </StlCommentItem>
  );
}

const StlRoot = styled.div`
  margin: 96px 0px 64px 0px;
  display: block;
`;
const StlBG = styled.img<{ $visible: boolean; }>`
  display: ${prop => prop.$visible ? "block" : "none"};
  position: fixed;
  inset: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  z-index: -1;
`;
const StlMain = styled.div`
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

const StlCover = styled.img`
  display: block;
  width: 550px;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 3 / 4;

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
const StleMainView = styled.div`
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
const StlMainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: normal;
`;
const StlMainTitleSub = styled.h2`
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 32px;
`;
const StlMainDesc = styled.p`
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 32px;
  min-height: 256px;
`;
const StlMainReview = styled.div`
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


const StlMainOption = styled.div`
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
const StlMainPrice = styled.label`
  display: block;
  position: relative;
  font-size: 1.5rem;
  width: 128px;
`;
// const StlMainPriceDiscount = styled.label`
//   font-size: 1.25rem;
//   position: absolute;
//   inset: auto 16px -32px auto;
//   background-color: #FF7373;
//   border-radius: 16px;
//   padding: 0px 16px;
// `;
const StlMainAction = styled.div`
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

const StlComment = styled.div`
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
const StlCommentTitle = styled.label`
  display: block;
  font-size: 2rem;
  font-weight: normal;
  color: var(--text-primary);
`;
const StlCommentSummary = styled.div`
  width: 100%;
  height: 324px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;
const StlCommentBody = styled.div`
  margin: 8px 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 8px;
`;
const StlCommentStar = styled.div`
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
const StlCommentAdd = styled.button`
  & > img, & > svg
  {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 16px;
  }
`;

const StlCommentItem = styled.div`
  width: 100%;
  height: 100%;
  min-height: 64px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  position: relative;

  & > svg
  {
    display: block;
    position: absolute;
    background-color: var(--bg-secondary);
    border-radius: 100%;
    inset: 16px auto auto 16px;
    width: 32px;
    height: 32px;
    color: var(--text-primary);
  }
`;
const StlCommentItemIcon = styled.img`
  display: block;
  position: absolute;
  background-color: var(--bg-secondary);
  border-radius: 100%;
  inset: 16px auto auto 16px;
  width: 32px;
  height: 32px;
`;
const StlCommentItemTitle = styled.label`
  display: block;
  position: absolute;
  inset: 20px auto auto 64px;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  font-weight: normal
`;
const StlCommentItemText = styled.p `
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
const StyleCommentContainer = styled.textarea`
  background-color: var(--input-primary);
  color: var(--text-primary);
  width: 100%;
  height: 50%;
  padding: 12px;
  border: 0px black solid;
  border-radius: 12px;
`;
