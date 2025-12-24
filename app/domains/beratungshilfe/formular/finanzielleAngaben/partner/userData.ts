import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berhAntragFinanzielleAngabenPartnerPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenPartnerUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenPartnerPages>;
