import { createContext } from "react";
import { type KlageParteien } from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";

export type KlageParteienContext = {
  naturalPersonen: KlageParteien;
  organizations: KlageParteien;
};

export const KlageParteienContext = createContext<KlageParteienContext>({
  naturalPersonen: [],
  organizations: [],
});
