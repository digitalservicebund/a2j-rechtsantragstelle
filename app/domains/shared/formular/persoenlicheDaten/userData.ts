import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type sharedPersoenlicheDatenPages } from "./pages";

export type SharedPersoenlicheDatenUserData = UserDataFromPagesSchema<
  typeof sharedPersoenlicheDatenPages
>;
