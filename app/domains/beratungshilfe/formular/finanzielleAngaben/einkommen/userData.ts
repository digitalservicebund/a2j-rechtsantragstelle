import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berhAntragFinanzielleAngabenEinkommenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEinkommenUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenEinkommenPages>;
