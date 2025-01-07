import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeGrundvoraussetzungen } from "~/domains/beratungshilfe/formular/grundvoraussetzung/context";

const start = "/grundvoraussetzungen/start";
const rechtsschutzversicherung =
  "/grundvoraussetzungen/rechtsschutzversicherung";
const wurdeVerklagt = "/grundvoraussetzungen/wurde-verklagt";
const klageEingereicht = "/grundvoraussetzungen/klage-eingereicht";
const hamburgBremen = "/grundvoraussetzungen/hamburg-oder-bremen";
const beratungshilfeBeantragt =
  "/grundvoraussetzungen/beratungshilfe-beantragt";
const eigeninitiative =
  "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung";
const anwaltStart = "/anwaltliche-vertretung/start";
const cases = [
  [
    {},
    [
      start,
      rechtsschutzversicherung,
      "/grundvoraussetzungen/rechtsschutzversicherung-hinweis",
    ],
  ],
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      hamburgOderBremen: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
    },
    [
      start,
      rechtsschutzversicherung,
      wurdeVerklagt,
      klageEingereicht,
      hamburgBremen,
      beratungshilfeBeantragt,
      eigeninitiative,
      anwaltStart,
    ],
  ],
  [
    {
      rechtsschutzversicherung: "yes",
    },
    [
      start,
      rechtsschutzversicherung,
      "/grundvoraussetzungen/rechtsschutzversicherung-hinweis",
    ],
  ],
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "yes",
    },
    [
      start,
      rechtsschutzversicherung,
      wurdeVerklagt,
      "/grundvoraussetzungen/wurde-verklagt-hinweis",
    ],
  ],
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "yes",
    },
    [
      start,
      rechtsschutzversicherung,
      wurdeVerklagt,
      klageEingereicht,
      "/grundvoraussetzungen/klage-eingereicht-hinweis",
    ],
  ],
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      hamburgOderBremen: "yes",
    },
    [
      start,
      rechtsschutzversicherung,
      wurdeVerklagt,
      klageEingereicht,
      hamburgBremen,
      "/grundvoraussetzungen/hamburg-oder-bremen-hinweis",
    ],
  ],
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      hamburgOderBremen: "no",
      beratungshilfeBeantragt: "yes",
      eigeninitiativeGrundvorraussetzung: "no",
    },
    [
      start,
      rechtsschutzversicherung,
      wurdeVerklagt,
      klageEingereicht,
      hamburgBremen,
      beratungshilfeBeantragt,
      "/grundvoraussetzungen/beratungshilfe-beantragt-hinweis",
    ],
  ],
  [
    {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      hamburgOderBremen: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "yes",
    },
    [
      start,
      rechtsschutzversicherung,
      wurdeVerklagt,
      klageEingereicht,
      hamburgBremen,
      beratungshilfeBeantragt,
      eigeninitiative,
      "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung-hinweis",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeGrundvoraussetzungen>;

export const testCasesBeratungshilfeFormularGrundvoraussetzungen = {
  machine,
  cases,
};
