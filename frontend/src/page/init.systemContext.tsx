import Context    from "#context/common.ts";
import ContextUI  from "#context/common.ui.ts";
import ApiAuth    from "#util/api.auth.ts";

import { useEffect, useRef, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";

/**
 * ระบบของ React Query
*/
const query = new QueryClient ();
/**
 * ส่วนประกอบการทำงานของระบบ
*/
const content = function InitSystemContext (prop: ComponentProperty)
{
  const auth = useRef (Context.defAuth ());
  const language = useRef (Context.defLanguage ());
  const menuContext = useRef (ContextUI.defMenuContext ());
  const settings = useRef (ContextUI.defSettings ());
  const toast = useRef (ContextUI.defToast ());

  const onInitAuth = useCallback (() =>
  {
    const saved = ApiAuth.saveGetItemPrefered ();
    const ctx = auth.current;

    if (saved)
    {
      ctx.name = saved.name;
      ctx.session = saved.secret;
      ctx.sessionIssued = saved.issued;
      ctx.sessionExpire = saved.expired;
    }
  }, 
  []);
  const onTerminateAuth = useCallback (() =>
  {
    return;
  },
  []);

  useEffect (() =>
  {
    const onMounted = prop.onMounted;
    const onUnmounted = prop.onUnmounted;

    onInitAuth ();
    onMounted ();

    return () =>
    {
      onTerminateAuth ();
      onUnmounted ();
    }
  },
  [
    prop.onMounted, prop.onUnmounted,
    onInitAuth,
    onTerminateAuth
  ]);

  return (
    <Context.ProviderAuth value={auth.current}>
      <Context.ProviderLanguage value={language.current}>
        <ContextUI.ProviderMenuContext value={menuContext.current}>
          <ContextUI.ProviderToast value={toast.current}>
            <ContextUI.ProviderSettings value={settings.current}>
              <QueryClientProvider client={query}>
                {prop.children}
              </QueryClientProvider>
            </ContextUI.ProviderSettings>
          </ContextUI.ProviderToast>
        </ContextUI.ProviderMenuContext>
      </Context.ProviderLanguage>
    </Context.ProviderAuth>
  );
}

interface ComponentProperty
{
  onMounted: () => void;
  onUnmounted: () => void;
  children: ReactNode;
}

/**
 * ส่งออกตัวแปร
*/
export default content;