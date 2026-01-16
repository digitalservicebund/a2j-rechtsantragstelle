import { type erbscheinWegweiserPages } from "~/domains/erbschein/wegweiser/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type ErbscheinWegweiserUserData = UserDataFromPagesSchema<
  typeof erbscheinWegweiserPages
>;
