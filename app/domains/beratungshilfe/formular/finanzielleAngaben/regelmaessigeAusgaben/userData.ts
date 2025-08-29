import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berhAntragFinanzielleAngabenRegelmassigeAusgabenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData =
  UserDataFromPagesSchema<
    typeof berhAntragFinanzielleAngabenRegelmassigeAusgabenPages
  >;
