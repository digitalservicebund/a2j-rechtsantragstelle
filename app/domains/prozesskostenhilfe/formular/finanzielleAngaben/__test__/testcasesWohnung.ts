import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/prozesskostenhilfe/formular/__test__/testcases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";
const prefix = "/finanzielle-angaben/wohnung";
const cases = [
  [
    {},
    [
      prefix + "/alleine-zusammen",
      prefix + "/anzahl-mitbewohner",
      prefix + "/groesse",
      prefix + "/anzahl-zimmer",
      prefix + "/miete-eigenheim",
      prefix + "/miete-zusammen",
      prefix + "/nebenkosten",
    ],
  ],
  [
    { livingSituation: "alone" },
    [prefix + "/alleine-zusammen", prefix + "/groesse"],
  ],
  [
    { rentsApartment: "yes", livingSituation: "alone" },
    [
      prefix + "/miete-eigenheim",
      prefix + "/miete-alleine",
      prefix + "/nebenkosten",
      "/finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    { rentsApartment: "yes", livingSituation: "withOthers" },
    [
      prefix + "/miete-eigenheim",
      prefix + "/miete-zusammen",
      prefix + "/nebenkosten",
      "/finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    { rentsApartment: "no", livingSituation: "alone" },
    [
      prefix + "/miete-eigenheim",
      prefix + "/eigenheim-nebenkosten",
      "/finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
  [
    { rentsApartment: "no", livingSituation: "withOthers" },
    [
      prefix + "/miete-eigenheim",
      prefix + "/eigenheim-nebenkosten-geteilt",
      "/finanzielle-angaben/eigentum/eigentum-info",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;

export const testCasesPKHFormularFinanzielleAngabenWohnung = {
  machine,
  cases,
};
