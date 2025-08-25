import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berhAntragFinanzielleAngabenPartnerPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenPartnerUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenPartnerPages>;
