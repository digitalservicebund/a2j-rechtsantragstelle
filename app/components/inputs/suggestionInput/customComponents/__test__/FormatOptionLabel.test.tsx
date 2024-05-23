import { render } from "@testing-library/react";
import FormatOptionLabel from "../FormatOptionLabel";

describe("FormatOptionLabel", () => {
  it("it should render a the label if the context is a value", () => {
    const dataListOption = [{ label: "Paris", value: " any value" }];

    const { getByText } = render(
      FormatOptionLabel(dataListOption[0], {
        context: "value",
        inputValue: "Paris",
        selectValue: dataListOption,
      }),
    );

    expect(getByText(dataListOption[0].label)).toBeInTheDocument();
  });

  it("it should render a the label and the subDescription without highlight if the context is a menu", () => {
    const dataListOption = [
      { label: "Paris", subDescription: "Paris, France", value: " any value" },
    ];

    const { queryByTestId } = render(
      FormatOptionLabel(dataListOption[0], {
        context: "menu",
        inputValue: "any text",
        selectValue: dataListOption,
      }),
    );

    expect(
      queryByTestId("suggestion-item-label-highlight"),
    ).not.toBeInTheDocument();

    expect(
      queryByTestId("suggestion-item-subDescription-highlight"),
    ).not.toBeInTheDocument();
  });

  it("it should render a the label and the subDescription with highlight if the context is a menu", () => {
    const dataListOption = [
      {
        label: "Paris Charles de Gaulle",
        subDescription: "Paris, France",
        value: " any value",
      },
    ];

    const mockInputValue = "Paris";

    const { queryByTestId } = render(
      FormatOptionLabel(dataListOption[0], {
        context: "menu",
        inputValue: mockInputValue,
        selectValue: dataListOption,
      }),
    );

    expect(
      queryByTestId("suggestion-item-label-highlight"),
    ).toBeInTheDocument();
    expect(queryByTestId("suggestion-item-label-highlight")?.innerHTML).toBe(
      mockInputValue,
    );

    expect(
      queryByTestId("suggestion-item-subDescription-highlight"),
    ).toBeInTheDocument();
    expect(
      queryByTestId("suggestion-item-subDescription-highlight")?.innerHTML,
    ).toBe(mockInputValue);
  });
});
