import { type UserDataFromPagesSchema } from "~/domains/types";
import { type kontopfaendungWegweiserPages } from "./pages";
export type KontopfaendungWegweiserUserData = UserDataFromPagesSchema<
  typeof kontopfaendungWegweiserPages
>;
