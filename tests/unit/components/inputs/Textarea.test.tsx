import * as remixValidatedForm from "remix-validated-form";
import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import Textarea from "~/components/inputs/Textarea";

jest.mock("remix-validated-form", () => ({
  useField: jest.fn(),
}));

describe("Textarea component", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // This clears all mocks after each test
  });

  it("renders without errors", () => {
    const componentName = "test-textarea";

    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn().mockReturnValue({
        id: componentName,
        placeholder: "Test Placeholder",
      }),
      clearError: jest.fn(),
      validate: jest.fn(),
      touched: false,
      setTouched: jest.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea name={componentName} label="Test Label" formId="formId" />
        ),
      },
    ]);

    render(<RemixStub />);

    const element = screen.getByRole("textbox");
    const elementByLabel = screen.getByLabelText("Test Label");
    expect(element).toBeInTheDocument();
    expect(element).not.toHaveClass("has-error");

    expect(elementByLabel).toBeInTheDocument();
    expect(elementByLabel).not.toHaveClass("ds-heading-03-reg");

    expect(screen.getByPlaceholderText("Test Placeholder")).toBeInTheDocument();
  });

  it("renders without errors when description is provided", () => {
    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: jest.fn(),
      clearError: jest.fn(),
      validate: jest.fn(),
      touched: false,
      setTouched: jest.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea
            name="test-textarea"
            label="Test Label"
            description="Test Description"
            formId="formId"
          />
        ),
      },
    ]);

    render(<RemixStub />);

    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Label").className).toBe("ds-heading-03-reg");
  });

  it("renders error message when error is present", () => {
    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: "error",
      getInputProps: jest.fn(),
      clearError: jest.fn(),
      validate: jest.fn(),
      touched: false,
      setTouched: jest.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea
            name="test"
            errorMessages={[{ code: "required", text: "error" }]}
            formId="formId"
          />
        ),
      },
    ]);

    render(<RemixStub />);

    const element = screen.getByRole("textbox");
    expect(element).toHaveClass("has-error");
    expect(element).toHaveAttribute("aria-describedby", "test-error");

    expect(screen.getByText("error")).toBeInTheDocument();
  });
});
