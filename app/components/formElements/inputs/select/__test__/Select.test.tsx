import { render, screen } from "@testing-library/react";
import Select from "../Select";
import { translations } from "~/services/translations/translations";

const getErrorMock = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn().mockReturnValue({
      id: "selectId",
    }),
    error: getErrorMock,
  }),
}));

describe("Select", () => {
  it("should render options", () => {
    const options = [
      { value: "1", text: "One", preSelected: false },
      { value: "2", text: "Two", preSelected: true },
    ];
    render(<Select name="select" options={options} />);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("should set default value to preSelected option", () => {
    const options = [
      { value: "1", text: "One", preSelected: false },
      { value: "2", text: "Two", preSelected: true },
    ];
    render(<Select name="select" options={options} />);
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveValue("2");
  });

  it("should not have an empty option if a preSelected option is provided", () => {
    const options = [
      { value: "1", text: "One", preSelected: false },
      { value: "2", text: "Two", preSelected: true },
    ];
    render(<Select name="select" options={options} />);
    expect(
      screen.queryByText(translations.select.placeholder.de),
    ).not.toBeInTheDocument();
  });

  it("should render label when provided", () => {
    render(<Select name="select" options={[]} label="My Label" />);
    expect(screen.getByText("My Label")).toBeInTheDocument();
  });

  it("should render suffix when provided", () => {
    render(
      <Select name="select" options={[]} label="My Label" suffix="Optional" />,
    );
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("should render placeholder", () => {
    render(<Select name="select" options={[]} />);
    const placeholder = screen.getByText(translations.select.placeholder.de);
    expect(placeholder).toHaveValue("");
  });

  it("should apply error class when field has error", () => {
    getErrorMock.mockReturnValue("required");
    render(<Select name="select" options={[]} />);
    expect(screen.getByTestId("select-wrapper")).toHaveClass(
      "kern-form-input__select-wrapper--error",
    );
  });
  it("should have aria-required attribute set to true if errorMessages contain inputRequired", () => {
    render(
      <Select
        name="select"
        options={[]}
        label="Test Label"
        errorMessages={[{ code: "required", text: "error" }]}
      />,
    );
    const element = screen.getByRole("combobox");
    expect(element).toHaveAttribute("aria-required", "true");
  });

  it("should have aria-required attribute set to false if errorMessages do not contain inputRequired", () => {
    render(
      <Select
        name="select"
        options={[]}
        label="Test Label"
        errorMessages={undefined}
      />,
    );
    const element = screen.getByRole("combobox");
    expect(element).toHaveAttribute("aria-required", "false");
  });

  it("should show the translation placeholder as the empty option", () => {
    render(<Select name="select" options={[]} />);
    expect(
      screen.getByText(translations.select.placeholder.de),
    ).toBeInTheDocument();
  });
});
