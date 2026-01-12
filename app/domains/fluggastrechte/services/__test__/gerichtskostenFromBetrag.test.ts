import { gerichtskostenFromBetrag } from "../gerichtskosten";

describe("gerichtskostenFromBetrag", () => {
  it("should return correct court costs for various amounts", () => {
    expect(gerichtskostenFromBetrag(300)).toBe(120);
    expect(gerichtskostenFromBetrag(750)).toBe(183);
    expect(gerichtskostenFromBetrag(1250)).toBe(246);
    expect(gerichtskostenFromBetrag(1750)).toBe(309);
    expect(gerichtskostenFromBetrag(2500)).toBe(376.5);
    expect(gerichtskostenFromBetrag(3500)).toBe(444);
    expect(gerichtskostenFromBetrag(4500)).toBe(511.5);
    expect(gerichtskostenFromBetrag(5500)).toBe(579);
    expect(gerichtskostenFromBetrag(6500)).toBe(646.5);
    expect(gerichtskostenFromBetrag(7500)).toBe(714);
    expect(gerichtskostenFromBetrag(8500)).toBe(781.5);
    expect(gerichtskostenFromBetrag(9500)).toBe(849);
  });
});
