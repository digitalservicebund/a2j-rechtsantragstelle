import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFormularUserData } from "../../userData";
import { finanzielleAngabenTestcaseData } from "./testcasesData";

export const testCasesPKHFormularFinanzielleAngabenPartner = {
  widowed: [
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        partnerschaft: "widowed",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
    },
  ],
  liveInPartnerWithIncome: [
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/zusammenleben",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partner-einkommen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
    },
  ],
  partnerLivesSeparately: [
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/zusammenleben",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        zusammenleben: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/unterhalt",
    },
  ],
  separatePartnerWithUnterhalt: [
    {
      stepId: "/finanzielle-angaben/partner/unterhalt",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        zusammenleben: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/unterhalts-summe",
      userInput: {
        partnerUnterhaltsSumme: "123",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partner-name",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        zusammenleben: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
    },
  ],
  partnerPlaysNoRole: [
    {
      stepId: "/finanzielle-angaben/partner/unterhalt",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        zusammenleben: "no",
        unterhalt: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/keine-rolle",
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
    },
  ],
  partnerArbeitsausgabenUnentered: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-art",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-netto-einkommen",
      userInput: {
        "partner-nettoEinkuenfteAlsArbeitnehmer": "1000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-arbeitsweg": "publicTransport",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-opnv-kosten",
      userInput: {
        "partner-monatlicheOPNVKosten": "70",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsplatz-entfernung",
      userInput: {
        "partner-arbeitsplatzEntfernung": 7,
        "partner-arbeitsplatz": {
          strasseHausnummer: "Prinzessinnenstraße 8-14",
          plz: "10969",
          ort: "Berlin",
          land: "Deutschland",
        },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
      userInput: {
        "partner-hasArbeitsausgaben": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/uebersicht",
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-warnung",
    },
  ],
  addPartnerArbeitsausgabe: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-nettoEinkuenfteAlsArbeitnehmer": "2000",
        "partner-hasArbeitsausgaben": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/uebersicht",
      addArrayItemEvent: "add-partner-arbeitsausgaben",
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgabe/0/partner-daten",
      userInput: {
        "partner-arbeitsausgaben#beschreibung": "Arbeitsausgabe Beschreibung",
        "partner-arbeitsausgaben#zahlungsfrequenz": "monthly",
        "partner-arbeitsausgaben#betrag": "100",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/uebersicht",
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
    },
  ],
  partnerArbeitswegPlaysNoRole: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-arbeitsweg": "bike",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-keine-rolle",
    },
  ],
  partnerWithAdditionalFoerderung: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-nettoEinkuenfteAlsArbeitnehmer": "2000",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente",
      userInput: {
        "partner-pensionAmount": "1000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-unterhalt",
      userInput: {
        "partner-supportAmount": "100",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-frage",
      userInput: {
        partnerLeistungen: {
          wohngeld: "off",
          krankengeld: "off",
          elterngeld: "off",
          kindergeld: "off",
          none: "on",
        },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/uebersicht",
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-warnung",
    },
  ],
  addPartnerWeitereEinkuenfte: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-nettoEinkuenfteAlsArbeitnehmer": "2000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/uebersicht",
      addArrayItemEvent: "add-partner-weitereEinkuenfte",
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-einkunft/0/partner-daten",
      userInput: {
        "partner-weitereEinkuenfte#beschreibung": "Besondere Einkunft",
        "partner-weitereEinkuenfte#zahlungsfrequenz": "monthly",
        "partner-weitereEinkuenfte#betrag": "100",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/uebersicht",
    },
  ],
  partnerBesondersHoheAusgaben: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-besonders-ausgaben",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-nettoEinkuenfteAlsArbeitnehmer": "2000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/add-partner-besonders-ausgaben",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        partnerBesondersAusgabe: {
          beschreibung: "Besondere Ausgaben",
          betrag: "1000",
        },
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
    },
  ],
  partnerBuergergeld: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-staatlicheLeistungen": "buergergeld",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-buergergeld",
      userInput: {
        "partner-buergergeld": "1000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig",
      userInput: {
        "partner-currentlyEmployed": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-art",
      userInput: {
        "partner-employmentType": "employed",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-netto-einkommen",
      userInput: {
        "partner-nettoEinkuenfteAlsArbeitnehmer": "1000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
    },
  ],
  selfEmployedPartner: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-staatlicheLeistungen": "buergergeld",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-buergergeld",
      userInput: {
        "partner-buergergeld": "1000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-erwerbstaetig",
      userInput: {
        "partner-currentlyEmployed": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-art",
      userInput: {
        "partner-employmentType": "selfEmployed",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-selbststaendig",
      userInput: {
        "partner-selbststaendigMonatlichesEinkommen": "1000",
        "partner-selbststaendigBruttoNetto": "brutto",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-einkommen/partner-selbststaendig-abzuege",
      userInput: {
        "partner-selbststaendigAbzuege": "100",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-rente-frage",
    },
  ],
  partnerArbeitslosengeld: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-staatlicheLeistungen": "arbeitslosengeld",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-arbeitslosengeld",
      userInput: {
        "partner-arbeitslosengeld": "1000",
      },
    },
  ],
  partnerGrundsicherung: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-staatlicheLeistungen": "grundsicherung",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
    },
  ],
  partnerAsylbewerberleistungen: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-staatliche-leistungen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-staatlicheLeistungen": "asylbewerberleistungen",
      },
    },
    {
      stepId: "/finanzielle-angaben/kinder/kinder-frage",
    },
  ],
  partnerReceivesAllLeistungen: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        "partner-nettoEinkuenfteAlsArbeitnehmer": "2000",
        partnerLeistungen: {
          wohngeld: "on",
          krankengeld: "on",
          elterngeld: "on",
          kindergeld: "on",
          none: "off",
        },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-wohngeld",
      userInput: {
        "partner-wohngeldAmount": "500",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-krankengeld",
      userInput: {
        "partner-krankengeldAmount": "500",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-elterngeld",
      userInput: {
        "partner-elterngeldAmount": "500",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-leistungen/partner-kindergeld",
      userInput: {
        "partner-kindergeldAmount": "500",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-frage",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
