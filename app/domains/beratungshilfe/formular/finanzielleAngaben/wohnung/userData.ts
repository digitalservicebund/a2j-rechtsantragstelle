import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berhAntragFinanzielleAngabenWohnungPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenWohnungUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenWohnungPages>;
