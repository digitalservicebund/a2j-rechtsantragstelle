import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeGrundvoraussetzungenUserData } from "~/domains/beratungshilfe/formular/grundvoraussetzung/userData";

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

export const testCasesBeratungshilfeFormularGrundvoraussetzungen = [
  [
    {},
    [
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
      rechtsschutzversicherung,
      wurdeVerklagt,
      klageEingereicht,
      hamburgBremen,
      beratungshilfeBeantragt,
      eigeninitiative,
      "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung-hinweis",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeGrundvoraussetzungenUserData>;
