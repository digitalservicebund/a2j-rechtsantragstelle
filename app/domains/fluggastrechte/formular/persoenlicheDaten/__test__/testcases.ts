import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";

const baseContext = {
  vorname: "test",
  nachname: "test",
  strasseHausnummer: "test",
  ort: "test",
  plz: "13055",
};

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
      "/prozessfuehrung/videoverhandlung",
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
    },
    [
      "/persoenliche-daten/person/daten",
      "/persoenliche-daten/weitere-personen/frage",
      "/persoenliche-daten/weitere-personen/uebersicht",
      "/prozessfuehrung/zeugen",
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
