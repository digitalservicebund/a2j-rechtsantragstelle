import { withZod } from "@rvf/zod";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { z } from "zod";
import { getStrapiCheckboxComponent } from "tests/factories/cmsModels/strapiCheckboxComponent";
import { getStrapiDropdownComponent } from "tests/factories/cmsModels/strapiDropdownComponent";
import { getStrapiInputComponent } from "tests/factories/cmsModels/strapiInputComponent";
import { getStrapiSelectComponent } from "tests/factories/cmsModels/strapiSelectComponent";
import { getStrapiTextareaComponent } from "tests/factories/cmsModels/strapiTextareaComponent";
import { getStrapiTileGroupComponent } from "tests/factories/cmsModels/strapiTileGroupComponent";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import * as validatorForFieldNames from "~/services/validation/stepValidator/validatorForFieldNames";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { timeSchema } from "~/services/validation/time";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

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
  validatorForFieldNames,
  "validatorForFieldNames",
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
        withZod(z.object({ inputName: integerSchema })),
      );
    });
    const { component, expectInputErrorToExist } = getStrapiInputComponent({
      code: "invalidInteger",
      text: "Please enter a valid integer.",
    });

    it("should display an error if the user enters an invalid integer", async () => {
      const { getByText, getByRole } = renderValidatedFlowForm([component]);

      const nextButton = getByText("NEXT");
      const inputComponent = getByRole("textbox");
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
      const { getByText, getByRole, queryByTestId } = renderValidatedFlowForm([
        component,
      ]);
      const inputComponent = getByRole("textbox");

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
        withZod(z.object({ inputName: createDateSchema() })),
      );
    });
    const { component, expectInputErrorToExist } = getStrapiInputComponent(
      {
        code: "invalid",
        text: "Please enter a valid date.",
      },
      "date",
    );

    it("should display an error if the user enters an invalid date", async () => {
      const { getByText, getByRole } = renderValidatedFlowForm([component]);

      const nextButton = getByText("NEXT");
      const dateInputComponent = getByRole("textbox");
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
      const { getByText, getByRole, queryByTestId } = renderValidatedFlowForm([
        component,
      ]);
      const dateInputComponent = getByRole("textbox");

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
        withZod(z.object({ inputName: timeSchema })),
      );
    });
    const { component, expectInputErrorToExist } = getStrapiInputComponent(
      {
        code: "invalid",
        text: "Please enter a valid time.",
      },
      "time",
    );

    it("should display an error if the user enters an invalid time", async () => {
      const { getByText, getByRole } = renderValidatedFlowForm([component]);

      const nextButton = getByText("NEXT");
      const timeInputComponent = getByRole("textbox");
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
      const { getByText, getByRole, queryByTestId } = renderValidatedFlowForm([
        component,
      ]);
      const timeInputComponent = getByRole("textbox");

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

  describe("Textarea Component", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(z.object({ myTextarea: stringRequiredSchema })),
      );
    });
    const { component, expectTextareaErrorToExist } =
      getStrapiTextareaComponent({
        code: "required",
        text: "Please enter a value.",
      });

    it("should display an error if the user leaves the textarea empty", async () => {
      const { getByText, getByRole } = renderValidatedFlowForm([component]);

      const nextButton = getByText("NEXT");
      const textareaComponent = getByRole("textbox");
      expect(nextButton).toBeInTheDocument();

      fireEvent.blur(textareaComponent);
      await expectTextareaErrorToExist();

      fireEvent.click(nextButton);
      await waitFor(async () => {
        expect(textareaComponent).toHaveFocus();
        await expectTextareaErrorToExist();
      });
    });

    it("should not display an error for correct input", async () => {
      const { getByText, getByRole, queryByTestId } = renderValidatedFlowForm([
        component,
      ]);
      const textareaComponent = getByRole("textbox");

      fireEvent.input(textareaComponent, {
        target: { value: "Hello World" },
      });
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(textareaComponent).not.toHaveClass("has-error");
        expect(queryByTestId("inputError")).not.toBeInTheDocument();
        expect(queryByTestId("ErrorOutlineIcon")).not.toBeInTheDocument();
      });
    });
  });

  describe("Select Component (Radio)", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(z.object({ mySelect: YesNoAnswer })),
      );
    });
    const { component, expectSelectErrorToExist } = getStrapiSelectComponent({
      code: "required",
      text: "Please select a value.",
    });

    it("should display an error if the user doesn't select an option", async () => {
      const { getByText } = renderValidatedFlowForm([component]);

      const nextButton = getByText("NEXT");
      expect(nextButton).toBeInTheDocument();
      fireEvent.click(nextButton);
      await waitFor(async () => {
        await expectSelectErrorToExist();
      });
    });

    it("should focus on first radio button when data submission fails", async () => {
      const { getByText, getByLabelText } = renderValidatedFlowForm([
        component,
      ]);
      const nextButton = getByText("NEXT");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(getByLabelText("Ja")).toHaveFocus();
      });
    });

    it("should not display an error if the user has selected an option", async () => {
      const { getByText, queryByTestId, getByLabelText } =
        renderValidatedFlowForm([component]);

      fireEvent.click(getByLabelText("Ja"));
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(queryByTestId("inputError")).not.toBeInTheDocument();
        expect(queryByTestId("ErrorOutlineIcon")).not.toBeInTheDocument();
      });
    });
  });

  describe("Dropdown Component", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(
          z.object({
            myDropdown: z.enum(
              ["option1", "option2", "option3"],
              customRequiredErrorMessage,
            ),
          }),
        ),
      );
    });
    const { component, expectDropdownErrorToExist } =
      getStrapiDropdownComponent({
        code: "required",
        text: "Please select a value.",
      });

    it("should display an error if the user doesn't select an option", async () => {
      const { getByText, getByRole } = renderValidatedFlowForm([component]);

      const nextButton = getByText("NEXT");
      expect(nextButton).toBeInTheDocument();
      fireEvent.blur(getByRole("option", { name: "Select a value." }));
      await expectDropdownErrorToExist();
    });

    it("should not display an error if the user has selected an option", async () => {
      const { getByText, queryByTestId } = renderValidatedFlowForm([component]);

      fireEvent.click(getByText("Option 1"));
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(queryByTestId("inputError")).not.toBeInTheDocument();
        expect(queryByTestId("ErrorOutlineIcon")).not.toBeInTheDocument();
      });
    });
  });

  describe("Checkbox Component", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(
          z.object({
            checkbox1: checkedRequired,
            checkbox2: checkedRequired,
          }),
        ),
      );
    });

    const errorCode = {
      code: "required",
      text: "Selection required.",
    };

    const checkbox1 = getStrapiCheckboxComponent(errorCode, {
      name: "checkbox1",
      label: "Checkbox 1",
      id: 1,
    });

    const checkbox2 = getStrapiCheckboxComponent(errorCode, {
      name: "checkbox2",
      label: "Checkbox 2",
      id: 2,
    });

    it("should focus on first checkbox when data submission fails", async () => {
      const { getByText, getByLabelText } = renderValidatedFlowForm([
        checkbox1.component,
        checkbox2.component,
      ]);
      const nextButton = getByText("NEXT");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(getByLabelText("Checkbox 1")).toHaveFocus();
        expect(getByLabelText("Checkbox 2")).not.toHaveFocus();
      });
    });

    it("should display an error if the user doesn't select the checkbox", async () => {
      const { getByText, getByLabelText, getByTestId } =
        renderValidatedFlowForm([checkbox1.component]);

      const nextButton = getByText("NEXT");
      expect(nextButton).toBeInTheDocument();
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(getByTestId("inputError")).toBeInTheDocument();
        expect(getByLabelText("Checkbox 1")).toHaveFocus();
      });
    });

    it("should not display an error if the user has selected the checkbox", async () => {
      const { getByText, queryByTestId, getByLabelText } =
        renderValidatedFlowForm([checkbox1.component]);
      fireEvent.click(getByLabelText("Checkbox 1"));
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(queryByTestId("inputError")).not.toBeInTheDocument();
        expect(queryByTestId("ErrorOutlineIcon")).not.toBeInTheDocument();
      });
    });
  });

  describe("TileGroup Component", () => {
    beforeAll(() => {
      fieldNameValidatorSpy.mockImplementation(() =>
        withZod(
          z.object({
            myTileGroup: z.enum(["tileGroup"], customRequiredErrorMessage),
          }),
        ),
      );
    });
    const { component, expectTileGroupErrorToExist } =
      getStrapiTileGroupComponent(
        {
          code: "required",
          text: "Selection required.",
        },
        ["First Tile", "Second Tile"],
      );

    it("should display an error if the user doesn't select a tile", async () => {
      const { getByText } = renderValidatedFlowForm([component]);

      const nextButton = getByText("NEXT");
      expect(nextButton).toBeInTheDocument();
      fireEvent.click(nextButton);
      await expectTileGroupErrorToExist();
    });

    it("should not display an error if the user has selected a tile", async () => {
      const { getByText, queryByTestId } = renderValidatedFlowForm([component]);
      fireEvent.click(getByText("First Tile"));
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(queryByTestId("inputError")).not.toBeInTheDocument();
        expect(queryByTestId("ErrorOutlineIcon")).not.toBeInTheDocument();
      });
    });

    it("should focus on first tile when error appears", async () => {
      const { getByText, getAllByRole, queryByTestId } =
        renderValidatedFlowForm([component]);
      fireEvent.click(getByText("NEXT"));
      await waitFor(() => {
        expect(queryByTestId("ErrorOutlineIcon")).toBeInTheDocument();
        const radioButtons = getAllByRole("radio");
        const firstRadio = radioButtons[0];
        const secondRadio = radioButtons[1];

        expect(radioButtons).toHaveLength(2);
        expect(firstRadio).toHaveFocus();
        expect(secondRadio).not.toHaveFocus();
      });
    });
  });
});

function renderValidatedFlowForm(
  formElements: Array<Partial<StrapiFormComponent>>,
) {
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <ValidatedFlowForm
          stepData={{}}
          // @ts-expect-error Incompatible types, as we're only mocking partials of FormElements
          formElements={formElements}
          buttonNavigationProps={{ next: { destination: "", label: "NEXT" } }}
          csrf={""}
        />
      ),
      action() {
        return true;
      },
    },
  ]);
  return render(<RouterProvider router={router} />);
}
