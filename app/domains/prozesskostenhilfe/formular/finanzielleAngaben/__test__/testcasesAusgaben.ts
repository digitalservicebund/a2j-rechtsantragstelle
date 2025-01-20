import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";

export const testCasesPKHFormularFinanzielleAngabenAusgaben = [
  [
    { hasAusgaben: "no" },
    [
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
      "/gesetzliche-vertretung/frage",
    ],
  ],
  [
    { hasAusgaben: "yes" },
    [
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
      "/finanzielle-angaben/ausgaben/besondere-belastungen",
      "/finanzielle-angaben/ausgaben-zusammenfassung/zusammenfassung",
      "/gesetzliche-vertretung/frage",
    ],
  ],
  [
    {
      versicherungen: [{ art: "sonstige", beitrag: "10" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben-zusammenfassung/versicherungen/daten",
      "/finanzielle-angaben/ausgaben-zusammenfassung/versicherungen/sonstige-art",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
