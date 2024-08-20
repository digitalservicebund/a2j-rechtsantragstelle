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
      forderungMehrerePersonen: "yes",
      anrede: "mr",
      title: "",
      vorname: "test",
      nachname: "test",
      strasseHausnummer: "test",
      ort: "test",
      plz: "13055",
      unter18JahreAlt: CheckboxValue.off,
      isProzessbevollmaechtigte: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/person/antragsteller-angeben",
      "persoenliche-daten/weitere-personen/uebersicht",
      "forderung/forderung",
    ],
  ],
  [
    {
      forderungMehrerePersonen: "yes",
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
      isProzessbevollmaechtigte: "no",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/person/vertretung-minderjaehrige",
      "persoenliche-daten/person/antragsteller-angeben",
      "persoenliche-daten/weitere-personen/uebersicht",
      "forderung/forderung",
    ],
  ],
  [
    {
      forderungMehrerePersonen: "yes",
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
      isProzessbevollmaechtigte: "yes",
      vornameVollmaechtigte: "test",
      vollmaechtigteNachname: "test",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/person/vertretung-minderjaehrige",
      "persoenliche-daten/person/antragsteller-angeben",
      "persoenliche-daten/person/antragsteller-daten",
      "persoenliche-daten/weitere-personen/uebersicht",
      "forderung/forderung",
    ],
  ],
  [
    {
      forderungMehrerePersonen: "yes",
      anrede: "mr",
      title: "",
      vorname: "test",
      nachname: "test",
      strasseHausnummer: "test",
      ort: "test",
      plz: "13055",
      unter18JahreAlt: CheckboxValue.off,
      isProzessbevollmaechtigte: "yes",
      vornameVollmaechtigte: "test",
      vollmaechtigteNachname: "test",
    },
    [
      "persoenliche-daten/person/daten",
      "persoenliche-daten/person/antragsteller-angeben",
      "persoenliche-daten/person/antragsteller-daten",
      "persoenliche-daten/weitere-personen/uebersicht",
      "forderung/forderung",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularPersoenlicheDaten = {
  machine,
  cases,
};
