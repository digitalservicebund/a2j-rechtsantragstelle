import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";

export const testCasesPKHFormularFinanzielleAngabenAusgaben = [
  [
    { hasAusgaben: "no" },
    [
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
      "/finanzielle-angaben/ausgaben/besondere-belastungen",
    ],
  ],
  [
    { hasAusgaben: "yes" },
    [
      "/finanzielle-angaben/ausgaben/ausgaben-frage",
      "/finanzielle-angaben/ausgaben/zusammenfassung",
      "/finanzielle-angaben/ausgaben/besondere-belastungen",
      "/gesetzliche-vertretung/frage",
    ],
  ],
  [
    {
      versicherungen: [
        { art: "sonstige", sonstigeArt: "sonstige", beitrag: "10" },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben/versicherungen/daten",
      "/finanzielle-angaben/ausgaben/versicherungen/sonstige-art",
    ],
  ],
  [
    {
      ratenzahlungen: [
        {
          zahlungspflichtiger: "myself",
          betragGesamt: "10",
          art: "asd",
          laufzeitende: "01.01.2026",
          restschuld: "10",
          zahlungsempfaenger: "asd",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben/ratenzahlungen/daten",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/betragGesamt",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/restschuld",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/laufzeitende",
    ],
  ],
  [
    {
      ratenzahlungen: [
        {
          zahlungspflichtiger: "myselfAndPartner",
          betragGesamt: "10",
          art: "asd",
          laufzeitende: "01.01.2026",
          restschuld: "10",
          zahlungsempfaenger: "asd",
          betragEigenerAnteil: "10",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben/ratenzahlungen/daten",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/betragGemeinsamerAnteil",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/betragEigenerAnteil",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/restschuld",
      "/finanzielle-angaben/ausgaben/ratenzahlungen/laufzeitende",
    ],
  ],
  [
    {
      sonstigeAusgaben: [{ zahlungspflichtiger: "myself", betragGesamt: "10" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/daten",
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/betragGesamt",
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
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/daten",
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/zahlungspflichtiger",
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/betragGemeinsamerAnteil",
      "/finanzielle-angaben/ausgaben/sonstigeAusgaben/betragEigenerAnteil",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenUserData>;
