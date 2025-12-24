import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berHAntragWeitereAngabenPages } from "./pages";

export type BeratungshilfeWeitereAngabenUserData = UserDataFromPagesSchema<
  typeof berHAntragWeitereAngabenPages
>;
