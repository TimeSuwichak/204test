import styled from "styled-components";
import error from "#util/common.error.ts";
import apiAccount from "#util/api.account.ts";

import PageList from "#component/customer.cart.list.tsx";
import PageCheckout from "#component/customer.cart.checkout.tsx";

import { useRef, useState, useEffect } from "react";
import { useAuth } from "#context/common.ts";
import { useCart, useCartQuery } from "#context/customer.ts";
import { useDialog, useToast } from "#context/common.ui.ts";

/**
 * ส่วนประกอบการแสดงผลรายการในตะกร้าและการสั่งซื้อสินค้า
 */
const content = function CustomerCart(prop: PropRoot) {
  return content.Root(prop);
};

/**
 * ส่วนประกอบรวมทุกส่วนประกอบย่อยเข้าด้วยกัน 
 */
content.Root = function CartRoot(prop: PropRoot) 
{
  const auth = useAuth ();
  const cart = useCartQuery ();
  const [dialog] = useDialog ();
  const [code, setCode] = useState ("");
  const [window, setWindow] = useState (1);

  useEffect (() =>
  {
    if (prop.visible) 
    {
      void cart.refetch ();
    }
  },
  [prop.visible, cart]);

  return (
    <StyleView $visible={prop.visible ?? true}>
      <StyleViewInner $visible={prop.visible ?? true}>
        <StyleViewPanel>
         <PageList 
          visible={window === 1} 
          promotion={[code, setCode]}
          onContinue={() => { setWindow (2); }}
          onClose={prop.onClose}/>
        <PageCheckout 
          open={window === 2}
          onClose={() => { setWindow (1); }}
          onConfirm={(payload) => {
            if (!cart.data) {
              return;
            }
            apiAccount.createOrder (auth.session, {
              shipName: payload.name,
              shipAddress: payload.address,
              shipEmail: payload.email,
              shipPhone: payload.phone,
              promotionId: code.length > 0 ? code : null,
              paymentType: 
                payload.method == "promptpay" ? 1 : 2,
              remark: payload.note,
              item: cart.data.map ((x) =>
              {
                return {
                  productId: x.productId,
                  quantity: x.quantity
                }
              })
            })
            .then (() =>
            {
              setCode ("");

              dialog.reset ();
              dialog.setTitle ("ยืนยันคำสั่งซื้อสินค้า");
              dialog.setMessage ("ดำเนินการสั่งซื้อสินค้าเรียบร้อยแล้ว คุณสามารถดูรายละเอียดและประวัติได้ที่โปรไฟล์ของคุณ");
              dialog.setPrimary ("เรียบร้อย", () =>
              {
                dialog.setVisible (false);

                if (prop.onClose) {
                  prop.onClose ();
                }
              });
              dialog.setVisible (true);
            })
            .catch ((e: unknown) =>
            {
              const message = 
                e instanceof error.Gone ? 
                "ไม่สามารถดำเนินการสั่งซื้อสินค้าได้เนื่องจากสต็อกสินค้าหมด" :
                "ไม่สามารถดำเนินการสั่งซื้อสินค้าได้ โปรดลองใหม่อีกครั้ง";

              dialog.reset ();
              dialog.setTitle ("ยืนยันคำสั่งซื้อสินค้า");
              dialog.setMessage (message);
              dialog.setPrimary ("เข้าใจแล้ว", () =>
              {
                dialog.setVisible (false);
              });
            })
          }}/>
        </StyleViewPanel>
      </StyleViewInner>
    </StyleView>
  );
};


content.Provider = function CartProvider() 
{
  const context = useCart ();
  const close = useRef(() => {
    return;
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    context.setVisible = (value) => {
      setVisible(value);
    };
    context.setClose = (value) => {
      close.current = value;
    };

    return () => {
      context.setVisible = () => {
        return;
      };
      context.setClose = () => {
        return;
      };
    };
  });

  return <content.Root visible={visible} onClose={close.current} />;
};

/* ==========================================================================
   STYLED COMPONENTS
   ========================================================================== */

const StyleView = styled.div<{ $visible: boolean }>`
  display: ${(prop) => (prop.$visible ? "block" : "none")};
  pointer-events: ${(prop) => (prop.$visible ? "all" : "none")};
  position: fixed;
  overflow: hidden;
  overscroll-behavior: none;
  inset: 0px;
  z-index: 1000;
`;

const StyleViewInner = styled.div<{ $visible: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${(prop) => (prop.$visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const StyleViewPanel = styled.div`
  max-width: 1268px;
  max-height: 768px;
  width: 100%;
  height: 100%;
  pointer-events: all;
  background-color: var(--bg-primary);
  border: 2px solid var(--bg-primary-border);
  border-radius: 4px;
  padding: 16px;

  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: 860px) {
    max-width: 100%;
    max-height: 100%;
  }
`;

interface PropRoot {
  visible?: boolean;
  onClose?: () => void;
}

export default content;