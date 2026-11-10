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
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze",
    },
  ],
  editsHauptantragUrkunde: [
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/0/absaetze/0/beweise/0/urkunde-daten",
      userInput: {
        "hauptantrag#absaetze#beweise#beschreibung": "Mietvertrag",
        "hauptantrag#absaetze#beweise#id": "",
        "hauptantrag#absaetze#beweise#type": "urkunde",
      },
    },
    {
      stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze",
    },
  ],
  editsNebenantragUrkunde: [
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/0/nebenantraege/0/absaetze/0/beweise/0/urkunde-daten",
      userInput: {
        "hauptantrag#nebenantraege#absaetze#beweise#beschreibung":
          "Mietvertrag zum Nebenantrag",
        "hauptantrag#nebenantraege#absaetze#beweise#id": "",
        "hauptantrag#nebenantraege#absaetze#beweise#type": "urkunde",
      },
    },
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze",
    },
  ],
  editsHauptantragSachverstaendigengutachten: [
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/0/absaetze/0/beweise/0/sachverstaendigengutachten-daten",
      userInput: {
        "hauptantrag#absaetze#beweise#beschreibung":
          "Gutachten zur Schadenshöhe",
        "hauptantrag#absaetze#beweise#id": "",
        "hauptantrag#absaetze#beweise#type": "sachverstaendigengutachten",
      },
    },
    {
      stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze",
    },
  ],
  editsNebenantragSachverstaendigengutachten: [
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/0/nebenantraege/0/absaetze/0/beweise/0/sachverstaendigengutachten-daten",
      userInput: {
        "hauptantrag#nebenantraege#absaetze#beweise#beschreibung":
          "Gutachten zur Schadenshöhe im Nebenantrag",
        "hauptantrag#nebenantraege#absaetze#beweise#id": "",
        "hauptantrag#nebenantraege#absaetze#beweise#type":
          "sachverstaendigengutachten",
      },
    },
    {
      stepId:
        "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze",
    },
  ],
} satisfies FlowTestCases<GeldEinklagenAnwaltschaftUserData>;
