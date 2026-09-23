import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "../../userData";
import { finanzielleAngabenTestcaseData } from "../../__test__/testcasesData";

export const testCasesPKHFormularFinanzielleAngabenWohnung = {
  all: [
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        livingSituation: "withOthers",
        hasWeitereUnterhaltszahlungen: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/anzahl-mitbewohner",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        apartmentPersonCount: 3,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/groesse",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        apartmentSizeSqm: 33,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/anzahl-zimmer",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        numberOfRooms: 3,
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-zusammen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
  ],
  alone: [
    {
      stepId: "/finanzielle-angaben/wohnung/alleine-zusammen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        livingSituation: "alone",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/groesse",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        apartmentSizeSqm: 33,
      },
    },
  ],
  rentsApartmentAlone: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        livingSituation: "alone",
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-alleine",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        totalRent: "1000",
        rentWithoutUtilities: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
      userInput: {
        ...finanzielleAngabenTestcaseData,
      },
    },
  ],
  rentsApartmentWithOthers: [
    {
      stepId: "/finanzielle-angaben/wohnung/miete-eigenheim",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        livingSituation: "withOthers",
        rentsApartment: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/miete-zusammen",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/garage-parkplatz",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        garageParkplatz: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        ...finanzielleAngabenTestcaseData,
        livingSituation: "alone",
        rentsApartment: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/eigenheim-nebenkosten",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        ...finanzielleAngabenTestcaseData,
        livingSituation: "withOthers",
        rentsApartment: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/wohnung/eigenheim-nebenkosten-geteilt",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
