import { useContext, createContext } from "react";
import { useQuery } from "@tanstack/react-query";

import Ctx from "#context/common.ts";
import ApiAuth from "#util/api.auth.ts";
import ApiAccount from "#util/api.account.ts";

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
        throwOnError: true
    });
}

const Content = () => { return; }
const ContextCart = createContext<ContextCart> (defCart ());

Content.ProviderCart = ContextCart.Provider;
Content.defCart = defCart;
Content.useCart = useCart;
Content.useCartQuery = useCartQuery;

export default Content;