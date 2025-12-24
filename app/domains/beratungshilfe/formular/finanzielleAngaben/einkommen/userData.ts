import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berhAntragFinanzielleAngabenEinkommenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEinkommenUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenEinkommenPages>;
