import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";

export const testCasesPKHFormularFinanzielleAngabenAbzuege = [
  [
    { arbeitsweg: "none" },
    [
      "/finanzielle-angaben/abzuege/arbeitsweg",
      "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { arbeitsweg: "walking" },
    [
      "/finanzielle-angaben/abzuege/arbeitsweg",
      "/finanzielle-angaben/abzuege/keine-rolle",
      "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { arbeitsweg: "publicTransport", monatlicheOPNVKosten: "100" },
    [
      "/finanzielle-angaben/abzuege/arbeitsweg",
      "/finanzielle-angaben/abzuege/opnv-kosten",
      "/finanzielle-angaben/abzuege/arbeitsplatz-entfernung",
      "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { arbeitsweg: "privateVehicle" },
    [
      "/finanzielle-angaben/abzuege/arbeitsweg",
      "/finanzielle-angaben/abzuege/arbeitsplatz-entfernung",
      "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { hasArbeitsausgaben: "yes" },
    [
      "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      "/finanzielle-angaben/abzuege/arbeitsausgaben/uebersicht",
      "/finanzielle-angaben/abzuege/arbeitsausgaben/warnung",
    ],
  ],
  [
    { hasArbeitsausgaben: "no" },
    [
      "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      "/finanzielle-angaben/partner/partnerschaft",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenUserData>;
