import { createRemixStub } from "@remix-run/testing";
import { render, screen, fireEvent } from "@testing-library/react";
import Textarea, { TEXT_AREA_ROWS } from "~/components/inputs/Textarea";

const getInputProps = vi.fn();
let error: string | undefined = undefined;

vi.mock("remix-validated-form", async () => {
  const rmf = await vi.importActual("remix-validated-form");
  return {
    ...rmf,
    useField: () => ({
      error,
      getInputProps: getInputProps,
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
    }),
  };
});

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("Textarea component", () => {
  it("renders without errors", () => {
    const componentName = "test-textarea";
    const maxLength = 5000;

    getInputProps.mockImplementationOnce(() => ({
      id: componentName,
      placeholder: "Test Placeholder",
      maxLength: maxLength,
    }));

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea
            name={componentName}
            maxLength={maxLength}
            label="Test Label"
            formId="formId"
          />
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

    expect(element).toHaveAttribute("maxLength", maxLength.toString());
  });

  it("renders without errors when description is provided", () => {
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea
            name="test-textarea"
            label="Test Label"
            description="Test Description"
            formId="formId"
            maxLength={5000}
          />
        ),
      },
    ]);

    render(<RemixStub />);

    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toHaveClass("ds-heading-03-reg");
  });

  it("renders a collapsible text hint accordion when provided", () => {
    vi.mock("~/components/Details", () => ({
      Details: () => <div>Text-Beispiel</div>,
    }));
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea
            name="test-textarea"
            label="Test Label"
            details={{
              title: "Text-Beispiel",
              content: "Lorem ipsum",
            }}
            formId="formId"
            maxLength={5000}
          />
        ),
      },
    ]);

    render(<RemixStub />);
    const accordion = screen.getByText("Text-Beispiel");
    expect(accordion).toBeInTheDocument();
  });

  it("renders error message when error is present", () => {
    error = "error";
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea
            name="test"
            errorMessages={[{ code: "required", text: "error" }]}
            formId="formId"
            maxLength={5000}
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
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea maxLength={5000} name="componentName" label="Test Label" />
        ),
      },
    ]);

    render(<RemixStub />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test input" } });

    expect(textarea).toHaveValue("Test input");
  });

  it("should render the textarea with the define rows from the variable TEXT_AREA_ROWS", () => {
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea maxLength={5000} name="componentName" label="Test Label" />
        ),
      },
    ]);

    render(<RemixStub />);

    const textarea = screen.getByRole("textbox");

    expect(textarea.getAttribute("rows")).toEqual(TEXT_AREA_ROWS.toString());
  });

  it("should enforce maxCharacterLength limit", () => {
    const maxLength = 10;
    getInputProps.mockImplementationOnce(() => ({
      id: "componentName",
      maxLength: maxLength,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.value = e.target.value.slice(0, maxLength);
      },
    }));

    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <Textarea
            name="componentName"
            label="Test Label"
            formId="formId"
            maxLength={maxLength}
          />
        ),
      },
    ]);

    render(<RemixStub />);

    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox");

    fireEvent.change(textarea, {
      target: { value: "This is a very long text" },
    });

    expect(textarea.value.length).toEqual(maxLength);
    expect(textarea.value).toEqual("This is a ");
  });
});
