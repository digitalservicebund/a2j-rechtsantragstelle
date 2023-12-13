/* eslint sonarjs/no-duplicate-string: 0 */
import { createMachine } from "xstate";
import { fluggastrechteGuards } from "~/models/flows/fluggastrechteFormular/guards";
import fluggastrechteFormularFlow from "~/models/flows/fluggastrechteFormular/config.json";
import type { TestCases } from "../TestCases";
import type { FluggastrechtContext } from "~/models/flows/fluggastrechteFormular/context";

const machine = createMachine<FluggastrechtContext>(
  { ...fluggastrechteFormularFlow, context: {} },
  { guards: fluggastrechteGuards },
);

const happyPathSteps = [
  "intro.start",
  "intro.dokumente",
  "intro.daten-uebernahme",
  "flugdaten.zwischenstopps",
  "flugdaten.ankunftszeit",
];

const cases = [
  [{}, happyPathSteps],
  [
    { zwischenstopps: "no" },
    [
      "flugdaten.zwischenstopps",
      "flugdaten.flug-details-single-flugnummer",
      "flugdaten.flug-details-single-abflug",
      "flugdaten.flug-details-single-ankunft",
      "flugdaten.ankunftszeit",
    ],
  ],
  [
    { zwischenstopps: "yes" },
    [
      "flugdaten.zwischenstopps",
      "flugdaten.zwischenstopps-eingabe",
      "flugdaten.flug-details-zwischenstopp-flugnummer",
      "flugdaten.flug-details-zwischenstopp-abflug",
      "flugdaten.flug-details-zwischenstopp-ankunft",
      "flugdaten.flug-details-zwischenstopp-2-flugnummer",
      "flugdaten.flug-details-zwischenstopp-2-abflug",
      "flugdaten.flug-details-zwischenstopp-2-ankunft",
      "flugdaten.ankunftszeit",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormular = { machine, cases };
