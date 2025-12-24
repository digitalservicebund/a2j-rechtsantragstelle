import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berhAntragFinanzielleAngabenWohnungPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenWohnungUserData =
  UserDataFromPagesSchema<typeof berhAntragFinanzielleAngabenWohnungPages>;
