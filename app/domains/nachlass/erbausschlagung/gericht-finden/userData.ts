import { type erbausschlagungGerichtFindenPages } from "~/domains/nachlass/erbausschlagung/gericht-finden/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type ErbausschlagungGerichtFindenUserData = UserDataFromPagesSchema<
  typeof erbausschlagungGerichtFindenPages
>;
