import { isValidationGateBlocked } from "../newEngineFormular.server";

describe("isValidationGateBlocked", () => {
  const openSection = {
    "/section": { isDone: false, isReachable: true },
    "/abgabe": { isDone: false, isReachable: true },
  };
  const allDone = {
    "/section": { isDone: true, isReachable: true },
    "/abgabe": { isDone: false, isReachable: true },
  };

  it("blocks a validation gate while another section is still open", () => {
    expect(
      isValidationGateBlocked({
        triggerValidation: true,
        statusTree: openSection,
        stepId: "/abgabe/gate",
      }),
    ).toBe(true);
  });

  it("does not block a validation gate once every other section is done", () => {
    expect(
      isValidationGateBlocked({
        triggerValidation: true,
        statusTree: allDone,
        stepId: "/abgabe/gate",
      }),
    ).toBe(false);
  });

  it("never blocks a page that is not a validation gate", () => {
    expect(
      isValidationGateBlocked({
        triggerValidation: false,
        statusTree: openSection,
        stepId: "/section/page",
      }),
    ).toBe(false);
  });
});
