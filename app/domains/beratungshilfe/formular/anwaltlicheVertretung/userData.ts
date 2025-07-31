import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berHAntragAnwaltlicheVertretungPages } from "./pages";
export type BeratungshilfeAnwaltlicheVertretungUserData =
  UserDataFromPagesSchema<typeof berHAntragAnwaltlicheVertretungPages>;
