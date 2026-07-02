import { type nachlassErbausschlagungGerichtFindenPages } from "~/domains/nachlass/erbausschlagung/gericht-finden/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type NachlassErbausschlagungGerichtFindenUserData =
  UserDataFromPagesSchema<typeof nachlassErbausschlagungGerichtFindenPages>;
