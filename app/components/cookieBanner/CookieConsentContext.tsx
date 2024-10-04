import { createContext } from "react";

export const CookieConsentContext = createContext<boolean | undefined>(
  undefined,
);
