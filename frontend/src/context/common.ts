import react from "react";

interface ContextAuth
{
    name: string;
    session: string;
    sessionIssued: Date;
    sessionExpire: Date;
}
interface ContextLanguage
{
    text: number;
    caption: number;
    voice: number;
}
const defAuth = () : ContextAuth =>
{
    return {
        name: "",
        session: "",
        sessionIssued: new Date (NaN),
        sessionExpire: new Date (NaN),
    };
}
const defLanguage = () : ContextLanguage =>
{
    return {
        text: 0,
        caption: 0,
        voice: 0
    }
}
const useAuth = () =>
{
    return react.useContext (ContextAuth);
}
const useLanguage = () =>
{
    return react.useContext (ContextLanguage);
}

const Content = () => { return; }
const ContextAuth = react.createContext (defAuth ());
const ContextLanguage = react.createContext (defLanguage ());

Content.ProviderAuth = ContextAuth.Provider;
Content.ProviderLanguage = ContextLanguage.Provider;
Content.defAuth = defAuth;
Content.defLanguage = defLanguage;
Content.useAuth = useAuth;
Content.useLanguage = useLanguage;

Content.authSigned = (auth: ContextAuth) =>
{
    return (
        auth.name != "" &&
        auth.session != "" &&
        Date.now () >= auth.sessionIssued.getTime () &&
        Date.now () <= auth.sessionExpire.getTime ()
    );
}
Content.authExpired = (auth: ContextAuth) =>
{
    return (
        Date.now () < auth.sessionIssued.getTime () ||
        Date.now () > auth.sessionExpire.getTime ()
    );
}

export default Content;