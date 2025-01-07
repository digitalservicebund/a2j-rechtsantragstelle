import {
  calculateFreibetrag,
  freibetraegePerYear,
  getFreibetraege,
  getVerfuegbaresEinkommenFreibetrag,
  latestFreibetraegeYear,
  SELF_ALLOWANCE_BUFFER,
  SIMPLIFIED_CHILD_ALLOWANCE,
} from "~/domains/beratungshilfe/vorabcheck/freibetrag";
import { today } from "~/util/date";

const {
  selfAllowance,
  incomeAllowance,
  partnerAllowance,
  childrenBelow6Allowance,
} = getFreibetraege(today().getFullYear());

vi.spyOn(console, "warn");

describe("getFreibetraege", () => {
  it(`returns Freibetraege for ${latestFreibetraegeYear}`, () => {
    expect(getFreibetraege(latestFreibetraegeYear)).toEqual(
      freibetraegePerYear[latestFreibetraegeYear],
    );
  });

  it("returns Freibetraege for the last valid year if current year is not found, and shows the user a warning", () => {
    const nonExistentYear = latestFreibetraegeYear + 1;
    const freibetraege = getFreibetraege(nonExistentYear);
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith(
      `No Freibeträge for year ${nonExistentYear}, using last valid Freibeträge from ${latestFreibetraegeYear}`,
    );
    expect(freibetraege).toEqual(freibetraegePerYear[latestFreibetraegeYear]);
  });
});

describe("calculateFreibetrag", () => {
  // Need values in cents
  const selfAllowanceCents = (selfAllowance + SELF_ALLOWANCE_BUFFER) * 100;
  const incomeAllowanceCents = incomeAllowance * 100;
  const partnerAllowanceCents = partnerAllowance * 100;
  const childrenBelow6AllowanceCents = childrenBelow6Allowance * 100;

  it(`should return ${selfAllowanceCents} when single not working`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: false,
      }),
    ).toEqual(selfAllowanceCents);
  });

  it(`should return ${selfAllowanceCents} + ${incomeAllowanceCents} when single working`, () => {
    expect(
      calculateFreibetrag({
        working: true,
        partnership: false,
      }),
    ).toEqual(selfAllowanceCents + incomeAllowanceCents);
  });

  it(`should return ${selfAllowanceCents} + ${partnerAllowanceCents} when partner not working`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: true,
      }),
    ).toEqual(selfAllowanceCents + partnerAllowanceCents);
  });

  it(`should return ${selfAllowanceCents} + ${partnerAllowanceCents} - partner income when partner working smaller than ${partnerAllowanceCents}`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: true,
        partnerIncome: 50000,
      }),
    ).toEqual(selfAllowanceCents + partnerAllowanceCents - 50000);
  });

  it(`should return ${selfAllowanceCents} when partner working bigger than ${partnerAllowanceCents}`, () => {
    expect(
      calculateFreibetrag({
        working: false,
        partnership: true,
        partnerIncome: 80000,
      }),
    ).toEqual(selfAllowanceCents);
  });

  it(`should return ${selfAllowanceCents} + ${childrenBelow6AllowanceCents} when 1 child 0-6 not working`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 1,
      }),
    ).toEqual(selfAllowanceCents + childrenBelow6AllowanceCents);
  });

  it(`should return ${selfAllowanceCents} + 2*${childrenBelow6AllowanceCents} when 2 children 0-6 not working`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 2,
      }),
    ).toEqual(selfAllowanceCents + 2 * childrenBelow6AllowanceCents);
  });

  it(`should return ${selfAllowanceCents} + ${childrenBelow6AllowanceCents} - child income when 1 child 0-6 working less than ${childrenBelow6AllowanceCents}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 1,
        childrenIncome: 10000,
      }),
    ).toEqual(selfAllowanceCents + childrenBelow6AllowanceCents - 10000);
  });

  it(`should return ${selfAllowanceCents} when 1 child 0-6 working more than ${childrenBelow6AllowanceCents}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 1,
        childrenIncome: 80000,
      }),
    ).toEqual(selfAllowanceCents);
  });

  it(`should return ${selfAllowanceCents} + 2*${childrenBelow6AllowanceCents} - children income when 2 children 0-6 working less than ${childrenBelow6AllowanceCents}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 2,
        childrenIncome: 10000,
      }),
    ).toEqual(selfAllowanceCents + 2 * childrenBelow6AllowanceCents - 10000);
  });

  it(`should return ${selfAllowanceCents} + 2*${childrenBelow6AllowanceCents} - children income when 2 children 0-6 working more than ${childrenBelow6AllowanceCents} less than 2*${childrenBelow6AllowanceCents}`, () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: 2,
        childrenIncome: 50000,
      }),
    ).toEqual(selfAllowanceCents + 2 * childrenBelow6AllowanceCents - 50000);
  });

  it("should handle undefined children as zero children", () => {
    expect(
      calculateFreibetrag({
        childrenBelow6: undefined,
      }),
    ).toEqual(selfAllowanceCents);
  });
});

const cases = [
  {
    condition: "empty context",
    context: {},
    result: selfAllowance + SELF_ALLOWANCE_BUFFER,
  },
  {
    condition: "partner",
    context: { partnerschaft: "yes" },
    result: selfAllowance + SELF_ALLOWANCE_BUFFER + partnerAllowance,
  },
  {
    condition: "partner and no kid but kinderAnzahlKurz given",
    context: { partnerschaft: "yes", kinderAnzahlKurz: "1" },
    result: selfAllowance + SELF_ALLOWANCE_BUFFER + partnerAllowance,
  },
  {
    condition: "partner and one kid",
    context: { partnerschaft: "yes", kinderKurz: "yes", kinderAnzahlKurz: "1" },
    result:
      selfAllowance +
      SELF_ALLOWANCE_BUFFER +
      partnerAllowance +
      SIMPLIFIED_CHILD_ALLOWANCE,
  },
  {
    condition: "no partner and one kid",
    context: { partnerschaft: "no", kinderKurz: "yes", kinderAnzahlKurz: "1" },
    result: selfAllowance + SELF_ALLOWANCE_BUFFER + SIMPLIFIED_CHILD_ALLOWANCE,
  },
  {
    condition: "no partner and three kids",
    context: { partnerschaft: "no", kinderKurz: "yes", kinderAnzahlKurz: "3" },
    result:
      selfAllowance + SELF_ALLOWANCE_BUFFER + 3 * SIMPLIFIED_CHILD_ALLOWANCE,
  },
  {
    condition: "erwerbstaetig",
    context: { erwerbstaetigkeit: "yes" },
    result: selfAllowance + SELF_ALLOWANCE_BUFFER + incomeAllowance,
  },
  {
    condition: "partner and erwerbstaetig",
    context: { partnerschaft: "yes", erwerbstaetigkeit: "yes" },
    result:
      selfAllowance +
      SELF_ALLOWANCE_BUFFER +
      partnerAllowance +
      incomeAllowance,
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
      selfAllowance +
      SELF_ALLOWANCE_BUFFER +
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
