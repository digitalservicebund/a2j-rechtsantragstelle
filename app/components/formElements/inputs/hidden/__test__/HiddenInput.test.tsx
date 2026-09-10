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
  });

  it("should render multiple hidden inputs if the value is an object", () => {
    const mockGetHiddenInputProps = vi.fn();
    vi.mocked(useField).mockReturnValue({
      getInputProps: vi
        .fn()
        .mockReturnValue({ defaultValue: { key1: "value1", key2: "value2" } }),
      getHiddenInputProps: mockGetHiddenInputProps,
    } as unknown as FieldApi<any>);

    const { getByTestId } = render(<HiddenInput name="hiddenInput" />);

    expect(getByTestId("hidden-input-hiddenInput.key1")).toBeInTheDocument();
    expect(getByTestId("hidden-input-hiddenInput.key2")).toBeInTheDocument();
    expect(mockGetHiddenInputProps).toHaveBeenCalledTimes(2);
  });

  it("should filter out empty object values", () => {
    const mockGetHiddenInputProps = vi.fn();
    vi.mocked(useField).mockReturnValue({
      getInputProps: vi
        .fn()
        .mockReturnValue({ defaultValue: { key1: "value1", key2: "" } }),
      getHiddenInputProps: mockGetHiddenInputProps,
    } as unknown as FieldApi<any>);

    const { getByTestId, queryByTestId } = render(
      <HiddenInput name="hiddenInput" />,
    );

    expect(getByTestId("hidden-input-hiddenInput.key1")).toBeInTheDocument();
    expect(queryByTestId("hidden-input-hiddenInput.key2")).toBeNull();
    expect(mockGetHiddenInputProps).toHaveBeenCalledTimes(1);
  });
});
