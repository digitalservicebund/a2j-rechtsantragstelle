import { render } from "@testing-library/react";
import { type StrapiFieldSet } from "~/services/cms/components/StrapiFieldSet";
import { FieldSet } from "../FieldSet";

vi.mock("~/components/FormComponents", () => ({
  FormComponent: () => <div>FormComponent</div>,
}));

type FieldSetGroupType = StrapiFieldSet["fieldSetGroup"];

const mockFieldSetGroup: FieldSetGroupType = {
  formComponents: [
    {
      name: "direktAbflugsDatum",
      label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
      errorMessages: [],
      id: 76,
      __component: "form-elements.date-input",
    },
    {
      name: "direktAbflugsZeit",
      label: "Zeit geplanter Abflug (z.B. 09:08)",
      placeholder: undefined,
      errorMessages: [],
      id: 40,
      __component: "form-elements.time-input",
    },
  ],
};

describe("FieldSet", () => {
  it("should render Fieldset component with correct data", () => {
    const { getByText, getAllByText } = render(
      <FieldSet heading="anyHeading" fieldSetGroup={mockFieldSetGroup} />,
    );

    expect(getByText("anyHeading")).toBeInTheDocument();
    expect(getAllByText("FormComponent").length).toBe(2);
  });

  it("should render Fieldset component with image and properties when is available", () => {
    const { container } = render(
      <FieldSet
        heading="anyHeading"
        fieldSetGroup={mockFieldSetGroup}
        image={{
          url: "/test.png",
          height: 24,
          width: 24,
        }}
      />,
    );

    expect(container.querySelector("img")).toBeInTheDocument();
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    expect(container.querySelector("img")?.height).toBe(24);
    expect(container.querySelector("img")?.width).toBe(24);
  });
});
