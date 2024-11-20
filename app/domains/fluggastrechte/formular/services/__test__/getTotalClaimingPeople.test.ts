import type { FluggastrechtContext } from "../../context";
import { getTotalClaimingPeople } from "../getTotalClaimingPeople";

describe("getTotalClaimingPeople", () => {
  it("should return 1 when there are no additional people", () => {
    const context: FluggastrechtContext = {};
    const result = getTotalClaimingPeople(context);
    expect(result).toBe(1);
  });

  it("should return 1 when weiterePersonen is an empty array (add & delete)", () => {
    const context: FluggastrechtContext = { weiterePersonen: [] };
    const result = getTotalClaimingPeople(context);
    expect(result).toBe(1);
  });

  it("should return 2 when there is one additional person", () => {
    const context: FluggastrechtContext = {
      weiterePersonen: [{ vorname: "erster", nachname: "person" }],
    };
    const result = getTotalClaimingPeople(context);
    expect(result).toBe(2);
  });
});
