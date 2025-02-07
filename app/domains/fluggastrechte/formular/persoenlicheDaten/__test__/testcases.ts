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

const baseContext = {
  vorname: "test",
  nachname: "test",
  strasseHausnummer: "test",
  ort: "test",
  plz: "13055",
};

const cases = [
  [
    {
      ...baseContext,
      isWeiterePersonen: "no",
      hasZeugen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/zeugen",
      "/prozessfuehrung/videoverhandlung",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "no",
      hasZeugen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/zeugen",
      "/prozessfuehrung/videoverhandlung",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "yes",
      weiterePersonen: [
        {
          ...baseContext,
        },
      ],
      hasZeugen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/persoenliche-daten/weitere-personen/zeugen",
      "/prozessfuehrung/videoverhandlung",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "yes",
      weiterePersonen: [
        {
          ...baseContext,
        },
      ],
      hasZeugen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/persoenliche-daten/weitere-personen/zeugen",
      "/prozessfuehrung/videoverhandlung",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "yes",
      weiterePersonen: [],
      hasZeugen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/persoenliche-daten/weitere-personen/warnung",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "yes",
      hasZeugen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/persoenliche-daten/weitere-personen/warnung",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularPersoenlicheDaten = {
  machine,
  cases,
};
