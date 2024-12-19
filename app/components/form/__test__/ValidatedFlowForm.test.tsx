/* eslint-disable sonarjs/no-nested-functions */
import { withZod } from "@remix-validated-form/with-zod";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { z } from "zod";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import type { StrapiInputComponentSchema } from "~/services/cms/components/StrapiInput";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";
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
    describe("Intger Schema", () => {
      beforeAll(() => {
        fieldNameValidatorSpy.mockImplementation(() =>
          withZod(z.object({ myInput: integerSchema })),
        );
      });

      it("should display an error if the user does't enter a value", async () => {
        const errorText = "Number Required";
        const { getByText, queryByText, getByPlaceholderText } =
          renderValidatedFlowForm([
            buildStrapiInputComponent([
              {
                code: "required",
                text: errorText,
              },
            ]),
          ]);
        const nextButton = getByText("NEXT");
        expect(nextButton).toBeInTheDocument();
        expect(queryByText("error")).not.toBeInTheDocument();
        fireEvent.blur(getByPlaceholderText("input"));
        await expectErrorToExist(errorText);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(getByPlaceholderText("input")).toHaveFocus();
        });
      });

      it("should display an error if the user enters an invalid number", async () => {
        const errorText = "Please enter a valid number.";
        const { getByText, queryByText, getByPlaceholderText } =
          renderValidatedFlowForm([
            buildStrapiInputComponent([
              {
                code: "invalidNumber",
                text: errorText,
              },
            ]),
          ]);
        const nextButton = getByText("NEXT");
        expect(nextButton).toBeInTheDocument();
        expect(queryByText("error")).not.toBeInTheDocument();
        fireEvent.input(getByPlaceholderText("input"), {
          target: { value: "Hello world" },
        });
        fireEvent.blur(getByPlaceholderText("input"));
        await expectErrorToExist(errorText);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(getByPlaceholderText("input")).toHaveFocus();
        });
      });

      it("should display an error if the user enters an invalid integer", async () => {
        const errorText = "Please enter a valid integer.";
        const { getByText, queryByText, getByPlaceholderText } =
          renderValidatedFlowForm([
            buildStrapiInputComponent([
              {
                code: "invalidInteger",
                text: errorText,
              },
            ]),
          ]);
        const nextButton = getByText("NEXT");
        expect(nextButton).toBeInTheDocument();
        expect(queryByText("error")).not.toBeInTheDocument();
        fireEvent.input(getByPlaceholderText("input"), {
          target: { value: "1,23.0" },
        });
        fireEvent.blur(getByPlaceholderText("input"));
        await expectErrorToExist(errorText);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(getByPlaceholderText("input")).toHaveFocus();
        });
      });
    });
  });
});

async function expectErrorToExist(errorText: string) {
  await waitFor(() => {
    expect(screen.getByText(errorText)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("input")).toHaveClass("has-error");
    expect(screen.getByTestId("inputError")).toBeInTheDocument();
    expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
  });
}

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

function buildStrapiInputComponent(
  errorCodes: Array<z.infer<typeof StrapiFieldErrorSchema>>,
): Partial<z.infer<typeof StrapiInputComponentSchema>> {
  return {
    __component: "form-elements.input",
    name: "myInput",
    placeholder: "input",
    errors: [
      {
        name: "",
        id: 0,
        errorCodes,
      },
    ],
  };
}
