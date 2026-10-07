import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { createContext, useContext } from "react";

type BegruendungAbschnitteContext = {
  abschnitte: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >;
};

export const BegruendungAbschnitteContext =
  createContext<BegruendungAbschnitteContext>({
    abschnitte: [],
  });

export function useBegruendungAbschnitte(): BegruendungAbschnitteContext {
  return useContext(BegruendungAbschnitteContext);
}
