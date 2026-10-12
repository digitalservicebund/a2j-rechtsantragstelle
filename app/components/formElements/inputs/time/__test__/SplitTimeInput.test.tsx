import { type FieldApi, useField } from "@rvf/react-router";
import { SplitTimeInput } from "../SplitTimeInput";
import { render } from "@testing-library/react";

vi.mock("@rvf/react-router");

const mockUseField = (error?: string | null, touched: boolean = false) => {
  return {
    error: () => error,
    touched: () => touched,
    getInputProps: ({ id }: { id: string }) => ({ id }),
    getControlProps: () => ({}),
  } as FieldApi<any>;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useField).mockReturnValue(mockUseField());
});

describe("SplitTimeInput", () => {
  it("renders hour and minute input fields with correct labels", () => {
    const { getByLabelText } = render(<SplitTimeInput name="time" />);

    const hourInput = getByLabelText("Stunde");
    expect(hourInput).toBeInTheDocument();
    const minuteInput = getByLabelText("Minute");
    expect(minuteInput).toBeInTheDocument();
  });

  it("renders legend", () => {
    const { getByText } = render(
      <SplitTimeInput name="time" label="Time flight" />,
    );

    const legend = getByText("Time flight");
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe("LEGEND");
  });

  it("renders suffix when provided", () => {
    const { getByText } = render(
      <SplitTimeInput name="time" label="Time flight" suffix="Optional" />,
    );

    expect(getByText("Optional")).toBeInTheDocument();
  });

  it("renders helper text and aria-describedby when provided", () => {
    const { getByText } = render(
      <SplitTimeInput name="time" label="Time flight" helperText="Helper" />,
    );

    expect(getByText("Helper")).toBeInTheDocument();
    expect(getByText("Time flight").parentElement).toHaveAttribute(
      "aria-describedby",
      "time-helper",
    );
  });

  it("renders an error message if the top-level field has an error", () => {
    vi.mocked(useField).mockImplementation((name) => {
      const errorMessage = name === "time" ? "someError" : null;
      return mockUseField(errorMessage);
    });
    const { getByText } = render(<SplitTimeInput name="time" />);

    expect(getByText("someError")).toBeInTheDocument();
  });

  it("renders an error message if any one field has an error, and all have been touched", () => {
    vi.mocked(useField).mockImplementation((name) => {
      const errorMessage = name === "time.hour" ? null : "someError";
      const hasBeenTouched = name !== "time";
      return mockUseField(errorMessage, hasBeenTouched);
    });
    const { getByText } = render(<SplitTimeInput name="time" />);

    expect(getByText("someError")).toBeInTheDocument();
  });
});
