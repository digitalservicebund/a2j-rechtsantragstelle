import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berhAntragFinanzielleAngabenRegelmassigeAusgabenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData =
  UserDataFromPagesSchema<
    typeof berhAntragFinanzielleAngabenRegelmassigeAusgabenPages
  >;
