import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type PartnerEinkuenfteUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/userData";

export const testCasesPKHFormularFinanzielleAngabenPartner = {
  widowed: [
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
      userInput: {
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
        partnerschaft: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/zusammenleben",
      userInput: {
        zusammenleben: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partner-einkommen",
      userInput: {
        partnerEinkommen: "yes",
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
        partnerschaft: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/zusammenleben",
      userInput: {
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
        unterhalt: "yes",
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
        partnerVorname: "Maria",
        partnerNachname: "Mustermann",
        partnerschaft: "yes",
        zusammenleben: "no",
        unterhalt: "yes",
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
        partnerschaft: "yes",
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
        "partner-staatlicheLeistungen": "keine",
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
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
      userInput: {
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
        "partner-arbeitsplatz": {
          strasseHausnummer: "Prinzessinnenstraße 8-14",
          plz: "10969",
          ort: "Berlin",
          land: "Deutschland",
        },
        "partner-arbeitsplatzEntfernung": 7,
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
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-warnung",
    },
  ],
  addPartnerArbeitsausgabe: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-arbeitsausgaben-frage",
      userInput: {
        "partner-hasArbeitsausgaben": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
      addArrayItemEvent: "add-partner-arbeitsausgaben",
      userInput: {
        pageData: {
          arrayIndexes: [0],
        },
        "partner-arbeitsausgaben": [],
      },
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
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsausgaben/partner-uebersicht",
    },
  ],
  partnerArbeitswegPlaysNoRole: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-abzuege/partner-arbeitsweg",
      userInput: {
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
        "partner-receivesPension": "yes",
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
        "partner-receivesSupport": "yes",
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
        "partner-hasFurtherIncome": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht",
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
        "partner-hasFurtherIncome": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht",
      addArrayItemEvent: "add-partner-weitereEinkuenfte",
      userInput: {
        pageData: {
          arrayIndexes: [0],
        },
        "partner-weitereEinkuenfte": [],
      },
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
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-weitere-einkuenfte/partner-uebersicht",
    },
  ],
  partnerBesondersHoheAusgaben: [
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/partner-besonders-ausgaben",
      userInput: {
        partnerHasBesondersAusgaben: "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/partner/partner-einkuenfte/add-partner-besonders-ausgaben",
      userInput: {
        partnerBesondersAusgabe: {
          beschreibung: "Besondere Ausgaben",
          betrag: "1000",
        },
        partnerschaft: "yes",
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
        "partner-staatlicheLeistungen": "grundsicherung",
        partnerschaft: "yes",
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
        "partner-staatlicheLeistungen": "asylbewerberleistungen",
        partnerschaft: "yes",
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
} satisfies FlowTestCases<PartnerEinkuenfteUserData>;
