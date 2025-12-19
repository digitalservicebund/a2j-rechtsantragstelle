import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";
import type { kontopfaendungPkontoAntragPages } from "./pages";

export type KontopfaendungPkontoAntragUserData = UserDataFromPagesSchema<
  typeof kontopfaendungPkontoAntragPages
>;
