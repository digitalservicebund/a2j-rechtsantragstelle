import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { fluggastrechteGuards } from "~/domains/fluggastrechte/formular/guards";
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
      hasZeugen: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "persoenliche-daten/weitere-personen/zeugen",
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
      hasZeugen: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "persoenliche-daten/weitere-personen/zeugen",
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
      hasZeugen: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "persoenliche-daten/weitere-personen/uebersicht",
      "persoenliche-daten/weitere-personen/zeugen",
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
      hasZeugen: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/weitere-personen/frage",
      "persoenliche-daten/weitere-personen/uebersicht",
      "persoenliche-daten/weitere-personen/zeugen",
      "zusammenfassung/start",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularPersoenlicheDaten = {
  machine,
  cases,
};
