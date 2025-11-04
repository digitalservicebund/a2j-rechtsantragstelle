import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeGrundvoraussetzungenUserData } from "~/domains/beratungshilfe/formular/grundvoraussetzung/userData";

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

export const testCasesBeratungshilfeFormularGrundvoraussetzungen = {
  noRSV: [
    {
      stepId: rechtsschutzversicherung,
      userInput: {
        rechtsschutzversicherung: "no",
      },
    },
    {
      stepId: wurdeVerklagt,
    },
  ],
  hasRSV: [
    {
      stepId: rechtsschutzversicherung,
      userInput: {
        rechtsschutzversicherung: "yes",
      },
    },
    {
      stepId: "/grundvoraussetzungen/rechtsschutzversicherung-hinweis",
    },
  ],
  wurdeVerklagt: [
    {
      stepId: wurdeVerklagt,
      userInput: {
        wurdeVerklagt: "yes",
      },
    },
    {
      stepId: "/grundvoraussetzungen/wurde-verklagt-hinweis",
    },
  ],
  klageEingereicht: [
    {
      stepId: klageEingereicht,
      userInput: {
        klageEingereicht: "yes",
      },
    },
    {
      stepId: "/grundvoraussetzungen/klage-eingereicht-hinweis",
    },
  ],
  grundvoraussetzungenHappyPath: [
    {
      stepId: rechtsschutzversicherung,
      userInput: {
        rechtsschutzversicherung: "no",
      },
    },
    {
      stepId: wurdeVerklagt,
      userInput: {
        wurdeVerklagt: "no",
      },
    },
    {
      stepId: klageEingereicht,
      userInput: {
        klageEingereicht: "no",
      },
    },
    {
      stepId: hamburgBremen,
      userInput: {
        hamburgOderBremen: "no",
      },
    },
    {
      stepId: beratungshilfeBeantragt,
      userInput: {
        beratungshilfeBeantragt: "no",
      },
    },
    {
      stepId: eigeninitiative,
      userInput: {
        eigeninitiativeGrundvorraussetzung: "no",
      },
    },
    {
      stepId: anwaltStart,
    },
  ],
  hamburgBremenYes: [
    {
      stepId: hamburgBremen,
      userInput: {
        hamburgOderBremen: "yes",
      },
    },
    {
      stepId: "/grundvoraussetzungen/hamburg-oder-bremen-hinweis",
    },
  ],
  beratungshilfeBeantragt: [
    {
      stepId: beratungshilfeBeantragt,
      userInput: {
        beratungshilfeBeantragt: "yes",
      },
    },
    {
      stepId: "/grundvoraussetzungen/beratungshilfe-beantragt-hinweis",
    },
  ],
  eigeninitiativeGrundvorraussetzung: [
    {
      stepId: eigeninitiative,
      userInput: {
        eigeninitiativeGrundvorraussetzung: "yes",
      },
    },
    {
      stepId:
        "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung-hinweis",
    },
  ],
} satisfies FlowTestCases<BeratungshilfeGrundvoraussetzungenUserData>;
