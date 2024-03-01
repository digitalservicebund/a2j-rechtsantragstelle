import { getButtonNavigationProps } from "~/util/buttonProps";

describe("getButtonNavigationProps", () => {
  it("to set labels for both buttons", () => {
    expect(
      getButtonNavigationProps({
        backButtonLabel: "Back",
        nextButtonLabel: "Next",
      }),
    ).toStrictEqual({
      back: { label: "Back", destination: undefined },
      next: { label: "Next" },
    });
  });

  it("to have no next button on final steps", () => {
    expect(
      getButtonNavigationProps({
        backButtonLabel: "Back",
        nextButtonLabel: "Next",
        isFinal: true,
      }),
    ).toStrictEqual({
      back: { label: "Back", destination: undefined },
      next: undefined,
    });
  });

  it("to set back destination", () => {
    expect(
      getButtonNavigationProps({
        backButtonLabel: "Back",
        nextButtonLabel: "Next",
        backDestination: "/previous",
      }),
    ).toStrictEqual({
      back: { label: "Back", destination: "/previous" },
      next: { label: "Next" },
    });
  });
});
