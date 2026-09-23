import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "../../userData";
import { PKHTestcaseData } from "../../__test__/testcasesData";

export const testCasesPKHFormularFinanzielleAngabenWohnung = {
  all: [
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
      userInput: {
        ...PKHTestcaseData,
        livingSituation: "withOthers",
        hasWeitereUnterhaltszahlungen: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/anzahl-mitbewohner",
      userInput: {
        ...PKHTestcaseData,
        apartmentPersonCount: 3,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/groesse",
      userInput: {
        ...PKHTestcaseData,
        apartmentSizeSqm: 33,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/anzahl-zimmer",
      userInput: {
        ...PKHTestcaseData,
        numberOfRooms: 3,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...PKHTestcaseData,
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-zusammen",
      userInput: {
        ...PKHTestcaseData,
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...PKHTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...PKHTestcaseData,
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
  ],
  alone: [
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
      userInput: {
        ...PKHTestcaseData,
        livingSituation: "alone",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/groesse",
      userInput: {
        ...PKHTestcaseData,
        apartmentSizeSqm: 33,
      },
    },
  ],
  rentsApartmentAlone: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...PKHTestcaseData,
        livingSituation: "alone",
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-alleine",
      userInput: {
        ...PKHTestcaseData,
        totalRent: "1000",
        rentWithoutUtilities: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...PKHTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...PKHTestcaseData,
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
      userInput: {
        ...PKHTestcaseData,
      },
    },
  ],
  rentsApartmentWithOthers: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...PKHTestcaseData,
        livingSituation: "withOthers",
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-zusammen",
      userInput: {
        ...PKHTestcaseData,
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...PKHTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...PKHTestcaseData,
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
  ],
  ownsApartmentAlone: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...PKHTestcaseData,
        livingSituation: "alone",
        rentsApartment: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/eigenheim-nebenkosten",
      userInput: {
        ...PKHTestcaseData,
        utilitiesCostOwned: "123",
        heatingCostsOwned: "234",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
  ],
  ownsApartmentWithOthers: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...PKHTestcaseData,
        livingSituation: "withOthers",
        rentsApartment: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/eigenheim-nebenkosten-geteilt",
      userInput: {
        ...PKHTestcaseData,
        utilitiesCostOwnShared: "123",
        utilitiesCostOwned: "243",
        heatingCostsOwned: "234",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
