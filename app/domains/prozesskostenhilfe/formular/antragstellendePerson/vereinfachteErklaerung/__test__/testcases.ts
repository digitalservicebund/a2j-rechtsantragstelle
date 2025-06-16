import { type TestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

const prefix = "/antragstellende-person/vereinfachte-erklaerung";

const frageVermoegenFulfilled = [
  [
    {
      minderjaehrig: "yes",
      unterhaltsOrAbstammungssachen: "yes",
      rechtlichesThema: "unterhalt",
      hasEinnahmen: "no",
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/rechtliches-thema",
      "/einnahmen",
      "/vermoegen",
    ],
  ],
  [
    {
      minderjaehrig: "yes",
      unterhaltsOrAbstammungssachen: "yes",
      rechtlichesThema: "vollstreckung",
      hasEinnahmen: "no",
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/rechtliches-thema",
      "/einnahmen",
      "/vermoegen",
    ],
  ],
  [
    {
      minderjaehrig: "yes",
      unterhaltsOrAbstammungssachen: "yes",
      rechtlichesThema: "abstammung",
      hasEinnahmen: "no",
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/rechtliches-thema",
      "/einnahmen",
      "/vermoegen",
    ],
  ],
  [
    {
      minderjaehrig: "yes",
      unterhaltsOrAbstammungssachen: "yes",
      rechtlichesThema: "unterhalt",
      hasEinnahmen: "yes",
      hohesEinkommen: "no",
      einnahmen: [
        {
          beschreibung: "Einnahme",
          betrag: "100",
          zahlungsfrequenz: "quarterly",
        },
      ],
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/rechtliches-thema",
      "/einnahmen",
      "/einnahmen-value",
      "/einnahmen-uebersicht",
      "/vermoegen",
    ],
  ],
];

const frageVermoegenNotFulfilled = [
  [
    {
      minderjaehrig: "no",
      unterhaltsOrAbstammungssachen: "yes",
      rechtlichesThema: "unterhalt",
      hasEinnahmen: "no",
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/rechtliches-thema",
      "/einnahmen",
      "/hinweis-weiteres-formular",
    ],
  ],
  [
    {
      minderjaehrig: "yes",
      unterhaltsOrAbstammungssachen: "no",
      hasEinnahmen: "no",
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/einnahmen",
      "/hinweis-weiteres-formular",
    ],
  ],
  [
    {
      minderjaehrig: "yes",
      unterhaltsOrAbstammungssachen: "yes",
      rechtlichesThema: "other",
      hasEinnahmen: "no",
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/rechtliches-thema",
      "/einnahmen",
      "/hinweis-weiteres-formular",
    ],
  ],
  [
    {
      minderjaehrig: "yes",
      unterhaltsOrAbstammungssachen: "yes",
      rechtlichesThema: "unterhalt",
      hasEinnahmen: "yes",
      hohesEinkommen: "yes",
      einnahmen: [
        {
          beschreibung: "Einnahme",
          betrag: "100",
          zahlungsfrequenz: "quarterly",
        },
      ],
    },
    [
      "/minderjaehrig",
      "/geburtsdatum",
      "/worum-gehts",
      "/rechtliches-thema",
      "/einnahmen",
      "/einnahmen-value",
      "/einnahmen-uebersicht",
      "/hinweis-weiteres-formular",
    ],
  ],
];

export const testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung = (
  [
    [
      {
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "01.01.2015",
        },
        livesTogether: "no",
      },
      [
        "/kind",
        "/hinweis-voraussetzung",
        "/zusammenleben",
        "/unterhalt",
        "/minderjaehrig",
      ],
    ],
    ...frageVermoegenFulfilled,
    ...frageVermoegenNotFulfilled,
    [
      {
        hasVermoegen: "no",
      },
      ["/vermoegen", "/hinweis-vereinfachte-erklaerung"],
    ],
    [
      {
        hasVermoegen: "yes",
      },
      ["/vermoegen", "/vermoegen-value"],
    ],
  ] as Array<[ProzesskostenhilfeFormularUserData, string[]]>
).map(([data, steps]) => [
  data,
  steps.map((stepId) => prefix + stepId),
]) satisfies TestCases<ProzesskostenhilfeFormularUserData>;
