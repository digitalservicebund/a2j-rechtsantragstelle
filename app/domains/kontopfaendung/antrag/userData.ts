import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { kontopfaendungPkontoAntragPages } from "./pages";

export type KontopfaendungPkontoAntragUserData = UserDataFromPagesSchema<
  typeof kontopfaendungPkontoAntragPages
>;
