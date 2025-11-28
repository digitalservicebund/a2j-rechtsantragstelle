import { render } from "@testing-library/react";
import type { StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import { FieldSet, FieldSetSchema } from "../FieldSet";
import z from "zod";

vi.mock("~/components/FormComponents", () => ({
  FormComponent: () => <div>FormComponent</div>,
}));

vi.mock("~/components/formElements/SchemaComponents", () => ({
  SchemaComponents: () => <div>SchemaComponents</div>,
}));

type FieldSetGroupType = StrapiFieldSet["fieldSetGroup"];

const mockPageSchema = { field1: z.string() };

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
    const { getByRole, getAllByText } = render(
      <FieldSet heading="anyHeading" fieldSetGroup={mockFieldSetGroup} />,
    );

    expect(getByRole("group")).toBeInTheDocument();
    expect(getByRole("group")).toHaveTextContent("anyHeading");
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

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(img).toHaveAttribute("height", "24");
    expect(img).toHaveAttribute("width", "24");
  });
});

describe("FieldSetSchema", () => {
  it("should render FieldSetSchema component with correct data", () => {
    const { getByRole, getByText } = render(
      <FieldSetSchema
        heading="anyHeading"
        fieldSetGroup={mockFieldSetGroup}
        pageSchema={mockPageSchema}
      />,
    );

    expect(getByRole("group")).toBeInTheDocument();
    expect(getByRole("group")).toHaveTextContent("anyHeading");
    expect(getByText("SchemaComponents")).toBeInTheDocument();
  });

  it("should render FieldSetSchema component with image and properties when is available", () => {
    const { container } = render(
      <FieldSetSchema
        heading="anyHeading"
        fieldSetGroup={mockFieldSetGroup}
        pageSchema={mockPageSchema}
        image={{
          url: "/test.png",
          height: 24,
          width: 24,
        }}
      />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(img).toHaveAttribute("height", "24");
    expect(img).toHaveAttribute("width", "24");
  });
});
