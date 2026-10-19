import { toCmsStepId } from "../toCmsStepId";

describe("toCmsStepId", () => {
  it("keeps a regular stepId", () => {
    expect(toCmsStepId("/persoenliche-daten/name")).toBe(
      "/persoenliche-daten/name",
    );
  });

  it("removes the ergebnis prefix of a result page", () => {
    expect(toCmsStepId("/ergebnis/auslandsbezug")).toBe("/auslandsbezug");
  });

  it("removes the array wildcard of an array page", () => {
    expect(toCmsStepId("/elternteile/#/daten")).toBe("/elternteile/daten");
  });

  it("removes every array wildcard of a nested array page", () => {
    expect(toCmsStepId("/elternteile/#/kinder/#/daten")).toBe(
      "/elternteile/kinder/daten",
    );
  });
});
