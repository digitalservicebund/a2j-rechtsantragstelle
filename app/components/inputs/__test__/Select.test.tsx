import { render } from "@testing-library/react";
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
    { widthProps: "16", expectedClassWidth: "w-[22ch]" },
    { widthProps: "24", expectedClassWidth: "w-[30ch]" },
    {
      widthProps: "36",
      expectedClassWidth: "w-[42ch] ds-input-select-width-54-36",
    },
    {
      widthProps: "54",
      expectedClassWidth: "w-[60ch] ds-input-select-width-54-36",
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
});
