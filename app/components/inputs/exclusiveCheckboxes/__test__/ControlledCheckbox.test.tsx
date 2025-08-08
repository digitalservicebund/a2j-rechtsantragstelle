import { fireEvent, render } from "@testing-library/react";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { ControlledCheckbox } from "~/components/inputs/exclusiveCheckboxes/ControlledCheckbox";

vi.mock("~/components/hooks/useJsAvailable");
vi.mocked(useJsAvailable).mockReturnValue(true);

describe("ControlledCheckbox", () => {
  it("should render the correct markup", () => {
    const name = "checky";
    const label = "A really cool checkbox label.";
    const { getByLabelText, getByRole, queryByTestId } = render(
      <ControlledCheckbox
        name={name}
        label={label}
        value={"on"}
        onChange={() => undefined}
      />,
    );
    expect(getByLabelText(label)).toBeInTheDocument();
    const checkbox = getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);
    expect(checkbox.name).toBe(name);
    expect(
      queryByTestId("controlled-checkbox-hidden-input"),
    ).not.toBeInTheDocument();
  });

  it("should call the change handler when the value changes", () => {
    const handler = vi.fn();
    const { getByRole } = render(
      <ControlledCheckbox
        name={"checky"}
        label={"Cool label"}
        value={"on"}
        onChange={handler}
      />,
    );
    const checkbox = getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(handler).toHaveBeenCalledWith("checky", "off");
  });

  it("should show a hidden input if javascript is not available", () => {
    vi.mocked(useJsAvailable).mockReturnValueOnce(false);
    const { getByRole, getByTestId } = render(
      <ControlledCheckbox
        name={"checky"}
        label={"Cool label"}
        value={"on"}
        onChange={() => undefined}
      />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveProperty("value", "on");
    const hiddenInput = getByTestId("controlled-checkbox-hidden-input");
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveProperty("value", "off");
  });

  it('should show a hidden input if the value is "off"', () => {
    const { getByRole, getByTestId } = render(
      <ControlledCheckbox
        name={"checky"}
        label={"Cool label"}
        value={"off"}
        onChange={() => undefined}
      />,
    );
    const checkbox = getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveProperty("value", "off");
    const hiddenInput = getByTestId("controlled-checkbox-hidden-input");
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveProperty("value", "off");
  });
});
