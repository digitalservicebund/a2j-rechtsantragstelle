import {
  BASE_SUM as baseSum,
  freibetrag,
  freibetragPerYear,
  getFreibetraege,
  getVerfuegbaresEinkommenFreibetrag,
} from "~/domains/beratungshilfe/vorabcheck/freibetrag";
import * as timeUtils from "~/util/date";

let BASE_SUM = baseSum;
let { income, partner, childrenBelow6 } = getFreibetraege();

vi.spyOn(console, "warn");
const todaySpy = vi.spyOn(timeUtils, "today");
const latestFreibetraegeYear = Number(Object.keys(freibetragPerYear).at(-1));

describe("getFreibetraege", () => {
  it(`returns Freibetraege for ${latestFreibetraegeYear}`, () => {
    todaySpy.mockReturnValue(new Date(latestFreibetraegeYear, 0, 1));
    expect(getFreibetraege()).toEqual(
      freibetragPerYear[latestFreibetraegeYear],
    );
  });

  it("returns Freibetraege for the last valid year if current year is not found, and shows the user a warning", () => {
    const nonExistentYear = latestFreibetraegeYear + 1;
    todaySpy.mockReturnValue(new Date(nonExistentYear, 0, 1));
    const freibetraege = getFreibetraege();
    expect(console.warn).toHaveBeenCalledWith(
      `No Freibeträge for year ${nonExistentYear}, using last valid Freibeträge from ${latestFreibetraegeYear}`,
    );
    expect(freibetraege).toEqual(freibetragPerYear[latestFreibetraegeYear]);
  });
});

describe(`freibetrag`, () => {
  // Need value in cents
  beforeAll(() => {
    BASE_SUM = baseSum * 100;
    income *= 100;
    partner *= 100;
    childrenBelow6 *= 100;
  });

  it(`should return ${BASE_SUM} when single not working`, () => {
    expect(
      freibetrag({
        working: false,
        partnership: false,
      }),
    ).toEqual(BASE_SUM);
  });

  it(`should return ${BASE_SUM} + ${income} when single working`, () => {
    expect(
      freibetrag({
        working: true,
        partnership: false,
      }),
    ).toEqual(BASE_SUM + income);
  });

  it(`should return ${BASE_SUM} + ${partner} when partner not working`, () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
      }),
    ).toEqual(BASE_SUM + partner);
  });

  it(`should return ${BASE_SUM} + ${partner} - partner income when partner working smaller than ${partner}`, () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
        partnerIncome: 50000,
      }),
    ).toEqual(BASE_SUM + partner - 50000);
  });

  it(`should return ${BASE_SUM} when partner working bigger than ${partner}`, () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
        partnerIncome: 80000,
      }),
    ).toEqual(BASE_SUM);
  });

  it(`should return ${BASE_SUM} + ${childrenBelow6} when 1 child 0-6 not working`, () => {
    expect(
      freibetrag({
        numChildrenBelow6: 1,
      }),
    ).toEqual(BASE_SUM + childrenBelow6);
  });

  it(`should return ${BASE_SUM} + 2*${childrenBelow6} when 2 children 0-6 not working`, () => {
    expect(
      freibetrag({
        numChildrenBelow6: 2,
      }),
    ).toEqual(BASE_SUM + 2 * childrenBelow6);
  });

  it(`should return ${BASE_SUM} + ${childrenBelow6} - child income when 1 child 0-6 working less than ${childrenBelow6}`, () => {
    expect(
      freibetrag({
        numChildrenBelow6: 1,
        childrenIncome: 10000,
      }),
    ).toEqual(BASE_SUM + childrenBelow6 - 10000);
  });

  it(`should return ${BASE_SUM} when 1 child 0-6 working more than ${childrenBelow6}`, () => {
    expect(
      freibetrag({
        numChildrenBelow6: 1,
        childrenIncome: 80000,
      }),
    ).toEqual(BASE_SUM);
  });

  it(`should return ${BASE_SUM} + 2*${childrenBelow6} - children income when 2 children 0-6 working less than ${childrenBelow6}`, () => {
    expect(
      freibetrag({
        numChildrenBelow6: 2,
        childrenIncome: 10000,
      }),
    ).toEqual(BASE_SUM + 2 * childrenBelow6 - 10000);
  });

  it(`should return ${BASE_SUM} + 2*${childrenBelow6} - children income when 2 children 0-6 working more than ${childrenBelow6} less than 2*${childrenBelow6}`, () => {
    expect(
      freibetrag({
        numChildrenBelow6: 2,
        childrenIncome: 50000,
      }),
    ).toEqual(BASE_SUM + 2 * childrenBelow6 - 50000);
  });

  it(`should handle undefined children as zero children`, () => {
    expect(
      freibetrag({
        numChildrenBelow6: undefined,
      }),
    ).toEqual(BASE_SUM);
  });
});

const cases = [
  {
    condition: `empty context`,
    context: {},
    result: BASE_SUM,
  },
  {
    condition: `partner`,
    context: { partnerschaft: `yes` },
    result: BASE_SUM + partner,
  },
  {
    condition: `partner and no kid but kinderAnzahlKurz given`,
    context: { partnerschaft: `yes`, kinderAnzahlKurz: `1` },
    result: BASE_SUM + partner,
  },
  {
    condition: `partner and one kid`,
    context: { partnerschaft: `yes`, kinderKurz: `yes`, kinderAnzahlKurz: `1` },
    result: BASE_SUM + partner + 400,
  },
  {
    condition: `no partner and one kid`,
    context: { partnerschaft: `no`, kinderKurz: `yes`, kinderAnzahlKurz: `1` },
    result: BASE_SUM + 400,
  },
  {
    condition: `no partner and three kids`,
    context: { partnerschaft: `no`, kinderKurz: `yes`, kinderAnzahlKurz: `3` },
    result: BASE_SUM + 3 * 400,
  },
  {
    condition: `erwerbstaetig`,
    context: { erwerbstaetigkeit: `yes` },
    result: BASE_SUM + income,
  },
  {
    condition: `partner and erwerbstaetig`,
    context: { partnerschaft: `yes`, erwerbstaetigkeit: `yes` },
    result: BASE_SUM + partner + income,
  },
  {
    condition: `partner and erwerbstaetig and two kids`,
    context: {
      partnerschaft: `yes`,
      erwerbstaetigkeit: `yes`,
      kinderKurz: `yes`,
      kinderAnzahlKurz: `2`,
    },
    result: BASE_SUM + partner + income + 2 * 400,
  },
] as const;

describe(`getVerfuegbaresEinkommenFreibetrag`, () => {
  test.each(cases)(`$condition, returns $result`, ({ context, result }) => {
    const freibetrag = getVerfuegbaresEinkommenFreibetrag(context);
    expect(freibetrag).toEqual(result);
  });
});
