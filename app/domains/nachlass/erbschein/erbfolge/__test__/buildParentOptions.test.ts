import {
  BOTH_PARENTS_VALUE,
  buildElternteilParentOptions,
  buildParentOptions,
  resolveParentOptions,
} from "../buildParentOptions";
import { translations } from "~/services/translations/translations";

describe("buildParentOptions", () => {
  it("returns only eligible parents (isAlive=no AND hatteKinder=yes)", () => {
    const elternteile = [
      { vorname: "Maria", isAlive: "no", hatteKinder: "yes" },
      { vorname: "Hans", isAlive: "yes", hatteKinder: "yes" },
    ];
    expect(buildParentOptions(elternteile)).toEqual([
      { value: "0", text: "Maria", preSelected: false },
    ]);
  });

  it("excludes parents where hatteKinder is not yes", () => {
    const elternteile = [
      { vorname: "Maria", isAlive: "no", hatteKinder: "no" },
      { vorname: "Klaus", isAlive: "no", hatteKinder: "yes" },
    ];
    expect(buildParentOptions(elternteile)).toEqual([
      { value: "1", text: "Klaus", preSelected: false },
    ]);
  });

  it("returns empty array when no eligible parents", () => {
    const elternteile = [
      { vorname: "Hans", isAlive: "yes" },
      { vorname: "Maria", isAlive: "no", hatteKinder: "no" },
    ];
    expect(buildParentOptions(elternteile)).toEqual([]);
  });

  it("returns empty array when elternteile is undefined", () => {
    expect(buildParentOptions(undefined)).toEqual([]);
  });

  it("returns empty array when elternteile is empty", () => {
    expect(buildParentOptions([])).toEqual([]);
  });

  it("uses the array index as the option value (as a string)", () => {
    const elternteile = [
      { vorname: "Skipped", isAlive: "yes" },
      { vorname: "Maria", isAlive: "no", hatteKinder: "yes" },
      { vorname: "Klaus", isAlive: "no", hatteKinder: "yes" },
    ];
    const options = buildParentOptions(elternteile);
    expect(options[0].value).toBe("1");
    expect(options[1].value).toBe("2");
  });

  it("uses the parent name as the option text", () => {
    const elternteile = [
      { vorname: "Maria", isAlive: "no", hatteKinder: "yes" },
    ];
    expect(buildParentOptions(elternteile)[0].text).toBe("Maria");
  });

  it("returns multiple eligible parents in index order", () => {
    const elternteile = [
      { vorname: "Maria", isAlive: "no", hatteKinder: "yes" },
      { vorname: "Klaus", isAlive: "no", hatteKinder: "yes" },
    ];
    expect(buildParentOptions(elternteile)).toEqual([
      { value: "0", text: "Maria", preSelected: false },
      { value: "1", text: "Klaus", preSelected: false },
    ]);
  });
});

describe("buildElternteilParentOptions", () => {
  const bothOption = {
    value: BOTH_PARENTS_VALUE,
    text: translations.select.bothParents.de,
    preSelected: false,
  };

  it("lists dead parents and appends 'Beide Elternteile' when both parents entered (both dead)", () => {
    const elternteile = [
      { vorname: "Maria", isAlive: "no" },
      { vorname: "Klaus", isAlive: "no" },
    ];
    expect(buildElternteilParentOptions(elternteile)).toEqual([
      { value: "0", text: "Maria", preSelected: false },
      { value: "1", text: "Klaus", preSelected: false },
      bothOption,
    ]);
  });

  it("offers 'Beide Elternteile' even when only one parent is dead (two entered)", () => {
    const elternteile = [
      { vorname: "Maria", isAlive: "no" },
      { vorname: "Hans", isAlive: "yes" },
    ];
    expect(buildElternteilParentOptions(elternteile)).toEqual([
      { value: "0", text: "Maria", preSelected: false },
      bothOption,
    ]);
  });

  it("does not require hatteKinder — lists any dead parent", () => {
    const elternteile = [
      { vorname: "Maria", isAlive: "no", hatteKinder: "no" },
      { vorname: "Klaus", isAlive: "no", hatteKinder: "yes" },
    ];
    expect(buildElternteilParentOptions(elternteile)).toEqual([
      { value: "0", text: "Maria", preSelected: false },
      { value: "1", text: "Klaus", preSelected: false },
      bothOption,
    ]);
  });

  it("omits 'Beide Elternteile' when fewer than two parents entered", () => {
    const elternteile = [{ vorname: "Maria", isAlive: "no" }];
    expect(buildElternteilParentOptions(elternteile)).toEqual([
      { value: "0", text: "Maria", preSelected: false },
    ]);
  });

  it("returns empty array when elternteile is undefined", () => {
    expect(buildElternteilParentOptions(undefined)).toEqual([]);
  });
});

describe("resolveParentOptions for deeper elternteil levels", () => {
  it("lists eligible siblings for a level-2 parentKindIndex", () => {
    const options = resolveParentOptions(
      "elternteile#kinder#kinder#parentKindIndex",
      {
        elternteile: [
          {
            vorname: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              { vorname: "Geschwister 1", isAlive: "no", hatteKinder: "yes" },
              { vorname: "Geschwister 2", isAlive: "yes" },
              { vorname: "Geschwister 3", isAlive: "no", hatteKinder: "yes" },
            ],
          },
        ],
      },
      [0, 0],
    );
    expect(options).toEqual([
      { value: "0", text: "Geschwister 1", preSelected: false },
      { value: "2", text: "Geschwister 3", preSelected: false },
    ]);
  });

  it("navigates one level deeper for a level-3 parentKindIndex", () => {
    const options = resolveParentOptions(
      "elternteile#kinder#kinder#kinder#parentKindIndex",
      {
        elternteile: [
          {
            vorname: "Elternteil A",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [
              {
                vorname: "Geschwister 1",
                isAlive: "no",
                hatteKinder: "yes",
                kinder: [
                  { vorname: "Nichte X", isAlive: "no", hatteKinder: "yes" },
                  { vorname: "Neffe Y", isAlive: "yes" },
                ],
              },
            ],
          },
        ],
      },
      [0, 0, 0],
    );
    expect(options).toEqual([
      { value: "0", text: "Nichte X", preSelected: true },
    ]);
  });
});

describe("resolveParentOptions preselects a single option", () => {
  it("preselects the only kinder-tree option", () => {
    const options = resolveParentOptions(
      "kinder#kinder#parentKindIndex",
      { kinder: [{ vorname: "Anna", isAlive: "no", hatteKinder: "yes" }] },
      [0],
    );
    expect(options).toEqual([{ value: "0", text: "Anna", preSelected: true }]);
  });

  it("does not preselect when multiple options exist", () => {
    const options = resolveParentOptions(
      "elternteile#kinder#parentElternteilIndex",
      {
        elternteile: [
          { vorname: "Maria", isAlive: "no" },
          { vorname: "Klaus", isAlive: "no" },
        ],
      },
      [],
    );
    expect(options.every((option) => option.preSelected === false)).toBe(true);
  });
});
