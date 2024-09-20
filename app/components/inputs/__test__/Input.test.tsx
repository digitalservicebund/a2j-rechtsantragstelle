import { render } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import type { InputProps } from "../Input";
import Input from "../Input";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
    error: undefined,
    getInputProps: vi.fn().mockReturnValue({
      id: "inputId",
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

describe("Input", () => {
  const cases = [
    { widthProps: "3", expectedClassWidth: "w-[9ch]" },
    { widthProps: "5", expectedClassWidth: "w-[11ch]" },
    { widthProps: "7", expectedClassWidth: "w-[13ch]" },
    { widthProps: "10", expectedClassWidth: "w-[16ch]" },
    { widthProps: "16", expectedClassWidth: "w-[22ch]" },
    { widthProps: "24", expectedClassWidth: "w-[30ch]" },
    {
      widthProps: "36",
      expectedClassWidth: "w-[42ch] max-sm:w-full",
    },
    {
      widthProps: "54",
      expectedClassWidth: "w-[60ch] max-lg:w-full",
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
});
