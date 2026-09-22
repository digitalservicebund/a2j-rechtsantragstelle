import { useField } from "@rvf/react-router";
import { ReuseBeweisCheckbox } from "../ReuseBeweisCheckbox";
import { render } from "@testing-library/react";

vi.mock("@rvf/react-router", () => ({
  useField: vi.fn(),
}));

vi.mocked(useField).mockImplementation(
  () =>
    ({
      value: vi.fn(),
      error: () => "required",
      getInputProps: () => ({
        id: "text",
        value: "",
        defaultValue: "default",
        onChange: vi.fn(),
        setValue: vi.fn(),
      }),
    }) as any,
);

const mockUseField = (error?: string): void => {
  vi.mocked(useField).mockImplementation(
    () =>
      ({
        value: vi.fn(),
        error: vi.fn().mockReturnValue(error),
        getInputProps: () => ({
          id: "text",
          value: "",
          defaultValue: "default",
          onChange: vi.fn(),
          setValue: vi.fn(),
        }),
      }) as any,
  );
};

beforeEach(() => {
  mockUseField();
});

describe("ReuseBeweisCheckbox", () => {
  it("should render the checkboxes with the options", () => {
    const options = [
      {
        label: "label 1",
        option: "option 1",
      },
      {
        labelBold: "label bold 2",
        label: "label 2",
        option: "option 2",
      },
    ];

    const { getByText } = render(
      <ReuseBeweisCheckbox name="reuseOption" options={options} />,
    );
    expect(getByText("label 1")).toBeInTheDocument();
    expect(getByText("label bold 2")).toBeInTheDocument();
    expect(getByText("label 2")).toBeInTheDocument();
  });

  it("should display an error in case exist", () => {
    mockUseField("some error");

    const options = [
      {
        label: "label 1",
        option: "option-1",
      },
    ];

    const { getByText, getByRole } = render(
      <ReuseBeweisCheckbox name="reuseOption" options={options} />,
    );

    expect(getByText("some error")).toBeInTheDocument();
    const checkbox = getByRole("checkbox");
    expect(checkbox).toHaveClass("kern-form-check__checkbox--error");
  });
});
