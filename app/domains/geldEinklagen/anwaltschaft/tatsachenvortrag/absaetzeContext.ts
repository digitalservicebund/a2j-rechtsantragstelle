import { createContext, useContext } from "react";

type AbsaetzeContext = {
  absaetzeBaseUrl: string;
  absaetzeArrayName: string;
};

export const AbsaetzeContext = createContext<AbsaetzeContext>({
  absaetzeBaseUrl: "",
  absaetzeArrayName: "",
});

export function useAbsaetze(): AbsaetzeContext {
  return useContext(AbsaetzeContext);
}

export const absaetzeFocusKey = (baseUrl: string) =>
  `focus-absaetze-${baseUrl}`;

export const saveAbsaetzeFocusInSession = (
  baseUrl: string,
  targetId: string,
  fallbackId: string = targetId,
) => {
  sessionStorage.setItem(
    absaetzeFocusKey(baseUrl),
    `${targetId}|${fallbackId}`,
  );
};
