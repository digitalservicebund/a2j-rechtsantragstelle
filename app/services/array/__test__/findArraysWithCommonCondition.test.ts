import { type ArrayConfigServer } from "~/services/array";
import { findArraysWithCommonCondition } from "~/services/array/findArraysWithCommonCondition";

const arraysWithCommonCondition: Array<[string, ArrayConfigServer]> = [
  [
    "array1",
    {
      statementKey: "hasKinder",
      event: "add-kinder",
      url: "",
      initialInputUrl: "",
    },
  ],
  [
    "array2",
    {
      statementKey: "hasKinder",
      event: "add-kinder",
      url: "",
      initialInputUrl: "",
    },
  ],
  [
    "array3",
    {
      statementKey: "hasKinder",
      event: "add-kinder",
      url: "",
      initialInputUrl: "",
    },
  ],
];

describe("findArraysWithCommonCondition", () => {
  it("should return the name of all arrays that share a statementKey", () => {
    expect(findArraysWithCommonCondition(arraysWithCommonCondition)).toEqual([
      "array1",
      "array2",
      "array3",
    ]);
  });

  it("should ignore arrays that have unique statementKeys", () => {
    expect(
      findArraysWithCommonCondition([
        ...arraysWithCommonCondition.slice(0, 2),
        [
          "array3",
          {
            statementKey: "hasAusgaben",
            event: "add-ausgaben",
            url: "",
            initialInputUrl: "",
          },
        ],
      ]),
    ).toEqual(["array1", "array2"]);
  });

  it("should return an empty array if no arrays share a statementKey", () => {
    expect(
      findArraysWithCommonCondition([
        arraysWithCommonCondition[0],
        [
          "array2",
          {
            statementKey: "hasAusgaben",
            event: "add-ausgaben",
            url: "",
            initialInputUrl: "",
          },
        ],
      ]),
    ).toEqual([]);
  });
});
