import { withZod } from "@remix-validated-form/with-zod";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { z } from "zod";
import {
  getStrapiInputComponent,
  StrapiInputType,
} from "tests/factories/cmsModels/strapiInputComponent";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import * as buildStepValidator from "~/services/validation/buildStepValidator";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { timeSchema } from "~/services/validation/time";

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
    const { component, expectInputErrorToExist } = getStrapiInputComponent({
      code: "invalidInteger",
      text: "Please enter a valid integer.",
    });

    it("should display an error if the user enters an invalid integer", async () => {
      const { getByText, getByPlaceholderText } = renderValidatedFlowForm([
        component,
      ]);

      const nextButton = getByText("NEXT");
      const inputComponent = getByPlaceholderText("input");
      expect(nextButton).toBeInTheDocument();

      fireEvent.input(inputComponent, {
        target: { value: "1,230.12" },
      });
      fireEvent.blur(inputComponent);
      await expectInputErrorToExist();

      fireEvent.click(nextButton);
      await waitFor(async () => {
        expect(inputComponent).toHaveFocus();
        await expectInputErrorToExist();
      });
    });

    it("should not display an error for correct input", async () => {
      const { getByText, getByPlaceholderText, queryByTestId } =
        renderValidatedFlowForm([component]);
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

  describe("Date Input Component", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(z.object({ myDateInput: createDateSchema() })),
      );
    });
    const { component, expectInputErrorToExist } = getStrapiInputComponent(
      {
        code: "invalid",
        text: "Please enter a valid date.",
      },
      StrapiInputType.Date,
    );

    it("should display an error if the user enters an invalid date", async () => {
      const { getByText, getByPlaceholderText } = renderValidatedFlowForm([
        component,
      ]);

      const nextButton = getByText("NEXT");
      const dateInputComponent = getByPlaceholderText("date input");
      expect(nextButton).toBeInTheDocument();

      fireEvent.input(dateInputComponent, {
        target: { value: "13,20,2024" },
      });
      fireEvent.blur(dateInputComponent);
      await expectInputErrorToExist();

      fireEvent.click(nextButton);
      await waitFor(async () => {
        expect(dateInputComponent).toHaveFocus();
        await expectInputErrorToExist();
      });
    });

    it("should not display an error for correct input", async () => {
      const { getByText, getByPlaceholderText, queryByTestId } =
        renderValidatedFlowForm([component]);
      const dateInputComponent = getByPlaceholderText("date input");

      fireEvent.input(dateInputComponent, {
        target: { value: "10.12.2024" },
      });
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(dateInputComponent).not.toHaveClass("has-error");
        expect(queryByTestId("inputError")).not.toBeInTheDocument();
        expect(queryByTestId("ErrorOutlineIcon")).not.toBeInTheDocument();
      });
    });
  });

  describe("Time Input Component", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(z.object({ myTimeInput: timeSchema })),
      );
    });
    const { component, expectInputErrorToExist } = getStrapiInputComponent(
      {
        code: "invalid",
        text: "Please enter a valid time.",
      },
      StrapiInputType.Time,
    );

    it("should display an error if the user enters an invalid time", async () => {
      const { getByText, getByPlaceholderText } = renderValidatedFlowForm([
        component,
      ]);

      const nextButton = getByText("NEXT");
      const timeInputComponent = getByPlaceholderText("time input");
      expect(nextButton).toBeInTheDocument();

      fireEvent.input(timeInputComponent, {
        target: { value: "27:13" },
      });
      fireEvent.blur(timeInputComponent);
      await expectInputErrorToExist();

      fireEvent.click(nextButton);
      await waitFor(async () => {
        expect(timeInputComponent).toHaveFocus();
        await expectInputErrorToExist();
      });
    });

    it("should not display an error for correct input", async () => {
      const { getByText, getByPlaceholderText, queryByTestId } =
        renderValidatedFlowForm([component]);
      const timeInputComponent = getByPlaceholderText("time input");

      fireEvent.input(timeInputComponent, {
        target: { value: "23:59" },
      });
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(timeInputComponent).not.toHaveClass("has-error");
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
