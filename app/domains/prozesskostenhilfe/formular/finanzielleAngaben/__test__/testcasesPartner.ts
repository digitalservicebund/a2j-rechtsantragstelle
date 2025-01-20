import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";
const prefix = "/finanzielle-angaben/partner";

// Since these are generated from the same config as einkuenftige, not every transition is tested
const prefixEinkuenfte = "/finanzielle-angaben/partner/partner-einkuenfte";

export const testCasesPKHFormularFinanzielleAngabenPartner = [
  [
    { partnerschaft: "widowed" },
    [prefix + "/partnerschaft", "/finanzielle-angaben/kinder/kinder-frage"],
  ],
  [
    { partnerschaft: "no" },
    [prefix + "/partnerschaft", "/finanzielle-angaben/kinder/kinder-frage"],
  ],
  [
    { partnerschaft: "separated" },
    [prefix + "/partnerschaft", "/finanzielle-angaben/kinder/kinder-frage"],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "yes" },
    [
      prefix + "/partnerschaft",
      prefix + "/zusammenleben",
      prefix + "/partner-einkommen",
      prefix + "/partner-einkuenfte/partner-staatliche-leistungen",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "yes", partnerEinkommen: "yes" },
    [
      prefix + "/partnerschaft",
      prefix + "/zusammenleben",
      prefix + "/partner-einkommen",
      prefix + "/partner-einkuenfte/partner-staatliche-leistungen",
    ],
  ],
  [
    { partnerschaft: "yes", zusammenleben: "no" },
    [
      prefix + "/partnerschaft",
      prefix + "/zusammenleben",
      prefix + "/unterhalt",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "no",
      unterhalt: "yes",
      partnerUnterhaltsSumme: "123",
      partnerVorname: "Dagobert",
      partnerNachname: "Duck",
    },
    [
      prefix + "/unterhalt",
      prefix + "/unterhalts-summe",
      prefix + "/partner-name",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      zusammenleben: "no",
      unterhalt: "no",
    },
    [
      prefix + "/unterhalt",
      prefix + "/keine-rolle",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      "partner-staatlicheLeistungen": "keine",
      "partner-employmentType": "employed",
      "partner-arbeitsweg": "publicTransport",
      "partner-hasArbeitsausgaben": "yes",
    },
    [
      prefixEinkuenfte + "/partner-staatliche-leistungen",
      prefixEinkuenfte + "/partner-einkommen/partner-erwerbstaetig",
      prefixEinkuenfte + "/partner-einkommen/partner-art",
      prefixEinkuenfte + "/partner-einkommen/partner-netto-einkommen",
      prefixEinkuenfte + "/partner-abzuege/partner-arbeitsweg",
      prefixEinkuenfte + "/partner-abzuege/partner-opnv-kosten",
      prefixEinkuenfte + "/partner-abzuege/partner-arbeitsplatz-entfernung",
      prefixEinkuenfte +
        "/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
      prefixEinkuenfte +
        "/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
      prefixEinkuenfte +
        "/partner-abzuege/partner-arbeitsausgaben/partner-warnung",
    ],
  ],
  [
    { "partner-arbeitsweg": "bike" },
    [
      prefixEinkuenfte + "/partner-abzuege/partner-arbeitsweg",
      prefixEinkuenfte + "/partner-abzuege/partner-keine-rolle",
    ],
  ],
  [
    {
      "partner-receivesPension": "yes",
      "partner-receivesSupport": "yes",
      "partner-hasFurtherIncome": "yes",
    },
    [
      prefixEinkuenfte + "/partner-rente-frage",
      prefixEinkuenfte + "/partner-rente",
      prefixEinkuenfte + "/partner-unterhalt-frage",
      prefixEinkuenfte + "/partner-unterhalt",
      prefixEinkuenfte + "/partner-leistungen/partner-frage",
      prefixEinkuenfte + "/partner-weitere-einkuenfte/partner-frage",
      prefixEinkuenfte + "/partner-weitere-einkuenfte/partner-uebersicht",
      prefixEinkuenfte + "/partner-weitere-einkuenfte/partner-warnung",
    ],
  ],
  [
    { partnerHasBesondersAusgaben: "yes", partnerschaft: "yes" },
    [
      prefixEinkuenfte + "/partner-besonders-ausgaben",
      prefixEinkuenfte + "/add-partner-besonders-ausgaben",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    { "partner-staatlicheLeistungen": "buergergeld" },
    [
      prefixEinkuenfte + "/partner-staatliche-leistungen",
      prefixEinkuenfte + "/partner-buergergeld",
    ],
  ],
  [
    { "partner-staatlicheLeistungen": "arbeitslosengeld" },
    [
      prefixEinkuenfte + "/partner-staatliche-leistungen",
      prefixEinkuenfte + "/partner-arbeitslosengeld",
    ],
  ],
  [
    { partnerschaft: "yes", "partner-staatlicheLeistungen": "grundsicherung" },
    [
      prefixEinkuenfte + "/partner-staatliche-leistungen",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      partnerschaft: "yes",
      "partner-staatlicheLeistungen": "asylbewerberleistungen",
    },
    [
      prefixEinkuenfte + "/partner-staatliche-leistungen",
      "/finanzielle-angaben/kinder/kinder-frage",
    ],
  ],
  [
    {
      "partner-employmentType": "selfEmployed",
      "partner-selbststaendigMonatlichesEinkommen": "1000",
      "partner-selbststaendigBruttoNetto": "brutto",
      "partner-selbststaendigAbzuege": "100",
    },
    [
      prefixEinkuenfte + "/partner-einkommen/partner-art",
      prefixEinkuenfte + "/partner-einkommen/partner-selbststaendig",
      prefixEinkuenfte + "/partner-einkommen/partner-selbststaendig-abzuege",
      prefixEinkuenfte + "/partner-abzuege/partner-arbeitsweg",
    ],
  ],
  [
    {
      "partner-hasWohngeld": CheckboxValue.on,
      "partner-hasKrankengeld": CheckboxValue.on,
      "partner-hasElterngeld": CheckboxValue.on,
      "partner-hasKindergeld": CheckboxValue.on,
      "partner-wohngeldAmount": "500",
      "partner-krankengeldAmount": "500",
      "partner-elterngeldAmount": "500",
      "partner-kindergeldAmount": "500",
    },
    [
      prefixEinkuenfte + "/partner-leistungen/partner-frage",
      prefixEinkuenfte + "/partner-leistungen/partner-wohngeld",
      prefixEinkuenfte + "/partner-leistungen/partner-krankengeld",
      prefixEinkuenfte + "/partner-leistungen/partner-elterngeld",
      prefixEinkuenfte + "/partner-leistungen/partner-kindergeld",
      prefixEinkuenfte + "/partner-weitere-einkuenfte/partner-frage",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
