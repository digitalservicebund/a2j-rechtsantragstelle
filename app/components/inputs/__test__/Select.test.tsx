import { render, screen } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import type { SelectProps } from "../Select";
import Select from "../Select";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
    error: undefined,
    getInputProps: vi.fn().mockReturnValue({
      id: "selectId",
      placeholder: "Any placeholder",
    }),
    clearError: vi.fn(),
    validate: vi.fn(),
    touched: false,
    setTouched: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("Select", () => {
  const cases = [
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
    "should render Select component with width $expectedClassWidth given props width with the value $widthProps",
    ({ widthProps, expectedClassWidth }) => {
      const { container } = render(
        <Select
          name="select"
          options={[]}
          width={widthProps as SelectProps["width"]}
          label="Test Label"
          formId="formId"
        />,
      );

      expect(container.querySelector("#selectId")).toHaveClass(
        expectedClassWidth,
      );
    },
  );

  describe("Input field with aria-required attribute", () => {
    it("has aria-required attribute set to true if errorMessages contain inputRequired", () => {
      render(
        <Select
          name="select"
          options={[]}
          label="Test Label"
          formId="formId"
          errorMessages={[
            { code: "required", text: "error" },
            {
              code: "invalid",
              text: "Bitte geben Sie eine gültige Uhrzeit ein.",
            },
          ]}
        />,
      );
      const element = screen.getByRole("combobox");
      expect(element).toHaveAttribute("aria-required", "true");
    });

    it("has aria-required attribute set to false if errorMessages do not contain inputRequired", () => {
      render(
        <Select
          name="select"
          options={[]}
          label="Test Label"
          formId="formId"
          errorMessages={undefined}
        />,
      );
      const element = screen.getByRole("combobox");
      expect(element).toHaveAttribute("aria-required", "false");
    });
  });
});
