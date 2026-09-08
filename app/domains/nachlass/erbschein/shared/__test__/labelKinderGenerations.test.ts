import type { SummaryItem } from "~/services/summary/types";
import { labelKinderGenerations } from "../labelKinderGenerations";

function sectionWithKinder(boxKeys: string[]): SummaryItem {
  return {
    id: "angehoerige",
    title: "Angehörige",
    fields: [],
    arrayGroups: [
      {
        id: "kinder",
        title: "Kinder",
        items: boxKeys.map((arrayBoxKey, index) => ({
          id: String(index),
          question: "",
          answer: "",
          arrayBoxKey,
        })),
      },
    ],
  };
}

describe("labelKinderGenerations", () => {
  it("labels each kinder item by generation, numbered within that generation", () => {
    const [section] = labelKinderGenerations([
      sectionWithKinder([
        "kinder-0",
        "kinder-1",
        "kinder-0-kinder-0",
        "kinder-0-kinder-1",
        "kinder-0-kinder-0-kinder-0",
      ]),
    ]);

    expect(section.arrayGroups?.[0].items.map((item) => item.title)).toEqual([
      "Kind 1",
      "Kind 2",
      "Enkelkind 1",
      "Enkelkind 2",
      "Urenkel 1",
    ]);
  });

  it("leaves groups other than kinder untouched", () => {
    const [section] = labelKinderGenerations([
      {
        id: "testament",
        title: "Testament",
        fields: [],
        arrayGroups: [
          {
            id: "beguenstigten",
            title: "Begünstigte",
            items: [
              {
                id: "0",
                question: "",
                answer: "",
                arrayBoxKey: "beguenstigten-0",
              },
            ],
          },
        ],
      },
    ]);

    expect(section.arrayGroups?.[0].items[0].title).toBeUndefined();
  });
});
