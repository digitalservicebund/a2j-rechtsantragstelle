import { type FlowTestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";

export const tatsachenvortragTestCases = {
  hasTatsachenvortragComplete: [
    {
      stepId: "/tatsachenvortrag-beweise/uebersicht",
    },
    {
      stepId: "/rechtliche-wuerdigung",
    },
  ],
  editsHauptantragAugenschein: [
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/0/absaetze/0/beweise/0/augenschein-daten",
      userInput: {
        "hauptantrag#absaetze#beweise#beschreibung": "Foto des Schadens",
        "hauptantrag#absaetze#beweise#id": "",
        "hauptantrag#absaetze#beweise#type": "augenschein",
      },
    },
    {
      stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze",
    },
  ],
  editsNebenantragAugenschein: [
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/0/nebenantraege/0/absaetze/0/beweise/0/augenschein-daten",
      userInput: {
        "hauptantrag#nebenantraege#absaetze#beweise#beschreibung":
          "Foto des Nebenantrag-Schadens",
        "hauptantrag#nebenantraege#absaetze#beweise#id": "",
        "hauptantrag#nebenantraege#absaetze#beweise#type": "augenschein",
      },
    },
    {
      stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
