import { createRemixStub } from "@remix-run/testing";
import { render, screen, fireEvent } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import Textarea, { TEXT_AREA_ROWS } from "~/components/inputs/Textarea";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("Textarea component", () => {
  it("renders without errors", () => {
    const componentName = "test-textarea";

    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: vi.fn().mockReturnValue({
        id: componentName,
        placeholder: "Test Placeholder",
      }),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
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
    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: vi.fn(),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
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
    expect(screen.getByText("Test Label")).toHaveClass("ds-heading-03-reg");
  });

  it("renders error message when error is present", () => {
    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: "error",
      getInputProps: vi.fn(),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
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

  it("allows users to type in the textarea", () => {
    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: vi.fn(),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => <Textarea name="componentName" label="Test Label" />,
      },
    ]);

    render(<RemixStub />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test input" } });

    expect(textarea).toHaveValue("Test input");
  });

  it("should render the textarea with the define rows from the variable TEXT_AREA_ROWS", () => {
    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      error: undefined,
      getInputProps: vi.fn(),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
    });

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => <Textarea name="componentName" label="Test Label" />,
      },
    ]);

    render(<RemixStub />);

    const textarea = screen.getByRole("textbox");

    expect(textarea.getAttribute("rows")).toEqual(TEXT_AREA_ROWS.toString());
  });
});
