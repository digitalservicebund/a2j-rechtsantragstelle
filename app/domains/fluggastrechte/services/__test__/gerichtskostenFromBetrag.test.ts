import { gerichtskostenFromBetrag } from "../gerichtskosten";

vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  globalFeatureFlags: {
    showFGROnlineVerfahren: true,
  },
}));

describe("gerichtskostenFromBetrag", () => {
  it("uses shared online-verfahren values when showFGROnlineVerfahren is enabled", () => {
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
});
