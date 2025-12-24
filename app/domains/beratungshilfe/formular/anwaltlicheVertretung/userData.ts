import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berHAntragAnwaltlicheVertretungPages } from "./pages";
export type BeratungshilfeAnwaltlicheVertretungUserData =
  UserDataFromPagesSchema<typeof berHAntragAnwaltlicheVertretungPages>;
