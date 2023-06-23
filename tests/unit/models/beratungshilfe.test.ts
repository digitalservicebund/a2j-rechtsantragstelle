import { freibetrag } from "~/models/beratungshilfe";

describe("freibetrag", () => {
  it("should return 572 when single not working", () => {
    expect(
      freibetrag({
        working: false,
        partnership: false,
      })
    ).toEqual(57200);
  });

  it("should return 572 + 251 when single working", () => {
    expect(
      freibetrag({
        working: true,
        partnership: false,
      })
    ).toEqual(57200 + 25100);
  });

  it("should return 572 + 552 when partner not working", () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
      })
    ).toEqual(57200 + 55200);
  });

  it("should return 572 + 552 - partner income when partner working smaller than 552", () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
        partnerIncome: 50000,
      })
    ).toEqual(57200 + 55200 - 50000);
  });

  it("should return 572 when partner working bigger than 552", () => {
    expect(
      freibetrag({
        working: false,
        partnership: true,
        partnerIncome: 80000,
      })
    ).toEqual(57200);
  });

  it("should return 572 + 350 when 1 child 0-6 not working", () => {
    expect(
      freibetrag({
        childrenBelow6: 1,
      })
    ).toEqual(57200 + 35000);
  });

  it("should return 572 + 350 when 1 child 0-6 not working", () => {
    expect(
      freibetrag({
        childrenBelow6: 1,
      })
    ).toEqual(57200 + 35000);
  });

  it("should return 572 + 2*350 when 2 children 0-6 not working", () => {
    expect(
      freibetrag({
        childrenBelow6: 2,
      })
    ).toEqual(57200 + 2 * 35000);
  });

  it("should return 572 + 350 - child income when 1 child 0-6 working less than 350", () => {
    expect(
      freibetrag({
        childrenBelow6: 1,
        childrenIncome: 10000,
      })
    ).toEqual(57200 + 35000 - 10000);
  });

  it("should return 572 when 1 child 0-6 working more than 350", () => {
    expect(
      freibetrag({
        childrenBelow6: 1,
        childrenIncome: 80000,
      })
    ).toEqual(57200);
  });

  it("should return 572 + 2*350 - children income when 2 children 0-6 working less than 350", () => {
    expect(
      freibetrag({
        childrenBelow6: 2,
        childrenIncome: 10000,
      })
    ).toEqual(57200 + 2 * 35000 - 10000);
  });

  it("should return 572 + 2*350 - children income when 2 children 0-6 working more than 350 less than 2*350", () => {
    expect(
      freibetrag({
        childrenBelow6: 2,
        childrenIncome: 50000,
      })
    ).toEqual(57200 + 2 * 35000 - 50000);
  });

  it("should handle NaN children as zero children", () => {
    expect(
      freibetrag({
        childrenBelow6: NaN,
      })
    ).toEqual(57200);
  });
});
