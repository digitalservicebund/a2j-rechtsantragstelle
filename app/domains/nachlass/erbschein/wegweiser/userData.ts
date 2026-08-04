import { type nachlassErbscheinWegweiserPages } from "~/domains/nachlass/erbschein/wegweiser/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type NachlassErbscheinWegweiserUserData = UserDataFromPagesSchema<
  typeof nachlassErbscheinWegweiserPages
>;
