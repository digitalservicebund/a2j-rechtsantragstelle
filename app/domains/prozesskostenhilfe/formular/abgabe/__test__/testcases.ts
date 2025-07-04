import { type TestCases } from "~/domains/__test__/TestCases";
import { happyPathData } from "~/domains/prozesskostenhilfe/formular/__test__/prozesskostenhilfeFormularData";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

export const testCasesProzesskostenhilfeDocumentUploadTransitions = [
  [
    {
      ...happyPathData,
      formularArt: "nachueberpruefung",
      versandArt: "digital",
    },
    ["/weitere-angaben", "abgabe/zusammenfassung", "/abgabe/dokumente"],
  ],
] satisfies TestCases<ProzesskostenhilfeFormularUserData>;
