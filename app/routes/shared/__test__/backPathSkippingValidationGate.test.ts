import { backPathSkippingValidationGate } from "../newEngineFormular.server";

const isValidationGate = (path: string) => path === "/abgabe/gate";
const prevPathOf = (path: string) =>
  path === "/abgabe/gate" ? "/last-section/last-page" : undefined;

describe("backPathSkippingValidationGate", () => {
  const allDone = {
    "/last-section": { isDone: true, isReachable: true },
    "/abgabe": { isDone: false, isReachable: true },
  };

  it("skips a validation gate that would redirect forward again", () => {
    expect(
      backPathSkippingValidationGate({
        prevPath: "/abgabe/gate",
        statusTree: allDone,
        isValidationGate,
        prevPathOf,
      }),
    ).toBe("/last-section/last-page");
  });

  it("keeps the validation gate while another section is still open", () => {
    expect(
      backPathSkippingValidationGate({
        prevPath: "/abgabe/gate",
        statusTree: {
          ...allDone,
          "/last-section": { isDone: false, isReachable: true },
        },
        isValidationGate,
        prevPathOf,
      }),
    ).toBe("/abgabe/gate");
  });

  it("keeps a previous page that is not a validation gate", () => {
    expect(
      backPathSkippingValidationGate({
        prevPath: "/last-section/last-page",
        statusTree: allDone,
        isValidationGate,
        prevPathOf,
      }),
    ).toBe("/last-section/last-page");
  });
});
