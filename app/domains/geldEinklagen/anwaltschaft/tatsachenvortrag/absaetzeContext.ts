import { createContext, useContext } from "react";

type AbsaetzeContext = {
  isNebenantrag: boolean;
  hauptantragArrayIndex: number;
  nebenantragArrayIndex: number | undefined;
  absaetzeBaseUrl: string;
  absaetzeArrayName: string;
};

export const AbsaetzeContext = createContext<AbsaetzeContext>({
  isNebenantrag: false,
  hauptantragArrayIndex: -1,
  nebenantragArrayIndex: undefined,
  absaetzeBaseUrl: "",
  absaetzeArrayName: "",
});

export function useAbsaetze(): AbsaetzeContext {
  return useContext(AbsaetzeContext);
}
