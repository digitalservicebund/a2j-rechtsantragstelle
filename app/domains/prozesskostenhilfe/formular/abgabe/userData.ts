import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularAbgabePages } from "~/domains/prozesskostenhilfe/formular/abgabe/pages";
import type { PageData } from "~/services/flow/pageDataSchema";

export type ProzesskostenhilfeAbgabeUserData = UserDataFromPagesSchema<
  typeof pkhFormularAbgabePages
> & { pageData?: PageData };
