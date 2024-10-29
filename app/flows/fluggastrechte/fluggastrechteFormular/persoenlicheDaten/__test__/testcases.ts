import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import { fluggastrechtFlow } from "~/flows/fluggastrechte/fluggastrechteFormular";
import type { FluggastrechtContext } from "~/flows/fluggastrechte/fluggastrechteFormular/context";
import { fluggastrechteGuards } from "~/flows/fluggastrechte/fluggastrechteFormular/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const cases = [
  [
    {
      anrede: "mr",
      title: "",
      vorname: "test",
      nachname: "test",
      strasseHausnummer: "test",
      ort: "test",
      plz: "13055",
      isWeiterePersonen: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "zusammenfassung/start",
    ],
  ],
  [
    {
      anrede: "mr",
      title: "",
      vorname: "test",
      nachname: "test",
      strasseHausnummer: "test",
      ort: "test",
      plz: "13055",
      isWeiterePersonen: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "zusammenfassung/start",
    ],
  ],
  [
    {
      anrede: "mr",
      title: "",
      vorname: "test",
      nachname: "test",
      strasseHausnummer: "test",
      ort: "test",
      plz: "13055",
      isWeiterePersonen: "yes",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "persoenliche-daten/weitere-personen/uebersicht",
      "zusammenfassung/start",
    ],
  ],
  [
    {
      anrede: "mr",
      title: "",
      vorname: "test",
      nachname: "test",
      strasseHausnummer: "test",
      ort: "test",
      plz: "13055",
      isWeiterePersonen: "yes",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "persoenliche-daten/weitere-personen/uebersicht",
      "zusammenfassung/start",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularPersoenlicheDaten = {
  machine,
  cases,
};
