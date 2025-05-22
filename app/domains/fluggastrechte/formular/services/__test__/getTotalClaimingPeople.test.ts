import type { FluggastrechteUserData } from "../../userData";
import { getTotalClaimingPeople } from "../getTotalClaimingPeople";

describe("getTotalClaimingPeople", () => {
  it("should return 1 when there are no additional people", () => {
    const context: FluggastrechteUserData = {};
    const result = getTotalClaimingPeople(context);
    expect(result).toBe(1);
  });

  it("should return 1 when weiterePersonen is an empty array (add & delete)", () => {
    const context: FluggastrechteUserData = { weiterePersonen: [] };
    const result = getTotalClaimingPeople(context);
    expect(result).toBe(1);
  });

  it("should return 2 when there is one additional person", () => {
    const context: FluggastrechteUserData = {
      weiterePersonen: [{ vorname: "erster", nachname: "person" }],
    };
    const result = getTotalClaimingPeople(context);
    expect(result).toBe(2);
  });
});
