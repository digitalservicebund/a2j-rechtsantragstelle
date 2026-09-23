import type { TestCases } from "~/domains/__test__/TestCases";
import { type FluggastrechteFormularWeiterePersonen } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

const baseContext = {
  anrede: "",
  title: "",
  vorname: "test",
  nachname: "test",
  strasse: "test",
  hausnummer: "1",
  plz: "13055",
  ort: "test",
  land: "Deutschland",
  telefonnummer: "",
} as FluggastrechteFormularWeiterePersonen[number];

export const testCasesFluggastrechteFormularPersoenlicheDaten = [
  [
    baseContext,
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/prozessfuehrung/zeugen",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "no",
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/prozessfuehrung/zeugen",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "yes",
      weiterePersonen: [
        {
          ...baseContext,
          datenverarbeitungZustimmung: "on",
          buchungsnummer: "123456",
        },
      ],
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/prozessfuehrung/zeugen",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "yes",
      weiterePersonen: [
        {
          ...baseContext,
          datenverarbeitungZustimmung: "on",
          buchungsnummer: "123456",
        },
      ],
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/prozessfuehrung/zeugen",
    ],
  ],
  [
    {
      ...baseContext,
      isWeiterePersonen: "yes",
      weiterePersonen: [],
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
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/persoenliche-daten/weitere-personen/warnung",
    ],
  ],
] as const satisfies TestCases<FluggastrechteUserData>;
