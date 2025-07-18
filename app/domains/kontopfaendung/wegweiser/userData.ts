import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type kontopfaendungWegweiserPages } from "./pages";
export type KontopfaendungWegweiserUserData = UserDataFromPagesSchema<
  typeof kontopfaendungWegweiserPages
>;
