import type { FlowTestCases } from "~/domains/__test__/TestCases";

export const testCasesPKHFormularFinanzielleAngabenEinkuenfte = {
  staatlicheLeistungenKeine: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/start",
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "keine",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
      userInput: {
        currentlyEmployed: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/art",
    },
  ],
  buergergeldEmployed: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "buergergeld",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/buergergeld",
      userInput: {
        buergergeld: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
      userInput: {
        currentlyEmployed: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/art",
      userInput: {
        employmentType: "employed",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/netto-einkommen",
      userInput: {
        nettoEinkuenfteAlsArbeitnehmer: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/rente-frage",
    },
  ],
  buergergeldSelfEmployed: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "buergergeld",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/buergergeld",
      userInput: {
        buergergeld: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
      userInput: {
        currentlyEmployed: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/art",
      userInput: {
        employmentType: "selfEmployed",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/selbststaendig",
      userInput: {
        selbststaendigMonatlichesEinkommen: "1000",
        selbststaendigBruttoNetto: "brutto",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/einkuenfte/einkommen/selbststaendig-abzuege",
      userInput: {
        selbststaendigAbzuege: "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/rente-frage",
    },
  ],
  staatlicheLeistungenArbeitslosengeld: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "arbeitslosengeld",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/arbeitslosengeld",
    },
  ],
  staatlicheLeistungenGrundsicherung: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "grundsicherung",
      },
    },
    {
      stepId: "/gesetzliche-vertretung/frage",
    },
  ],
  staatlicheLeistungenAsylbewerberleistungen: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/staatliche-leistungen",
      userInput: {
        staatlicheLeistungen: "asylbewerberleistungen",
      },
    },
    {
      stepId: "/gesetzliche-vertretung/frage",
    },
  ],
  notEmployedNoPension: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/einkommen/erwerbstaetig",
      userInput: {
        currentlyEmployed: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/rente-frage",
      userInput: {
        receivesPension: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/frage",
    },
  ],
  receivesPension: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/rente-frage",
      userInput: {
        receivesPension: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/rente",
      userInput: {
        pensionAmount: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/frage",
    },
  ],
  receivesAllLeistungen: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/frage",
      userInput: {
        leistungen: {
          wohngeld: "on",
          krankengeld: "on",
          elterngeld: "on",
          kindergeld: "on",
          none: "off",
        },
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/wohngeld",
      userInput: {
        wohngeldAmount: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/krankengeld",
      userInput: {
        krankengeldAmount: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/elterngeld",
      userInput: {
        elterngeldAmount: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/kindergeld",
      userInput: {
        kindergeldAmount: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
    },
  ],
  receivesNoLeistungen: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/leistungen/frage",
      userInput: {
        leistungen: {
          wohngeld: "off",
          krankengeld: "off",
          elterngeld: "off",
          kindergeld: "off",
          none: "on",
        },
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
    },
  ],
  hasUntenteredFurtherIncome: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
      userInput: {
        hasFurtherIncome: "yes",
      },
    },
    { stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht" },
    { stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/warnung" },
  ],
  addFurtherIncome: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
      userInput: {
        hasFurtherIncome: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
      addArrayItemEvent: "add-weitereEinkuenfte",
      userInput: {
        pageData: {
          arrayIndexes: [0],
        },
        weitereEinkuenfte: [],
      },
    },
    {
      stepId:
        "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft/0/daten",
      userInput: {
        "weitereEinkuenfte#beschreibung": "Besondere Einkunft",
        "weitereEinkuenfte#zahlungsfrequenz": "monthly",
        "weitereEinkuenfte#betrag": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
    },
  ],
  notEmployedNoFurtherIncome: [
    {
      stepId: "/finanzielle-angaben/einkuenfte/weitere-einkuenfte/frage",
      skipPageSchemaValidation: true,
      userInput: {
        currentlyEmployed: "no",
        hasFurtherIncome: "no",
      },
    },
    { stepId: "/finanzielle-angaben/partner/partnerschaft" },
  ],
} satisfies FlowTestCases["testcases"];
