import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/services/court/getCourtCost";

describe("gerichtskostenFromBetrag (GeldEinklagen)", () => {
  it("returns expected court cost", () => {
    expect(gerichtskostenFromBetrag(300)).toBe(80);
    expect(gerichtskostenFromBetrag(750)).toBe(122);
    expect(gerichtskostenFromBetrag(1250)).toBe(164);
    expect(gerichtskostenFromBetrag(1750)).toBe(206);
    expect(gerichtskostenFromBetrag(2500)).toBe(251);
    expect(gerichtskostenFromBetrag(3500)).toBe(296);
    expect(gerichtskostenFromBetrag(4500)).toBe(341);
    expect(gerichtskostenFromBetrag(5500)).toBe(386);
    expect(gerichtskostenFromBetrag(6500)).toBe(431);
    expect(gerichtskostenFromBetrag(7500)).toBe(476);
    expect(gerichtskostenFromBetrag(8500)).toBe(521);
    expect(gerichtskostenFromBetrag(9500)).toBe(566);
  });

  it("handles exact boundaries and off-by-one correctly", () => {
    // 500 bracket
    expect(gerichtskostenFromBetrag(500)).toBe(80);
    expect(gerichtskostenFromBetrag(501)).toBe(122);

    // 1000 bracket
    expect(gerichtskostenFromBetrag(1000)).toBe(122);
    expect(gerichtskostenFromBetrag(1001)).toBe(164);

    // 1500 bracket
    expect(gerichtskostenFromBetrag(1500)).toBe(164);
    expect(gerichtskostenFromBetrag(1501)).toBe(206);

    // 2000 bracket
    expect(gerichtskostenFromBetrag(2000)).toBe(206);
    expect(gerichtskostenFromBetrag(2001)).toBe(251);

    // 3000 bracket
    expect(gerichtskostenFromBetrag(3000)).toBe(251);
    expect(gerichtskostenFromBetrag(3001)).toBe(296);

    // 4000 bracket
    expect(gerichtskostenFromBetrag(4000)).toBe(296);
    expect(gerichtskostenFromBetrag(4001)).toBe(341);

    // 5000 bracket
    expect(gerichtskostenFromBetrag(5000)).toBe(341);
    expect(gerichtskostenFromBetrag(5001)).toBe(386);

    // 6000 bracket
    expect(gerichtskostenFromBetrag(6000)).toBe(386);
    expect(gerichtskostenFromBetrag(6001)).toBe(431);

    // 7000 bracket
    expect(gerichtskostenFromBetrag(7000)).toBe(431);
    expect(gerichtskostenFromBetrag(7001)).toBe(476);

    // 8000 bracket
    expect(gerichtskostenFromBetrag(8000)).toBe(476);
    expect(gerichtskostenFromBetrag(8001)).toBe(521);

    // 9000 bracket
    expect(gerichtskostenFromBetrag(9000)).toBe(521);
    expect(gerichtskostenFromBetrag(9001)).toBe(566);
  });
});
