import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berhAntragFinanzielleAngabenKinderPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenKinderUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenKinderPages>;
