import { type TestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

const prefix = "/antragstellende-person/vereinfachte-erklaerung";

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
    [
      {
        minderjaehrig: "no",
        unterhaltsOrAbstammungssachen: "yes",
        rechtlichesThama: "unterhalt",
        hohesEinkommen: "yes",
        hasEinnahmen: "yes",
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
  ] as Array<[ProzesskostenhilfeFormularUserData, string[]]>
).map(([data, steps]) => [
  data,
  steps.map((stepId) => prefix + stepId),
]) satisfies TestCases<ProzesskostenhilfeFormularUserData>;
