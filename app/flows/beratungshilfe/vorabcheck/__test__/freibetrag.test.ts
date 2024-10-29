import {
  freibetrag,
  getVerfuegbaresEinkommenFreibetrag,
} from "~/flows/beratungshilfe/vorabcheck/freibetrag";

describe("freibetrag", () => {
  it("should return 572 when single not working", () => {
    expect(
      freibetrag({
        working: false,
        partnership: false,
      }),
    ).toEqual(57200);
  });

  it("should return 572 + 251 when single working", () => {
    expect(
      freibetrag({
        working: true,
        partnership: false,
      }),
    ).toEqual(57200 + 25100);
  });

  it("should return 572 + 552 when partner not working", () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
      }),
    ).toEqual(57200 + 55200);
  });

  it("should return 572 + 552 - partner income when partner working smaller than 552", () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
        partnerIncome: 50000,
      }),
    ).toEqual(57200 + 55200 - 50000);
  });

  it("should return 572 when partner working bigger than 552", () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
        partnerIncome: 80000,
      }),
    ).toEqual(57200);
  });

  it("should return 572 + 350 when 1 child 0-6 not working", () => {
    expect(
      freibetrag({
        childrenBelow6: 1,
      }),
    ).toEqual(57200 + 35000);
  });

  it("should return 572 + 2*350 when 2 children 0-6 not working", () => {
    expect(
      freibetrag({
        childrenBelow6: 2,
      }),
    ).toEqual(57200 + 2 * 35000);
  });

  it("should return 572 + 350 - child income when 1 child 0-6 working less than 350", () => {
    expect(
      freibetrag({
        childrenBelow6: 1,
        childrenIncome: 10000,
      }),
    ).toEqual(57200 + 35000 - 10000);
  });

  it("should return 572 when 1 child 0-6 working more than 350", () => {
    expect(
      freibetrag({
        childrenBelow6: 1,
        childrenIncome: 80000,
      }),
    ).toEqual(57200);
  });

  it("should return 572 + 2*350 - children income when 2 children 0-6 working less than 350", () => {
    expect(
      freibetrag({
        childrenBelow6: 2,
        childrenIncome: 10000,
      }),
    ).toEqual(57200 + 2 * 35000 - 10000);
  });

  it("should return 572 + 2*350 - children income when 2 children 0-6 working more than 350 less than 2*350", () => {
    expect(
      freibetrag({
        childrenBelow6: 2,
        childrenIncome: 50000,
      }),
    ).toEqual(57200 + 2 * 35000 - 50000);
  });

  it("should handle NaN children as zero children", () => {
    expect(
      freibetrag({
        childrenBelow6: NaN,
      }),
    ).toEqual(57200);
  });
});

const cases = [
  {
    condition: "empty context",
    context: {},
    result: 572,
  },
  {
    condition: "partner",
    context: { partnerschaft: "yes" },
    result: 572 + 552,
  },
  {
    condition: "partner and no kid but kinderAnzahlKurz given",
    context: { partnerschaft: "yes", kinderAnzahlKurz: "1" },
    result: 572 + 552,
  },
  {
    condition: "partner and one kid",
    context: { partnerschaft: "yes", kinderKurz: "yes", kinderAnzahlKurz: "1" },
    result: 572 + 552 + 400,
  },
  {
    condition: "no partner and one kid",
    context: { partnerschaft: "no", kinderKurz: "yes", kinderAnzahlKurz: "1" },
    result: 572 + 400,
  },
  {
    condition: "no partner and three kids",
    context: { partnerschaft: "no", kinderKurz: "yes", kinderAnzahlKurz: "3" },
    result: 572 + 3 * 400,
  },
  {
    condition: "erwerbstaetig",
    context: { erwerbstaetigkeit: "yes" },
    result: 572 + 251,
  },
  {
    condition: "partner and erwerbstaetig",
    context: { partnerschaft: "yes", erwerbstaetigkeit: "yes" },
    result: 572 + 552 + 251,
  },
  {
    condition: "partner and erwerbstaetig and two kids",
    context: {
      partnerschaft: "yes",
      erwerbstaetigkeit: "yes",
      kinderKurz: "yes",
      kinderAnzahlKurz: "2",
    },
    result: 572 + 552 + 251 + 2 * 400,
  },
] as const;

describe("getVerfuegbaresEinkommenFreibetrag", () => {
  test.each(cases)("$condition, returns $result", ({ context, result }) => {
    const freibetrag = getVerfuegbaresEinkommenFreibetrag(context);
    expect(freibetrag).toEqual(result);
  });
});
