import { type FieldApi, useField } from "@rvf/react-router";
import { fireEvent, render } from "@testing-library/react";
import { type Mock } from "vitest";
import { ExclusiveCheckboxes } from "~/components/formElements/exclusiveCheckboxes/ExclusiveCheckboxes";
import { type StrapiCheckboxComponent } from "~/services/cms/models/formElements/StrapiCheckbox";
import {
  type ExclusiveCheckboxes as ExclusiveCheckboxesType,
  exclusiveCheckboxesSchema,
} from "~/services/validation/checkedCheckbox";

vi.mock("@rvf/react-router");

const errorMock = vi.fn();
const mockFieldValidator = vi.fn();
const mockValue = vi.fn(() => ({
  checkboxOne: "on",
  checkboxTwo: "on",
  checkboxThree: "on",
  none: "off",
})) as Mock<() => ExclusiveCheckboxesType | undefined>;

vi.mocked(useField).mockReturnValue({
  value: mockValue,
  setValue: vi.fn(),
  validate: mockFieldValidator,
  error: errorMock,
  onChange: vi.fn(),
} as unknown as FieldApi<unknown>);

const noneLabel = "None of the above";
const firstCheckboxLabel = "One";
const cmsCheckboxes = [
  { name: "checkboxOne", label: firstCheckboxLabel },
  { name: "checkboxTwo", label: "Two" },
  { name: "checkboxThree", label: "Three" },
  { name: "none", label: noneLabel },
] as StrapiCheckboxComponent[];

const schema = exclusiveCheckboxesSchema([
  "checkboxOne",
  "checkboxTwo",
  "checkboxThree",
  "none",
]);

describe("ExclusiveCheckboxes", () => {
  it("should render all checkboxes", () => {
    const { getAllByRole } = render(
      <ExclusiveCheckboxes
        name={""}
        schema={schema}
        cmsCheckboxes={cmsCheckboxes}
      />,
    );
    expect(getAllByRole("checkbox")).toHaveLength(4);
  });

  it("should render an error message", () => {
    errorMock.mockReturnValue("error message");
    const { getByText } = render(
      <ExclusiveCheckboxes
        name={""}
        schema={schema}
        cmsCheckboxes={cmsCheckboxes}
      />,
    );
    expect(getByText("error message")).toBeInTheDocument();
  });

  it("should call the field validation function when a value changes", () => {
    const { getAllByRole } = render(
      <ExclusiveCheckboxes
        name={""}
        schema={schema}
        cmsCheckboxes={cmsCheckboxes}
      />,
    );
    const firstCheckbox = getAllByRole("checkbox")[0] as HTMLInputElement;
    fireEvent.click(firstCheckbox);
    expect(mockFieldValidator).toHaveBeenCalledTimes(1);
  });

  it('should uncheck all checkboxes when "None of the above" is checked', () => {
    const { getByLabelText } = render(
      <ExclusiveCheckboxes
        name={""}
        schema={schema}
        cmsCheckboxes={cmsCheckboxes}
      />,
    );
    cmsCheckboxes.forEach((checkbox) => {
      if (checkbox.name !== "none") {
        expect(getByLabelText(checkbox.label)).toBeChecked();
      }
    });
    fireEvent.click(getByLabelText(noneLabel));
    cmsCheckboxes.forEach((checkbox) => {
      if (checkbox.name !== "none") {
        expect(getByLabelText(checkbox.label)).not.toBeChecked();
      }
    });
  });

  it('should uncheck the "None of the above" checkbox when any other valid checkbox is checked', () => {
    mockValue.mockReturnValue({
      checkboxOne: "off",
      checkboxTwo: "off",
      checkboxThree: "off",
      none: "on",
    });
    const { getByLabelText } = render(
      <ExclusiveCheckboxes
        name={""}
        schema={schema}
        cmsCheckboxes={cmsCheckboxes}
      />,
    );
    expect(getByLabelText(noneLabel)).toBeChecked();
    fireEvent.click(getByLabelText(firstCheckboxLabel));
    expect(getByLabelText(noneLabel)).not.toBeChecked();
  });

  it("should set the default values from the schema when the field value is undefined", () => {
    mockValue.mockReturnValue(undefined);
    const { getAllByRole } = render(
      <ExclusiveCheckboxes
        name={""}
        schema={schema}
        cmsCheckboxes={cmsCheckboxes}
      />,
    );
    const checkboxes = getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(4);
    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });
});
