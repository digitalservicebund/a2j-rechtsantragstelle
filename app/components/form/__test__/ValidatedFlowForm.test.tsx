import { render } from "@testing-library/react";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import * as buildStepValidator from "~/services/validation/buildStepValidator";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

vi.mock("@remix-run/react", () => ({
  useParams: vi.fn(),
  useLocation: vi.fn(() => ({
    pathname: "",
  })),
}));

vi.mock("~/services/params", () => ({
  splatFromParams: vi.fn(),
}));

const fieldNameValidatorSpy = vi.spyOn(
  buildStepValidator,
  "validatorForFieldnames",
);

describe("ValidatedFlowForm", () => {
  it("should render", () => {
    fieldNameValidatorSpy.mockImplementation(vi.fn());
    const { getByText } = renderValidatedFlowForm([]);
    expect(getByText("NEXT")).toBeInTheDocument();
  });
});

function renderValidatedFlowForm(formElements: StrapiFormComponent[]) {
  const router = createMemoryRouter(
    [
      {
        path: "",
        element: (
          <ValidatedFlowForm
            stepData={{}}
            formElements={formElements}
            buttonNavigationProps={{ next: { destination: "", label: "NEXT" } }}
            csrf={""}
          />
        ),
      },
    ],
    { initialEntries: ["/"] },
  );
  return render(<RouterProvider router={router} />);
}
