import {
  BASE_ALLOWANCE as baseAllowance,
  calculateFreibetrag,
  freibetraegePerYear,
  getFreibetraege,
  getVerfuegbaresEinkommenFreibetrag,
  latestFreibetraegeYear,
  SIMPLIFIED_CHILD_ALLOWANCE,
} from "~/domains/beratungshilfe/vorabcheck/freibetrag";
import * as timeUtils from "~/util/date";

let BASE_ALLOWANCE = baseAllowance;
let { incomeAllowance, partnerAllowance, childrenBelow6Allowance } =
  getFreibetraege();

vi.spyOn(console, "warn");
const todaySpy = vi.spyOn(timeUtils, "today");

describe("getFreibetraege", () => {
  it(`returns Freibetraege for ${latestFreibetraegeYear}`, () => {
    todaySpy.mockReturnValue(new Date(latestFreibetraegeYear, 0, 1));
    expect(getFreibetraege()).toEqual(
      freibetraegePerYear[latestFreibetraegeYear],
    );
  });

  it("returns Freibetraege for the last valid year if current year is not found, and shows the user a warning", () => {
    const nonExistentYear = latestFreibetraegeYear + 1;
    todaySpy.mockReturnValue(new Date(nonExistentYear, 0, 1));
    const freibetraege = getFreibetraege();
    expect(console.warn).toHaveBeenCalledWith(
      `No Freibeträge for year ${nonExistentYear}, using last valid Freibeträge from ${latestFreibetraegeYear}`,
    );
    expect(freibetraege).toEqual(freibetraegePerYear[latestFreibetraegeYear]);
  });
});

describe("calculateFreibetrag", () => {
  // Need value in cents
  beforeAll(() => {
    BASE_ALLOWANCE = baseAllowance * 100;
    incomeAllowance *= 100;
    partnerAllowance *= 100;
    childrenBelow6Allowance *= 100;
  });

  it(`should return ${BASE_ALLOWANCE} when single not working`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: false,
      }),
    ).toEqual(BASE_ALLOWANCE);
  });

  it(`should return ${BASE_ALLOWANCE} + ${incomeAllowance} when single working`, () => {
    expect(
      calculateFreibetrag({
        working: true,
        partnership: false,
      }),
    ).toEqual(BASE_ALLOWANCE + incomeAllowance);
  });

  it(`should return ${BASE_ALLOWANCE} + ${partnerAllowance} when partner not working`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: true,
      }),
    ).toEqual(BASE_ALLOWANCE + partnerAllowance);
  });

  it(`should return ${BASE_ALLOWANCE} + ${partnerAllowance} - partner income when partner working smaller than ${partnerAllowance}`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: true,
        partnerIncome: 50000,
      }),
    ).toEqual(BASE_ALLOWANCE + partnerAllowance - 50000);
  });

  it(`should return ${BASE_ALLOWANCE} when partner working bigger than ${partnerAllowance}`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: true,
        partnerIncome: 80000,
      }),
    ).toEqual(BASE_ALLOWANCE);
  });

  it(`should return ${BASE_ALLOWANCE} + ${childrenBelow6Allowance} when 1 child 0-6 not working`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 1,
      }),
    ).toEqual(BASE_ALLOWANCE + childrenBelow6Allowance);
  });

  it(`should return ${BASE_ALLOWANCE} + 2*${childrenBelow6Allowance} when 2 children 0-6 not working`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 2,
      }),
    ).toEqual(BASE_ALLOWANCE + 2 * childrenBelow6Allowance);
  });

  it(`should return ${BASE_ALLOWANCE} + ${childrenBelow6Allowance} - child income when 1 child 0-6 working less than ${childrenBelow6Allowance}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 1,
        childrenIncome: 10000,
      }),
    ).toEqual(BASE_ALLOWANCE + childrenBelow6Allowance - 10000);
  });

  it(`should return ${BASE_ALLOWANCE} when 1 child 0-6 working more than ${childrenBelow6Allowance}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 1,
        childrenIncome: 80000,
      }),
    ).toEqual(BASE_ALLOWANCE);
  });

  it(`should return ${BASE_ALLOWANCE} + 2*${childrenBelow6Allowance} - children income when 2 children 0-6 working less than ${childrenBelow6Allowance}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 2,
        childrenIncome: 10000,
      }),
    ).toEqual(BASE_ALLOWANCE + 2 * childrenBelow6Allowance - 10000);
  });

  it(`should return ${BASE_ALLOWANCE} + 2*${childrenBelow6Allowance} - children income when 2 children 0-6 working more than ${childrenBelow6Allowance} less than 2*${childrenBelow6Allowance}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 2,
        childrenIncome: 50000,
      }),
    ).toEqual(BASE_ALLOWANCE + 2 * childrenBelow6Allowance - 50000);
  });

  it("should handle undefined children as zero children", () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: undefined,
      }),
    ).toEqual(BASE_ALLOWANCE);
  });
});

const cases = [
  {
    condition: "empty context",
    context: {},
    result: BASE_ALLOWANCE,
  },
  {
    condition: "partner",
    context: { partnerschaft: "yes" },
    result: BASE_ALLOWANCE + partnerAllowance,
  },
  {
    condition: "partner and no kid but kinderAnzahlKurz given",
    context: { partnerschaft: "yes", kinderAnzahlKurz: "1" },
    result: BASE_ALLOWANCE + partnerAllowance,
  },
  {
    condition: "partner and one kid",
    context: { partnerschaft: "yes", kinderKurz: "yes", kinderAnzahlKurz: "1" },
    result: BASE_ALLOWANCE + partnerAllowance + SIMPLIFIED_CHILD_ALLOWANCE,
  },
  {
    condition: "no partner and one kid",
    context: { partnerschaft: "no", kinderKurz: "yes", kinderAnzahlKurz: "1" },
    result: BASE_ALLOWANCE + SIMPLIFIED_CHILD_ALLOWANCE,
  },
  {
    condition: "no partner and three kids",
    context: { partnerschaft: "no", kinderKurz: "yes", kinderAnzahlKurz: "3" },
    result: BASE_ALLOWANCE + 3 * SIMPLIFIED_CHILD_ALLOWANCE,
  },
  {
    condition: "erwerbstaetig",
    context: { erwerbstaetigkeit: "yes" },
    result: BASE_ALLOWANCE + incomeAllowance,
  },
  {
    condition: "partner and erwerbstaetig",
    context: { partnerschaft: "yes", erwerbstaetigkeit: "yes" },
    result: BASE_ALLOWANCE + partnerAllowance + incomeAllowance,
  },
  {
    condition: "partner and erwerbstaetig and two kids",
    context: {
      partnerschaft: "yes",
      erwerbstaetigkeit: "yes",
      kinderKurz: "yes",
      kinderAnzahlKurz: "2",
    },
    result:
      BASE_ALLOWANCE +
      partnerAllowance +
      incomeAllowance +
      2 * SIMPLIFIED_CHILD_ALLOWANCE,
  },
] as const;

describe("getVerfuegbaresEinkommenFreibetrag", () => {
  test.each(cases)("$condition, returns $result", ({ context, result }) => {
    const freibetrag = getVerfuegbaresEinkommenFreibetrag(context);
    expect(freibetrag).toEqual(result);
  });
});
