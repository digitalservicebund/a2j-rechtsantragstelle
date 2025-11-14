import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";
const prefix = "/finanzielle-angaben/wohnung";
export const testCasesPKHFormularFinanzielleAngabenWohnung = {
  all: [
    {
      stepId: prefix + "/alleine-zusammen",
      userInput: {
        livingSituation: "withOthers",
      },
    },
    {
      stepId: prefix + "/anzahl-mitbewohner",
      userInput: {
        apartmentPersonCount: 3,
      },
    },
    {
      stepId: prefix + "/groesse",
      userInput: {
        apartmentSizeSqm: 33,
      },
    },
    {
      stepId: prefix + "/anzahl-zimmer",
      userInput: {
        numberOfRooms: 3,
      },
    },
    {
      stepId: prefix + "/miete-eigenheim",
      userInput: {
        rentsApartment: "yes",
      },
    },
    {
      stepId: prefix + "/miete-zusammen",
      userInput: {
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: prefix + "/garage-parkplatz",
      userInput: {
        garageParkplatz: "no",
      },
    },
    {
      stepId: prefix + "/nebenkosten",
      userInput: {
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
  ],
  alone: [
    {
      stepId: prefix + "/alleine-zusammen",
      userInput: {
        livingSituation: "alone",
      },
    },
    {
      stepId: prefix + "/groesse",
    },
  ],
  rentsApartmentAlone: [
    {
      stepId: prefix + "/miete-eigenheim",
      userInput: {
        livingSituation: "alone",
        rentsApartment: "yes",
      },
    },
    {
      stepId: prefix + "/miete-alleine",
      userInput: {
        totalRent: "1000",
        rentWithoutUtilities: "1000",
      },
    },
    {
      stepId: prefix + "/garage-parkplatz",
      userInput: {
        garageParkplatz: "no",
      },
    },
    {
      stepId: prefix + "/nebenkosten",
      userInput: {
        heatingCosts: "500",
        utilitiesCost: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
  ],
  rentsApartmentWithOthers: [
    {
      stepId: prefix + "/miete-eigenheim",
      userInput: {
        livingSituation: "withOthers",
        rentsApartment: "yes",
      },
    },
    {
      stepId: prefix + "/miete-zusammen",
      userInput: {
        totalRent: "1000",
        sharedRent: "1000",
      },
    },
    {
      stepId: prefix + "/garage-parkplatz",
      userInput: {
        garageParkplatz: "no",
      },
    },
    {
      stepId: prefix + "/nebenkosten",
      userInput: {
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
      stepId: prefix + "/miete-eigenheim",
      userInput: {
        livingSituation: "alone",
        rentsApartment: "no",
      },
    },
    {
      stepId: prefix + "/eigenheim-nebenkosten",
      userInput: {
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
      stepId: prefix + "/miete-eigenheim",
      userInput: {
        livingSituation: "withOthers",
        rentsApartment: "no",
      },
    },
    {
      stepId: prefix + "/eigenheim-nebenkosten-geteilt",
      userInput: {
        utilitiesCostOwnShared: "123",
        utilitiesCostOwned: "243",
        heatingCostsOwned: "234",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFinanzielleAngabenUserData>;
