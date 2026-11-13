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
