import { createContext, useContext } from "react";

type CookieConsentContext = {
  hasTrackingConsent?: boolean;
};

export const CookieConsentContext = createContext<CookieConsentContext>({
  hasTrackingConsent: undefined,
});

export function useCookieConsent(): CookieConsentContext {
  return useContext(CookieConsentContext);
}
