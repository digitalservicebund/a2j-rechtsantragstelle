import * as rvfReactRouter from "@rvf/react-router";
import { render, screen } from "@testing-library/react";
import type { InputProps } from "../Input";
import Input from "../Input";

vi.mock("@rvf/react-router", () => ({
  useField: vi.fn(),
}));

beforeEach(() =>
  vi.spyOn(rvfReactRouter, "useField").mockReturnValue({
    error: vi.fn(),
    getInputProps: vi.fn().mockReturnValue({
      id: "inputId",
      placeholder: "Any placeholder",
    }),
    clearError: vi.fn(),
    validate: vi.fn(),
    touched: vi.fn(),
    setTouched: vi.fn(),
    getControlProps: vi.fn(),
    getHiddenInputProps: vi.fn(),
    refs: {
      controlled: vi.fn(),
      transient: vi.fn(),
    },
    name: vi.fn(),
    onChange: vi.fn(),
    onBlur: vi.fn(),
    value: vi.fn(),
    setValue: vi.fn(),
    defaultValue: vi.fn(),
    dirty: vi.fn(),
    setDirty: vi.fn(),
    reset: vi.fn(),
  }),
);

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("Input", () => {
  const cases = [
    { widthProps: "3", expectedClassWidth: "max-w-[9ch]" },
    { widthProps: "5", expectedClassWidth: "max-w-[11ch]" },
    { widthProps: "7", expectedClassWidth: "max-w-[13ch]" },
    { widthProps: "10", expectedClassWidth: "max-w-[16ch]" },
    { widthProps: "16", expectedClassWidth: "max-w-[22ch]" },
    { widthProps: "24", expectedClassWidth: "max-w-[30ch]" },
    {
      widthProps: "36",
      expectedClassWidth: "max-w-[42ch]",
    },
    {
      widthProps: "54",
      expectedClassWidth: "max-w-[60ch]",
    },
  ];

  test.each(cases)(
    "should render Input component with width $expectedClassWidth given props width with the value $widthProps",
    ({ widthProps, expectedClassWidth }) => {
      const { container } = render(
        <Input
          name="input"
          width={widthProps as InputProps["width"]}
          label="Test Label"
          formId="formId"
        />,
      );

      expect(container.querySelector("#inputId")).toHaveClass(
        expectedClassWidth,
      );
    },
  );

  describe("Input field with helper text", () => {
    test("Displays helper text if provided", () => {
      render(
        <Input
          name="input"
          width="54"
          label="Test Label"
          formId="formId"
          helperText="Test Helper Text"
        />,
      );
      expect(screen.getByText("Test Helper Text")).toBeInTheDocument();
    });
  });
  describe("Input field with aria-required attribute", () => {
    it("has aria-required attribute set to true if errorMessages contain inputRequired", () => {
      render(
        <Input
          name="test"
          errorMessages={[
            { code: "required", text: "error" },
            {
              code: "invalid",
              text: "Bitte geben Sie eine gültige Uhrzeit ein.",
            },
          ]}
          formId="formId"
        />,
      );
      const element = screen.getByRole("textbox");
      expect(element).toHaveAttribute("aria-required", "true");
    });

    it("has aria-required attribute set to false if errorMessages do not contain inputRequired", () => {
      render(<Input name="test" errorMessages={undefined} formId="formId" />);
      const element = screen.getByRole("textbox");
      expect(element).toHaveAttribute("aria-required", "false");
    });
  });
});
