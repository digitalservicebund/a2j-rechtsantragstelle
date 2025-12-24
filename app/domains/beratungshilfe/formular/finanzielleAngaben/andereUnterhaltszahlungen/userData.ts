import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData =
  UserDataFromPagesSchema<
    typeof berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages
  >;
