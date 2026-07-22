import { useContext, createContext } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import Ctx from "#context/common.ts";
import ApiAuth from "#util/api.auth.ts";
import ApiAccount from "#util/api.account.ts";
import ApiProduct from "#util/api.product.ts";
import ApiPromotion from "#util/api.promotion.ts";

import { 
    type BasicId as ProductId,
    type CommentId as ProductCommentId,
    type ReviewId as ProductReviewId,
    type BasicFetchOption as ProductSearchOption
} from "#util/api.product.ts";

interface ContextCart
{
    setVisible: (value: boolean) => void;
    setClose: (callback: () => void) => void;
}

const defCart = () : ContextCart =>
{
    return {
      setVisible: () => { return; },
      setClose: () => { return; }
    };
}

const useCart = () =>
{
    return useContext (ContextCart);
}
const useCartQuery = () =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Cart"],
        queryFn: () => ApiAccount.getCart (auth.session),
        enabled: () => ApiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
const useAccountBasic = () =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
    queryKey: ["Account", "Basic"],
    queryFn: () => ApiAccount.getBasic (auth.session),
        enabled: ApiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
const useAccountContact = () =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Account", "Contact"],
        queryFn: () => ApiAccount.getContact (auth.session),
        enabled: () => ApiAuth.checkSession ({
            secret: auth.session,
            issued: auth.sessionIssued,
            expire: auth.sessionExpire
        }),
        throwOnError: false
    });
}
const useProduct = (id: ProductId) =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Product", "Basic", id],
        queryFn: () => ApiProduct.getBasic (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
const useProducts = (id: ProductId []) =>
{
    const auth = Ctx.useAuth ();
    return useQueries ({
        queries: id.map ((x) =>
        {
            return {
                queryKey: ["Product", "Basic", x],
                queryFn: () => ApiProduct.getBasic (auth.session, x),
                enabled: true,
                throwOnError: false
            }
        })
    });
}
const useProductList = (option: ProductSearchOption) =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Product", "BasicList", option],
        queryFn: () => ApiProduct.getBasicList (auth.session, option),
        enabled: true,
        throwOnError: false
    });
}
const useProductComment = (id: ProductCommentId) =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Product", "Comment", id],
        queryFn: () => ApiProduct.getComment (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
const useProductCommentList = (id: ProductId) =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Product", "CommentList", id],
        queryFn: () => ApiProduct.getCommentList (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
const useProductReview = (id: ProductReviewId) =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Product", "Review", id],
        queryFn: () => ApiProduct.getReview (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
const useProductReviewList = (id: ProductId) =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Product", "ReviewList", id],
        queryFn: () => ApiProduct.getReviewList (auth.session, id),
        enabled: true,
        throwOnError: false
    });
}
const usePromotion = (code: string) =>
{
    const auth = Ctx.useAuth ();
    return useQuery ({
        queryKey: ["Promotion", "Basic", code],
        queryFn: () => ApiPromotion.getBasic (auth.session, code),
        enabled: () => code.length > 0,
        throwOnError: false
    });
}


const Content = () => { return; }
const ContextCart = createContext<ContextCart> (defCart ());

Content.ProviderCart = ContextCart.Provider;
Content.defCart = defCart;
Content.useCart = useCart;
Content.useCartQuery = useCartQuery;
Content.useAccountBasic = useAccountBasic;
Content.useAccountContact = useAccountContact;
Content.useProduct = useProduct;
Content.useProducts = useProducts;
Content.useProductList = useProductList;
Content.useProductComment = useProductComment;
Content.useProductCommentList = useProductCommentList;
Content.useProductReview = useProductReview;
Content.useProductReviewList = useProductReviewList;
Content.usePromotion = usePromotion;

export default Content;