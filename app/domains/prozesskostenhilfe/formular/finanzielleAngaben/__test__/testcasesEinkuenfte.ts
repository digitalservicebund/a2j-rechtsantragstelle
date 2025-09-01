import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";
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
    {
      staatlicheLeistungen: "buergergeld",
      buergergeld: "1000",
      currentlyEmployed: "yes",
      employmentType: "employed",
      nettoEinkuenfteAlsArbeitnehmer: "1000",
    },
    [
      prefix + "/staatliche-leistungen",
      prefix + "/buergergeld",
      prefix + "/einkommen/erwerbstaetig",
      prefix + "/einkommen/art",
      prefix + "/einkommen/netto-einkommen",
      prefix + "/rente-frage",
    ],
  ],
  [
    {
      staatlicheLeistungen: "buergergeld",
      buergergeld: "1000",
      currentlyEmployed: "yes",
      employmentType: "selfEmployed",
      selbststaendigMonatlichesEinkommen: "1000",
      selbststaendigBruttoNetto: "brutto",
      selbststaendigAbzuege: "100",
    },
    [
      prefix + "/staatliche-leistungen",
      prefix + "/buergergeld",
      prefix + "/einkommen/erwerbstaetig",
      prefix + "/einkommen/art",
      prefix + "/einkommen/selbststaendig",
      prefix + "/einkommen/selbststaendig-abzuege",
      prefix + "/rente-frage",
    ],
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
      "/finanzielle-angaben/abzuege/arbeitsweg",
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
      "/finanzielle-angaben/abzuege/arbeitsweg",
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
      leistungen: {
        wohngeld: "on",
        krankengeld: "on",
        elterngeld: "on",
        kindergeld: "on",
      },
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
      leistungen: {
        wohngeld: "off",
        krankengeld: "off",
        elterngeld: "off",
        kindergeld: "off",
      },
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
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenUserData>;
