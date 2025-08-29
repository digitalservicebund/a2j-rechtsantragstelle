import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berhAntragFinanzielleAngabenEigentumPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEigentumUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenEigentumPages>;
