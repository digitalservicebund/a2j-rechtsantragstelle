import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";
const prefix = "/finanzielle-angaben/einkuenfte";

export const testCasesPKHFormularFinanzielleAngabenEinkuenfte = [
  [
    { staatlicheLeistungen: "keine" },
    [
      prefix + "/start",
      prefix + "/staatliche-leistungen",
      prefix + "/einkommen/erwerbstaetig",
    ],
  ],
  [
    { staatlicheLeistungen: "buergergeld" },
    [prefix + "/staatliche-leistungen", prefix + "/buergergeld"],
  ],
  [
    { staatlicheLeistungen: "arbeitslosengeld" },
    [prefix + "/staatliche-leistungen", prefix + "/arbeitslosengeld"],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    [prefix + "/staatliche-leistungen", "/gesetzliche-vertretung/frage"],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    [prefix + "/staatliche-leistungen", "/gesetzliche-vertretung/frage"],
  ],
  [
    { staatlicheLeistungen: "keine", currentlyEmployed: "yes" },
    [
      prefix + "/staatliche-leistungen",
      "/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
      "/finanzielle-angaben/einkuenfte/einkommen/art",
    ],
  ],
  [
    { employmentType: "employed", nettoEinkuenfteAlsArbeitnehmer: "1000" },
    [
      "/finanzielle-angaben/einkuenfte/einkommen/art",
      "/finanzielle-angaben/einkuenfte/einkommen/netto-einkommen",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
    ],
  ],
  [
    {
      employmentType: "selfEmployed",
      selbststaendigMonatlichesEinkommen: "1000",
      selbststaendigBruttoNetto: "brutto",
      selbststaendigAbzuege: "100",
    },
    [
      "/finanzielle-angaben/einkuenfte/einkommen/art",
      "/finanzielle-angaben/einkuenfte/einkommen/selbststaendig",
      "/finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
    ],
  ],
  [
    { arbeitsweg: "none" },
    [
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { arbeitsweg: "walking" },
    [
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
      "/finanzielle-angaben/einkuenfte/abzuege/keine-rolle",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { arbeitsweg: "publicTransport", monatlicheOPNVKosten: "100" },
    [
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
      "/finanzielle-angaben/einkuenfte/abzuege/opnv-kosten",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsplatz-entfernung",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { arbeitsweg: "privateVehicle" },
    [
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsweg",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsplatz-entfernung",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    ],
  ],
  [
    { hasArbeitsausgaben: "yes" },
    [
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht",
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/warnung",
    ],
  ],
  [
    { hasArbeitsausgaben: "no" },
    [
      "/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      "/finanzielle-angaben/einkuenfte/rente-frage",
    ],
  ],
  [
    { currentlyEmployed: "no", receivesPension: "no" },
    [
      "/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
      "/finanzielle-angaben/einkuenfte/rente-frage",
      "/finanzielle-angaben/einkuenfte/leistungen/frage",
    ],
  ],
  [
    { receivesPension: "yes", pensionAmount: "500" },
    [
      "/finanzielle-angaben/einkuenfte/rente-frage",
      "/finanzielle-angaben/einkuenfte/rente",
      "/finanzielle-angaben/einkuenfte/leistungen/frage",
    ],
  ],
  [
    {
      hasWohngeld: CheckboxValue.on,
      hasKrankengeld: CheckboxValue.on,
      hasElterngeld: CheckboxValue.on,
      hasKindergeld: CheckboxValue.on,
      wohngeldAmount: "500",
      krankengeldAmount: "500",
      elterngeldAmount: "500",
      kindergeldAmount: "500",
    },
    [
      "/finanzielle-angaben/einkuenfte/leistungen/frage",
      "/finanzielle-angaben/einkuenfte/leistungen/wohngeld",
      "/finanzielle-angaben/einkuenfte/leistungen/krankengeld",
      "/finanzielle-angaben/einkuenfte/leistungen/elterngeld",
      "/finanzielle-angaben/einkuenfte/leistungen/kindergeld",
      "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
    ],
  ],
  [
    {
      hasWohngeld: CheckboxValue.off,
      hasKrankengeld: CheckboxValue.off,
      hasElterngeld: CheckboxValue.off,
      hasKindergeld: CheckboxValue.off,
    },
    [
      "/finanzielle-angaben/einkuenfte/leistungen/frage",
      "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
    ],
  ],
  [
    { hasFurtherIncome: "yes" },
    [
      "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
      "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
      "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/warnung",
    ],
  ],
  [
    { hasFurtherIncome: "no" },
    [
      "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
      "/finanzielle-angaben/partner/partnerschaft",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
