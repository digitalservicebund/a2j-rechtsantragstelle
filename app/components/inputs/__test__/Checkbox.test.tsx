import * as rvfReactRouter from "@rvf/react-router";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Checkbox, { CheckboxValue } from "../Checkbox";

vi.mock("@rvf/react-router", () => ({
  useField: vi.fn(),
}));

describe("Checkbox Component", () => {
  beforeEach(() => {
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
    });
  });

  afterEach(() => {
    vi.restoreAllMocks(); // This clears all mocks after each test
  });

  it("renders the checkbox with a label", () => {
    render(<Checkbox name="checkbox-name" label="Checkbox Label" required />);
    const checkbox = screen.getByRole("checkbox", { name: "Checkbox Label" });
    expect(checkbox).toBeInTheDocument();

    const label = screen.getByText("Checkbox Label");
    expect(label).toBeInTheDocument();
  });

  it("renders the hidden input when the checkbox is not checked", () => {
    render(
      <Checkbox name="checkbox-name" label="Another Checkbox Label" required />,
    );
    const hiddenInput = screen.getByDisplayValue(CheckboxValue.off);
    expect(hiddenInput).toBeInTheDocument();
  });

  it("hides the hidden input when the checkbox is checked", () => {
    render(
      <Checkbox name="checkbox-name" label="Another Checkbox Label" required />,
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const hiddenInput = screen.queryByDisplayValue(CheckboxValue.off);
    expect(hiddenInput).not.toBeInTheDocument();
  });

  it("renders the checkbox as required", () => {
    render(<Checkbox name="checkbox-name" label="Checkbox Label" required />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeRequired();
  });
});
