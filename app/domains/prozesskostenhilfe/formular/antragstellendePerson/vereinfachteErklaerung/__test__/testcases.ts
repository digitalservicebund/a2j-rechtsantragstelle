import { type TestCases } from "~/domains/__test__/TestCases";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";

const prefix = "/antragstellende-person/vereinfachte-erklaerung";

export const testCasesPKHFormularAntragstellendePersonVereinfachteErklaerung = (
  [
    [
      {
        child: { vorname: "Max", nachname: "Mustermann" },
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
        child: {
          vorname: "Max",
          nachname: "Mustermann",
          geburtsdatum: "01.01.2015",
        },
        livesTogether: "yes",
      },
      [
        "/kind",
        "/hinweis-voraussetzung",
        "/zusammenleben",
        "/minderjaehrig",
        "/geburtsdatum",
        "/worum-gehts",
      ],
    ],
  ] as const
).map(([data, steps]) => [
  data,
  steps.map((stepId) => prefix + stepId),
]) satisfies TestCases<ProzesskostenhilfeFormularUserData>;
