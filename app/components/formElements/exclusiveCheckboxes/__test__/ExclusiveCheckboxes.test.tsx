import { type FieldApi, useField } from "@rvf/react-router";
import { fireEvent, render } from "@testing-library/react";
import { ExclusiveCheckboxes } from "~/components/formElements/exclusiveCheckboxes/ExclusiveCheckboxes";
import { type ExclusiveCheckboxes as ExclusiveCheckboxesType } from "~/services/validation/checkedCheckbox";

vi.mock("@rvf/react-router");

const errorMock = vi.fn();
const mockFieldValidator = vi.fn();

const defaultValues = {
  checkboxOne: "on",
  checkboxTwo: "on",
  checkboxThree: "on",
  none: "off",
} satisfies ExclusiveCheckboxesType;

const mockValueFunc = vi.fn().mockReturnValue(defaultValues);

vi.mocked(useField).mockReturnValue({
  value: mockValueFunc,
  setValue: vi.fn(),
  validate: mockFieldValidator,
  error: errorMock,
  onChange: vi.fn(),
} as unknown as FieldApi<unknown>);

const options = [
  "checkboxOne",
  "checkboxTwo",
  "checkboxThree",
  "none",
] as const;

const noneLabel = "None of the above";
const firstCheckboxLabel = "One";
const labels = {
  checkboxOne: firstCheckboxLabel,
  checkboxTwo: "Two",
  checkboxThree: "Three",
  none: noneLabel,
};

describe("ExclusiveCheckboxes", () => {
  it("should render all checkboxes", () => {
    const { getAllByRole } = render(
      <ExclusiveCheckboxes name={""} options={options} />,
    );
    expect(getAllByRole("checkbox")).toHaveLength(4);
  });

  it("should render an error message", () => {
    errorMock.mockReturnValue("error message");
    const { getByText } = render(
      <ExclusiveCheckboxes name={""} options={options} />,
    );
    expect(getByText("error message")).toBeInTheDocument();
  });

  it("should call the field validation function when a value changes", () => {
    const { getAllByRole } = render(
      <ExclusiveCheckboxes name={""} options={options} />,
    );
    const firstCheckbox = getAllByRole("checkbox")[0] as HTMLInputElement;
    fireEvent.click(firstCheckbox);
    expect(mockFieldValidator).toHaveBeenCalledTimes(1);
  });

  it('should uncheck all checkboxes when "None of the above" is checked', () => {
    const { getByLabelText } = render(
      <ExclusiveCheckboxes name={""} options={options} labels={labels} />,
    );
    options.forEach((option) => {
      if (option !== "none") {
        expect(getByLabelText(labels[option])).toBeChecked();
      }
    });
    fireEvent.click(getByLabelText(noneLabel));
    options.forEach((option) => {
      if (option !== "none") {
        expect(getByLabelText(labels[option])).not.toBeChecked();
      }
    });
  });

  it('should uncheck the "None of the above" checkbox when any other valid checkbox is checked', () => {
    mockValueFunc.mockReturnValue({
      checkboxOne: "off",
      checkboxTwo: "off",
      checkboxThree: "off",
      none: "on",
    });
    const { getByLabelText } = render(
      <ExclusiveCheckboxes name={""} options={options} labels={labels} />,
    );
    expect(getByLabelText(noneLabel)).toBeChecked();
    fireEvent.click(getByLabelText(firstCheckboxLabel));
    expect(getByLabelText(noneLabel)).not.toBeChecked();
  });

  it("should set the default values from the schema when the field value is undefined", () => {
    mockValueFunc.mockReturnValue(undefined);
    const { getAllByRole } = render(
      <ExclusiveCheckboxes name={""} options={options} />,
    );
    const checkboxes = getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(4);
    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });
});
