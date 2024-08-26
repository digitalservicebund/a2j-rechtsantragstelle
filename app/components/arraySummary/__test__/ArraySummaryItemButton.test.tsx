import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import ArraySummaryItemButton from "../ArraySummaryItemButton";

const translations = {
  arrayEditButtonLabel: "arrayEditButtonLabel",
  arrayDeleteButtonLabel: "arrayDeleteButtonLabel",
};

describe("ArraySummaryItemButton", () => {
  it("should render the component with the given translation", () => {
    const ArraySummaryItemButtonWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <ArraySummaryItemButton
            category={"anyCategory"}
            csrf={"AnyCsrf"}
            initialInputUrl={"/"}
            itemIndex={0}
            url={"/"}
            translations={translations}
          />
        ),
      },
    ]);

    const { getByText } = render(<ArraySummaryItemButtonWithRemixStub />);

    expect(getByText(translations["arrayEditButtonLabel"])).toBeInTheDocument();

    expect(
      getByText(translations["arrayDeleteButtonLabel"]),
    ).toBeInTheDocument();
  });

  it("should render the button container with the className props", () => {
    const expectedClassName = "anyClassName";

    const ArraySummaryItemButtonWithRemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <ArraySummaryItemButton
            category={"anyCategory"}
            csrf={"AnyCsrf"}
            initialInputUrl={"/"}
            itemIndex={0}
            url={"/"}
            translations={translations}
            className={expectedClassName}
          />
        ),
      },
    ]);

    const { getByTestId } = render(<ArraySummaryItemButtonWithRemixStub />);

    expect(getByTestId("buttonContainer")).toHaveClass(expectedClassName);
  });
});
