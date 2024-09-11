import { createMachine } from "xstate";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { TestCases } from "~/flows/__test__/TestCases";
import { fluggastrechtFlow } from "~/flows/fluggastrechteFormular";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { fluggastrechteGuards } from "~/flows/fluggastrechteFormular/guards";
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
      unter18JahreAlt: CheckboxValue.off,
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
      unter18JahreAlt: CheckboxValue.on,
      vornameVertretung: "test",
      nachnameVertretung: "test",
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
      unter18JahreAlt: CheckboxValue.on,
      vornameVertretung: "test",
      nachnameVertretung: "test",
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
      unter18JahreAlt: CheckboxValue.off,
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
      unter18JahreAlt: CheckboxValue.off,
      isWeiterePersonen: "yes",
      weiterePersonen: [
        {
          title: "",
          vorname: "test",
          nachname: "test",
          strasseHausnummer: "test",
          ort: "test",
          plz: "13055",
          unter18JahreAlt: CheckboxValue.on,
          vornameVertretung: "test",
          nachnameVertretung: "test",
          strasseHausnummerVertretung: "strasseHausnummerVertretung",
          ortVertretung: "ortVertretung",
          plzVertretung: "plzVertretung",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "persoenliche-daten/weitere-personen/person/daten",
      "persoenliche-daten/weitere-personen/person/vertretung-minderjaehrige",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularPersoenlicheDaten = {
  machine,
  cases,
};
