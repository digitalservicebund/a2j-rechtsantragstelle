import { render } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiFieldsetGroupsFormComponentsSchema } from "~/services/cms/models/StrapiFieldsetGroups";
import { Fieldset } from "../Filedset";

vi.mock("~/services/cms/components/StrapiFormComponents", () => ({
  FormComponent: () => <div>FormComponent</div>,
}));

describe("Fieldset", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Fieldset component with correct data", () => {
    const formComponents: z.infer<
      typeof StrapiFieldsetGroupsFormComponentsSchema
    >[] = [
      {
        name: "direktAbflugsDatum",
        label: "Datum geplanter Abflug (z.B. 10.03.2024) ",
        placeholder: null,
        errors: {
          data: [],
        },
        id: 76,
        __component: "form-elements.date-input",
      },
      {
        name: "direktAbflugsZeit",
        label: "Zeit geplanter Abflug (z.B. 09:08)",
        placeholder: null,
        errors: {
          data: [],
        },
        id: 40,
        __component: "form-elements.time-input",
      },
    ];

    const { getByText, getAllByText } = render(
      <Fieldset heading="anyHeading" formComponents={formComponents} />,
    );

    expect(getByText("anyHeading")).toBeInTheDocument();
    expect(getAllByText("FormComponent").length).toBe(2);
  });
});
