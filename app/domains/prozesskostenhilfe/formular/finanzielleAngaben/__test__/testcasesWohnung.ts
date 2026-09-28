import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "../../userData";
import { pkhTestcaseData } from "../../__test__/testcasesData";

export const testCasesPKHFormularFinanzielleAngabenWohnung = {
  all: [
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
      userInput: {
        ...pkhTestcaseData,
        livingSituation: "withOthers",
        hasWeitereUnterhaltszahlungen: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/anzahl-mitbewohner",
      userInput: {
        ...pkhTestcaseData,
        apartmentPersonCount: 3,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/groesse",
      userInput: {
        ...pkhTestcaseData,
        apartmentSizeSqm: 33,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/anzahl-zimmer",
      userInput: {
        ...pkhTestcaseData,
        numberOfRooms: 3,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...pkhTestcaseData,
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-zusammen",
      userInput: {
        ...pkhTestcaseData,
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...pkhTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...pkhTestcaseData,
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
  ],
  alone: [
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
      userInput: {
        ...pkhTestcaseData,
        livingSituation: "alone",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/groesse",
      userInput: {
        ...pkhTestcaseData,
        apartmentSizeSqm: 33,
      },
    },
  ],
  rentsApartmentAlone: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...pkhTestcaseData,
        livingSituation: "alone",
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-alleine",
      userInput: {
        ...pkhTestcaseData,
        totalRent: "1000",
        rentWithoutUtilities: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...pkhTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...pkhTestcaseData,
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
      userInput: {
        ...pkhTestcaseData,
      },
    },
  ],
  rentsApartmentWithOthers: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...pkhTestcaseData,
        livingSituation: "withOthers",
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-zusammen",
      userInput: {
        ...pkhTestcaseData,
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...pkhTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...pkhTestcaseData,
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
        ...pkhTestcaseData,
        livingSituation: "alone",
        rentsApartment: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/eigenheim-nebenkosten",
      userInput: {
        ...pkhTestcaseData,
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
        ...pkhTestcaseData,
        livingSituation: "withOthers",
        rentsApartment: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/eigenheim-nebenkosten-geteilt",
      userInput: {
        ...pkhTestcaseData,
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
