import { useAuth } from "#context/common.ts";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useContext, createContext } from "react";

import apiAuth from "#util/api.auth.ts";
import apiAccount from "#util/api.account.ts";
import apiProduct from "#util/api.product.ts";
import apiPromotion from "#util/api.promotion.ts";

import
{
    type BasicId as AccountId
}
from "#util/api.account.ts";
import 
{ 
    type BasicId as ProductId,
    type CommentId as ProductCommentId,
    type ReviewId as ProductReviewId,
    type BasicFetchOption as ProductSearchOption
} 
from "#util/api.product.ts";

/**
 * โครงสร้างข้อมูลบริบทแสดงหน้าตะกร้าสินค้า
*/
export interface Cart
{
    setVisible: (value: boolean) => void;
    setClose: (callback: () => void) => void;
}
/**
 * รับค่าเริ่มต้นของระบบแสดงหน้าตะกร้า
*/
export function defaultCart () : Cart
{
    return {
      setVisible: () => { return; },
      setClose: () => { return; }
    };
}
/**
 * ใช้งานระบบแสดงหน้าตะกร้า
*/
export function useCart ()
{
    return useContext (Cart);
}
export function useCartQuery ()
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Cart"],
        queryFn: () => apiAccount.getCart (auth.session),
        enabled: () => apiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
export function useAccountBasic ()
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Account", "Basic"],
        queryFn: () => apiAccount.getBasic (auth.session),
        enabled: apiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
export function useAccountBasicOf (id: AccountId)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Account", "Basic", id],
        queryFn: () => apiAccount.getBasic (auth.session, id),
        enabled: apiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
export function useAccountContact ()
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Account", "Contact"],
        queryFn: () => apiAccount.getContact (auth.session),
        enabled: () => apiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
export function useAccountOrder ()
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Account", "Order"],
        queryFn: () => apiAccount.getOrder (auth.session),
        enabled: () => apiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
export function useProduct (id: ProductId)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Product", "Basic", id],
        queryFn: () => apiProduct.getBasic (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
export function useProducts (id: ProductId [])
{
    const auth = useAuth ();
    return useQueries ({
        queries: id.map ((x) =>
        {
            return {
                queryKey: ["Product", "Basic", x],
                queryFn: () => apiProduct.getBasic (auth.session, x),
                enabled: true,
                throwOnError: false
            }
        })
    });
}
export function useProductList (option: ProductSearchOption)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Product", "BasicList", option],
        queryFn: () => apiProduct.getBasicList (auth.session, option),
        enabled: true,
        throwOnError: false
    });
}
export function useProductComment (id: ProductCommentId)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Product", "Comment", id],
        queryFn: () => apiProduct.getComment (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
export function useProductCommentList (id: ProductId)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Product", "CommentList", id],
        queryFn: () => apiProduct.getCommentList (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
export function useProductReview (id: ProductReviewId)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Product", "Review", id],
        queryFn: () => apiProduct.getReview (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
export function useProductReviewList (id: ProductId)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Product", "ReviewList", id],
        queryFn: () => apiProduct.getReviewList (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
export function usePromotion (code: string)
{
    const auth = useAuth ();
    return useQuery ({
        queryKey: ["Promotion", "Basic", code],
        queryFn: () => apiPromotion.getBasic (auth.session, code),
        enabled: () => code.length > 0,
        throwOnError: false
    });
}
export const useFavoriteQuery = () => {
    const auth = useAuth();
    
    return useQuery({
      queryKey: ["account", "favorite", auth.session],
      queryFn: () => apiAccount.getFavorite(auth.session),
      enabled: Boolean(auth.session),
    });
}

export const Cart = createContext<Cart> (defaultCart ());