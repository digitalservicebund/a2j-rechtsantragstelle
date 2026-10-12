import { useField } from "@rvf/react-router";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { filterFormData } from "~/util/filterFormData";
import StandaloneCheckbox from "../StandaloneCheckbox";

const createMockFieldReturn = (overrides = {}, name = "agree") => ({
  getInputProps: vi.fn((props) => ({ name, ...props })),
  error: vi.fn(),
  defaultValue: vi.fn(),
  refs: {
    transient: vi.fn(),
    controlled: vi.fn(),
  },
  getControlProps: vi.fn(),
  getHiddenInputProps: vi.fn(),
  name: vi.fn(),
  onChange: vi.fn(),
  onBlur: vi.fn(),
  value: vi.fn(),
  setValue: vi.fn(),
  touched: vi.fn(),
  setTouched: vi.fn(),
  dirty: vi.fn(),
  setDirty: vi.fn(),
  clearError: vi.fn(),
  reset: vi.fn(),
  validate: vi.fn(),
  ...overrides,
});

vi.mock("@rvf/react-router", () => ({
  useField: vi.fn((name) => createMockFieldReturn({}, name)),
}));

const mockedUseField = vi.mocked(useField);

describe("StandaloneCheckbox", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedUseField.mockImplementation((name) =>
      createMockFieldReturn({}, name),
    );
  });

  it("renders the checkbox with a label", () => {
    render(
      <StandaloneCheckbox
        name="checkbox-name"
        text="Option"
        label="Checkbox Label"
        required
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Option" });
    expect(checkbox).toBeInTheDocument();

    const label = screen.getByText("Checkbox Label");
    expect(label).toBeInTheDocument();
  });

  it("submits off for an unchecked box once JS is available", () => {
    const form = document.createElement("form");
    render(<StandaloneCheckbox name="agree" text="Agree" required />, {
      container: form,
    });

    expect([...new FormData(form).getAll("agree")]).toEqual(["off"]);
  });

  it("submits on for a checked box once JS is available", () => {
    mockedUseField.mockImplementation(() =>
      createMockFieldReturn({ value: () => "on" }),
    );
    const form = document.createElement("form");
    const { getByRole } = render(
      <StandaloneCheckbox name="agree" text="Agree" required />,
      {
        container: form,
      },
    );
    (getByRole("checkbox") as HTMLInputElement).checked = true;

    expect([...new FormData(form).getAll("agree")]).toEqual(["on"]);
  });

  it("submits off after a previously checked box is unchecked", () => {
    const field = createMockFieldReturn({ value: vi.fn(() => "on") });
    mockedUseField.mockReturnValue(field);
    const form = document.createElement("form");
    const { rerender, getByRole } = render(
      <StandaloneCheckbox name="agree" text="Agree" required />,
      { container: form },
    );
    const checkbox = getByRole("checkbox") as HTMLInputElement;
    checkbox.checked = true;
    expect(new FormData(form).getAll("agree")).toEqual(["on"]);

    field.value.mockReturnValue("off");
    checkbox.checked = false;
    rerender(<StandaloneCheckbox name="agree" text="Agree" required />);

    expect(new FormData(form).getAll("agree")).toEqual(["off"]);
  });

  it("submits off without JS and lets a checked checkbox override it", () => {
    const form = document.createElement("form");
    form.innerHTML = renderToString(
      <StandaloneCheckbox name="agree" text="Agree" required />,
    );
    expect(filterFormData(new FormData(form))).toEqual({ agree: "off" });

    form.querySelector<HTMLInputElement>('input[type="checkbox"]')!.checked =
      true;
    expect(new FormData(form).getAll("agree")).toEqual(["off", "on"]);
    expect(filterFormData(new FormData(form))).toEqual({ agree: "on" });
  });

  it("renders the hidden input without JS, so unchecked boxes submit a value", () => {
    expect(
      renderToString(<StandaloneCheckbox name="agree" text="Agree" required />),
    ).toContain('type="hidden"');
  });

  it("displays an error message when an error exists", () => {
    mockedUseField.mockImplementation(() =>
      createMockFieldReturn({
        error: () => "checkbox error",
      }),
    );

    render(
      <StandaloneCheckbox
        name="checkbox-name"
        text="Checkbox Label"
        required
        errorMessage="checkbox error"
      />,
    );

    const errorMessage = screen.getByText("checkbox error");
    expect(errorMessage).toBeInTheDocument();
  });

  it("sets aria-required to true when required is provided", () => {
    render(
      <StandaloneCheckbox
        name="checkbox-name"
        text="Checkbox Label"
        errorMessage="some error"
        required
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-required", "true");
  });

  it("does set aria-required to false when required is false", () => {
    render(
      <StandaloneCheckbox
        name="checkbox-name"
        text="Checkbox Label"
        required={false}
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-required", "false");
  });

  it("calls transient ref when there is an error", () => {
    const controlledRefMock = vi.fn();
    const transientRefMock = vi.fn();

    mockedUseField.mockImplementation(() =>
      createMockFieldReturn({
        error: () => "some error",
        refs: {
          controlled: controlledRefMock,
          transient: transientRefMock,
        },
      }),
    );

    render(
      <StandaloneCheckbox
        name="checkbox-name"
        text="Checkbox Label"
        errorMessage="some error"
        required
      />,
    );

    expect(transientRefMock).toHaveBeenCalled();
  });

  it("applies error styling correctly when there is an error", () => {
    mockedUseField.mockImplementation(() =>
      createMockFieldReturn({
        error: () => "some error",
      }),
    );

    render(
      <StandaloneCheckbox
        name="checkbox-name"
        text="Checkbox Label"
        errorMessage="some error"
        required
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Checkbox Label" });
    expect(checkbox).toHaveClass("kern-form-check__checkbox--error");
  });
});
