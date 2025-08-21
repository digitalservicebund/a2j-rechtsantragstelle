import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berHAntragWeitereAngabenPages } from "./pages";

export type BeratungshilfeWeitereAngabenUserData = UserDataFromPagesSchema<
  typeof berHAntragWeitereAngabenPages
>;
