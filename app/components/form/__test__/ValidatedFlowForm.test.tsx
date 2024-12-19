import { withZod } from "@remix-validated-form/with-zod";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { z } from "zod";
import {
  expectInputErrorToExist,
  getStrapiInputComponent,
} from "tests/factories/cmsModels/strapiInputComponent";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import * as buildStepValidator from "~/services/validation/buildStepValidator";
import { integerSchema } from "~/services/validation/integer";

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
    fieldNameValidatorSpy.mockImplementationOnce(vi.fn());
    const { getByText } = renderValidatedFlowForm([]);
    expect(getByText("NEXT")).toBeInTheDocument();
  });

  describe("Input Component", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(z.object({ myInput: integerSchema })),
      );
    });

    it("should display an error if the user enters an invalid integer", async () => {
      const invalidInteger = "Please enter a valid integer.";

      const { getByText, getByPlaceholderText } = renderValidatedFlowForm([
        getStrapiInputComponent([
          {
            code: "invalidInteger",
            text: invalidInteger,
          },
        ]),
      ]);

      const nextButton = getByText("NEXT");
      const inputComponent = getByPlaceholderText("input");
      expect(nextButton).toBeInTheDocument();

      fireEvent.input(inputComponent, {
        target: { value: "1,230.12" },
      });
      fireEvent.blur(inputComponent);
      await expectInputErrorToExist(invalidInteger);

      fireEvent.click(nextButton);
      await waitFor(async () => {
        expect(inputComponent).toHaveFocus();
        await expectInputErrorToExist(invalidInteger);
      });
    });

    it("should not display an error for correct input", async () => {
      const invalidInteger = "Please enter a valid integer.";

      const { getByText, getByPlaceholderText, queryByTestId } =
        renderValidatedFlowForm([
          getStrapiInputComponent([
            {
              code: "invalidInteger",
              text: invalidInteger,
            },
          ]),
        ]);
      const inputComponent = getByPlaceholderText("input");

      fireEvent.input(inputComponent, {
        target: { value: "123" },
      });
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(inputComponent).not.toHaveClass("has-error");
        expect(queryByTestId("inputError")).not.toBeInTheDocument();
        expect(queryByTestId("ErrorOutlineIcon")).not.toBeInTheDocument();
      });
    });
  });
});

function renderValidatedFlowForm(formElements: Partial<StrapiFormComponent>[]) {
  const router = createMemoryRouter(
    [
      {
        path: "",
        element: (
          <ValidatedFlowForm
            stepData={{}}
            // @ts-expect-error Incompatible types, as we're only mocking partials of FormElements
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