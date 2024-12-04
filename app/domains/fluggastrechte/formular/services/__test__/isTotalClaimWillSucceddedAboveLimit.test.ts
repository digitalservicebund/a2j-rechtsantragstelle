import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import { getTotalCompensationClaim } from "../getTotalCompensationClaim";
import { isTotalClaimWillSucceddedAboveLimit } from "../isTotalClaimAboveLimit";

vi.mock("~/domains/fluggastrechte/services/airports/getCompensationPayment");
vi.mock("../getTotalCompensationClaim");

afterAll(() => {
  vi.clearAllMocks();
});

describe("isTotalClaimWillSucceddedAboveLimit", () => {
  it("should return false, given a claim and plus next person under 5000", () => {
    vi.mocked(getCompensationPayment).mockReturnValue("600");
    vi.mocked(getTotalCompensationClaim).mockReturnValue(3000);

    expect(isTotalClaimWillSucceddedAboveLimit({})).toBe(false);
  });

  it("should return true, given a claim and plus next person above 5000", () => {
    vi.mocked(getCompensationPayment).mockReturnValue("600");
    vi.mocked(getTotalCompensationClaim).mockReturnValue(5000);

    expect(isTotalClaimWillSucceddedAboveLimit({})).toBe(true);
  });
});
