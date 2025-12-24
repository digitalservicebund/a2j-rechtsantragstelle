import type { UserDataFromPagesSchema } from "~/domains/types";
import type { kontopfaendungPkontoAntragPages } from "./pages";

export type KontopfaendungPkontoAntragUserData = UserDataFromPagesSchema<
  typeof kontopfaendungPkontoAntragPages
>;
