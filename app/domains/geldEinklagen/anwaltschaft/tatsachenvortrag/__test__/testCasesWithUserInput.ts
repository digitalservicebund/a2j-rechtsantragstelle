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
  editsAugenschein: [
    {
      stepId:
        "/tatsachenvortrag-beweise/vortraege/0/absaetze/0/beweise/0/augenschein-daten",
      userInput: {
        "vortraege#absaetze#beweise#beschreibung": "Foto des Schadens",
        "vortraege#absaetze#beweise#id": "",
        "vortraege#absaetze#beweise#type": "augenschein",
      },
    },
    {
      stepId: "/tatsachenvortrag-beweise/vortraege/#/absaetze",
    },
  ],
  editsUrkunde: [
    {
      stepId:
        "/tatsachenvortrag-beweise/vortraege/0/absaetze/0/beweise/0/urkunde-daten",
      userInput: {
        "vortraege#absaetze#beweise#beschreibung": "Mietvertrag",
        "vortraege#absaetze#beweise#id": "",
        "vortraege#absaetze#beweise#type": "urkunde",
      },
    },
    {
      stepId: "/tatsachenvortrag-beweise/vortraege/#/absaetze",
    },
  ],
  editsSachverstaendigengutachten: [
    {
      stepId:
        "/tatsachenvortrag-beweise/vortraege/0/absaetze/0/beweise/0/sachverstaendigengutachten-daten",
      userInput: {
        "vortraege#absaetze#beweise#beschreibung": "Gutachten zur Schadenshöhe",
        "vortraege#absaetze#beweise#id": "",
        "vortraege#absaetze#beweise#type": "sachverstaendigengutachten",
      },
    },
    {
      stepId: "/tatsachenvortrag-beweise/vortraege/#/absaetze",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
