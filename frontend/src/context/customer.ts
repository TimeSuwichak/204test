import react from "react";

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
    return react.useContext (ContextCart);
}

const Content = () => { return; }
const ContextCart = react.createContext<ContextCart> (defCart ());

Content.ProviderCart = ContextCart.Provider;
Content.defCart = defCart;
Content.useCart = useCart;

export default Content;