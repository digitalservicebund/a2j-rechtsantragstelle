import { render } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import HiddenInput from "../HiddenInput";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
    getInputProps: vi.fn().mockReturnValue({
      id: "selectId",
    }),
    clearError: vi.fn(),
    validate: vi.fn(),
    touched: false,
    setTouched: vi.fn(),
  });
});

describe("HiddenInput", () => {
  it("should render an input hidden", () => {
    const { getByRole } = render(
      <HiddenInput name="hiddenInput" formId="formId" />,
    );

    expect(getByRole("textbox", { hidden: true })).toBeInTheDocument();
  });
});
