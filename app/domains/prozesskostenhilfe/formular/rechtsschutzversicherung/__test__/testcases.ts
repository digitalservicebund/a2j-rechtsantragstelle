import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/prozesskostenhilfe/formular/__test__/testcases";
import type { ProzesskostenhilfeRechtsschutzversicherungContext } from "../context";
const prefix = "/rechtsschutzversicherung";

const cases = [
  [
    {
      hasRsv: "no",
    },
    ["/rsv-frage", "/org-frage"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "yes",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-ja"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "unknown",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-unbekannt"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "no",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-nein", "/org-frage"],
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "partly",
    },
    ["/rsv-frage", "/rsv-deckung", "/rsv-deckung-teilweise", "/org-frage"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "unknown",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-unbekannt"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "yes",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-ja"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-nein"],
  ],
  [
    {
      hasRsv: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "partly",
    },
    ["/rsv-frage", "/org-frage", "/org-deckung", "/org-deckung-teilweise"],
  ],
] satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>;

export const testCasesProzesskostenhilfeRsv = {
  machine,
  cases: cases.map(([data, steps]) => [
    data,
    steps.map((stepId) => prefix + stepId),
  ]) satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>,
};

export const testCasesProzesskostenhilfeForwardOnly = {
  machine,
  cases: [
    [
      {},
      [
        "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe/daten",
        "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft/daten",
        "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe/partner-daten",
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe/partner-daten",
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-einkunft/partner-daten",
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/andere-unterhaltszahlungen/person/daten",
        "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
        "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      ],
    ],
    [
      {},
      [
        "/finanzielle-angaben/eigentum-zusammenfassung/wertgegenstaende/daten",
        "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      ],
    ],
  ] satisfies TestCases<ProzesskostenhilfeRechtsschutzversicherungContext>,
};
