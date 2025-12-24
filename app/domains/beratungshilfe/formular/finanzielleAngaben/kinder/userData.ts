import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berhAntragFinanzielleAngabenKinderPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenKinderUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenKinderPages>;
