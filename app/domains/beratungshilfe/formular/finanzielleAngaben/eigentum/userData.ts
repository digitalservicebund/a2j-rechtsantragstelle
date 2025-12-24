import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berhAntragFinanzielleAngabenEigentumPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEigentumUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenEigentumPages>;
