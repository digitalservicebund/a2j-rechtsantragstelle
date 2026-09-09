import { render } from "@testing-library/react";
import { type FieldApi, useField } from "@rvf/react-router";
import HiddenInput from "../HiddenInput";

vi.mock("@rvf/react-router");

describe("HiddenInput", () => {
  it("should render an input hidden", () => {
    vi.mocked(useField).mockReturnValue({
      getInputProps: vi.fn().mockReturnValue({}),
    } as unknown as FieldApi<any>);
    const { getByRole } = render(<HiddenInput name="hiddenInput" />);
    const hiddenInput = getByRole("textbox", { hidden: true });
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute("readOnly");
  });

  it("should render multiple hidden inputs if the value is an object", () => {
    vi.mocked(useField).mockReturnValue({
      getInputProps: vi
        .fn()
        .mockReturnValue({ defaultValue: { key1: "value1", key2: "value2" } }),
    } as unknown as FieldApi<any>);

    const { getByTestId } = render(<HiddenInput name="hiddenInput" />);

    expect(getByTestId("hidden-input-hiddenInput.key1")).toBeInTheDocument();
    expect(getByTestId("hidden-input-hiddenInput.key2")).toBeInTheDocument();
  });
});
