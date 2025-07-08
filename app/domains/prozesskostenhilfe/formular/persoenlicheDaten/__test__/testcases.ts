import type { TestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "../../userData";

export const testCasesProzesskostenhilfePersoenlicheDaten = [
  [
    {},
    [
      "/persoenliche-daten/start",
      "/persoenliche-daten/name",
      "/persoenliche-daten/geburtsdatum",
      "/persoenliche-daten/plz",
      "/persoenliche-daten/adresse",
      "/persoenliche-daten/telefonnummer",
      "/persoenliche-daten/beruf",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFormularUserData>;
