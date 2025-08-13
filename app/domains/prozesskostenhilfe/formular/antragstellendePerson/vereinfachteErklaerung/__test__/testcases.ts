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
      ["/kind", "/zusammenleben", "/unterhalt", "/minderjaehrig"],
    ],
    ...frageVermoegenFulfilled,
    ...frageVermoegenNotFulfilled,
    [
      {
        hasEinnahmen: "yes",
      },
      ["/einnahmen-uebersicht", "/einnahmen-warnung"],
    ],
    [
      {
        hasVermoegen: "no",
      },
      ["/vermoegen", "/hinweis-vereinfachte-erklaerung"],
    ],
    [
      {
        hasVermoegen: "yes",
        vermoegenUnder10000: "no",
      },
      ["/vermoegen", "/vermoegen-value", "/hinweis-weiteres-formular"],
    ],
    [
      {
        hasVermoegen: "yes",
        vermoegenUnder10000: "yes",
      },
      [
        "/vermoegen",
        "/vermoegen-value",
        "/vermoegen-uebersicht",
        "/vermoegen-warnung",
      ],
    ],
    [
      {
        hasVermoegen: "yes",
        vermoegenUnder10000: "yes",
        vermoegen: [{ beschreibung: "Test", wert: "1000" }],
      },
      [
        "/vermoegen",
        "/vermoegen-value",
        "/vermoegen-uebersicht",
        "/hinweis-vereinfachte-erklaerung",
      ],
    ],
  ] as Array<[ProzesskostenhilfeFormularUserData, string[]]>
).map(([data, steps]) => [
  data,
  steps.map((stepId) => prefix + stepId),
]) satisfies TestCases<ProzesskostenhilfeFormularUserData>;

export const testCasesPKHFormularAntragstellendePersonVereinfachteErklaerungTransitions =
  [
    [
      {
        empfaenger: "child",
      },
      ["/antragstellende-person/empfaenger", `${prefix}/kind`],
    ],
    [
      {
        empfaenger: "child",
        minderjaehrig: "no",
        unterhaltsOrAbstammungssachen: "yes",
        rechtlichesThema: "unterhalt",
        hasEinnahmen: "no",
      },
      [
        `${prefix}/hinweis-weiteres-formular`,
        "/antragstellende-person/unterhaltsanspruch",
      ],
    ],
    [
      {
        formularArt: "nachueberpruefung",
        empfaenger: "child",
        minderjaehrig: "no",
        unterhaltsOrAbstammungssachen: "yes",
        rechtlichesThema: "unterhalt",
        hasEinnahmen: "no",
      },
      [
        `${prefix}/hinweis-weiteres-formular`,
        "/antragstellende-person/unterhaltsanspruch",
      ],
    ],
    [
      {
        empfaenger: "child",
        minderjaehrig: "yes",
        unterhaltsOrAbstammungssachen: "yes",
        rechtlichesThema: "unterhalt",
        hasEinnahmen: "no",
        hasVermoegen: "no",
      },
      [
        `${prefix}/hinweis-vereinfachte-erklaerung`,
        "/antragstellende-person/unterhaltsanspruch",
      ],
    ],
    [
      {
        formularArt: "nachueberpruefung",
        empfaenger: "child",
        minderjaehrig: "yes",
        unterhaltsOrAbstammungssachen: "yes",
        rechtlichesThema: "unterhalt",
        hasEinnahmen: "no",
        hasVermoegen: "no",
      },
      [
        `${prefix}/hinweis-vereinfachte-erklaerung`,
        "/antragstellende-person/unterhaltsanspruch",
      ],
    ],
  ] as Array<
    [ProzesskostenhilfeFormularUserData, string[]]
  > satisfies TestCases<ProzesskostenhilfeFormularUserData>;
