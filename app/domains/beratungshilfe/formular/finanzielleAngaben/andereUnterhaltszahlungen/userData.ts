import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData =
  UserDataFromPagesSchema<
    typeof berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages
  >;
