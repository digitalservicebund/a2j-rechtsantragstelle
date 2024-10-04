import { rechtsschutzversicherungDone } from "../doneFunctions";

describe("determine if rechtsschutzversicherung is done", () => {
  it("will be true if no insurance or organization is present", () => {
    expect(
      rechtsschutzversicherungDone({
        context: { hasRsv: "no", hasRsvThroughOrg: "no" },
      }),
    ).toBeTruthy();
  });
  it("will be true if insurance or organization dont cover the cost", () => {
    expect(
      rechtsschutzversicherungDone({
        context: {
          hasRsv: "yes",
          hasRsvThroughOrg: "yes",
          hasRsvCoverage: "no",
          hasOrgCoverage: "no",
        },
      }),
    ).toBeTruthy();
  });
  it("will be false if insurance or organization cover the cost", () => {
    expect(
      rechtsschutzversicherungDone({
        context: {
          hasRsv: "yes",
          hasRsvThroughOrg: "yes",
          hasRsvCoverage: "yes",
          hasOrgCoverage: "no",
        },
      }),
    ).toBeFalsy();
    expect(
      rechtsschutzversicherungDone({
        context: {
          hasRsv: "yes",
          hasRsvThroughOrg: "yes",
          hasRsvCoverage: "no",
          hasOrgCoverage: "yes",
        },
      }),
    ).toBeFalsy();
  });
});
