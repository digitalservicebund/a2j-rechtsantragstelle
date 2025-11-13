import { type ArrayConfigServer } from "~/services/array";
import {
  arrayIsNonEmpty,
  findArraysWithCommonCondition,
  removeArrayIndex,
} from "../array";

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

describe("arrayIsNonEmpty", () => {
  it("returns true if array is not empty", () => {
    expect(arrayIsNonEmpty([1, 2, 3])).toBe(true);
  });
  it("returns false if array is empty", () => {
    expect(arrayIsNonEmpty([])).toBe(false);
  });
  it("returns false if array is undefined", () => {
    expect(arrayIsNonEmpty()).toBe(false);
  });
  it("returns false if array is null", () => {
    expect(arrayIsNonEmpty(null)).toBe(false);
  });
});

describe("removeArrayIndex", () => {
  it("removes the index from a path", () => {
    expect(removeArrayIndex("flow/step/0/subStep")).toBe("flow/step/subStep");
  });

  it("Removes a two-character index", () => {
    expect(removeArrayIndex("flow/step/00/subStep")).toBe("flow/step/subStep");
  });

  it("doesn't remove anything from a non-index step that includes a numeric character", () => {
    expect(removeArrayIndex("flow/step/sub0Step")).toBe("flow/step/sub0Step");
  });

  it("doesn't remove anything from a step withou an index", () => {
    expect(removeArrayIndex("flow/step/subStep")).toBe("flow/step/subStep");
  });
});

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
