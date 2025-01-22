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
  [
    {
      ratenzahlungen: [{ zahlungspflichtiger: "myself", betragGesamt: "10" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/daten",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/betragGesamt",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/restschuld",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/laufzeitende",
    ],
  ],
  [
    {
      ratenzahlungen: [
        { zahlungspflichtiger: "myselfAndPartner", betragGesamt: "10" },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/daten",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/betragGemeinsamerAnteil",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/betragEigenerAnteil",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/restschuld",
      "/finanzielle-angaben/ausgaben-zusammenfassung/ratenzahlungen/laufzeitende",
    ],
  ],
  [
    {
      sonstigeAusgaben: [{ zahlungspflichtiger: "myself", betragGesamt: "10" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben/daten",
      "/finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben/betragGesamt",
    ],
  ],
  [
    {
      sonstigeAusgaben: [
        { zahlungspflichtiger: "myselfAndPartner", betragGesamt: "10" },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben/daten",
      "/finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben/betragGemeinsamerAnteil",
      "/finanzielle-angaben/ausgaben-zusammenfassung/sonstigeAusgaben/betragEigenerAnteil",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
