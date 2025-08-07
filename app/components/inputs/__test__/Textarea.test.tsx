import { render, screen, fireEvent } from "@testing-library/react";
import Textarea, { TEXT_AREA_ROWS } from "~/components/inputs/Textarea";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";

const getInputProps = vi.fn();
const getError = vi.fn();

vi.mock("@rvf/react-router", async () => {
  const rmf = await vi.importActual("@rvf/react-router");
  return {
    ...rmf,
    useField: () => ({
      error: getError,
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

    getInputProps.mockImplementationOnce(() => ({
      id: componentName,
      placeholder: "Test Placeholder",
    }));

    render(<Textarea name={componentName} label="Test Label" />);

    const element = screen.getByRole("textbox");
    const elementByLabel = screen.getByLabelText("Test Label");
    expect(element).toBeInTheDocument();
    expect(element).not.toHaveClass("has-error");

    expect(elementByLabel).toBeInTheDocument();
    expect(elementByLabel).not.toHaveClass("ds-heading-03-reg");

    expect(screen.getByPlaceholderText("Test Placeholder")).toBeInTheDocument();
    expect(element.getAttribute("maxLength")).toBe(
      TEXTAREA_CHAR_LIMIT.toString(),
    );
  });

  it("renders without errors when description is provided", () => {
    render(
      <Textarea
        name="test-textarea"
        label="Test Label"
        description="Test Description"
      />,
    );

    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toHaveClass("ds-heading-03-reg");
  });

  it("renders a collapsible text hint accordion when provided", () => {
    vi.mock("~/components/Details", () => ({
      Details: () => <div>Text-Beispiel</div>,
    }));

    render(
      <Textarea
        name="test-textarea"
        label="Test Label"
        details={{
          title: "Text-Beispiel",
          content: "Lorem ipsum",
        }}
      />,
    );
    const accordion = screen.getByText("Text-Beispiel");
    expect(accordion).toBeInTheDocument();
  });

  it("renders error message when error is present", () => {
    getError.mockReturnValue("error");

    render(
      <Textarea
        name="test"
        errorMessages={[{ code: "required", text: "error" }]}
      />,
    );

    const element = screen.getByRole("textbox");
    expect(element).toHaveClass("has-error");
    expect(element).toHaveAttribute("aria-describedby", "test-error");

    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("allows users to type in the textarea", () => {
    render(<Textarea name="componentName" label="Test Label" />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test input" } });

    expect(textarea).toHaveValue("Test input");
  });

  it("should render the textarea with the define rows from the variable TEXT_AREA_ROWS", () => {
    render(<Textarea name="componentName" label="Test Label" />);

    const textarea = screen.getByRole("textbox");

    expect(textarea.getAttribute("rows")).toEqual(TEXT_AREA_ROWS.toString());
  });

  it("should set the maxLength", () => {
    const maxLength = 10;
    getInputProps.mockImplementationOnce(() => ({
      id: "componentName",
    }));

    render(
      <Textarea
        name="componentName"
        label="Test Label"
        maxLength={maxLength}
      />,
    );
    const textarea = screen.getByRole("textbox");

    expect(textarea.getAttribute("maxLength")).toBe(maxLength.toString());
  });

  it("should render with aria-describedby attribute", () => {
    const ariaDescribedby = "test-description";

    const { getByRole } = render(
      <Textarea
        name="componentName"
        label="Test Label"
        ariaDescribedby={ariaDescribedby}
      />,
    );

    const textarea = getByRole("textbox");
    expect(textarea.getAttribute("aria-describedby")).toBe(ariaDescribedby);
  });

  describe("Textarea field with aria-required attribute", () => {
    it("has aria-required attribute set to true if errorMessages contain inputRequired", () => {
      render(
        <Textarea
          name="test"
          errorMessages={[{ code: "required", text: "error" }]}
        />,
      );
      const element = screen.getByRole("textbox");
      expect(element).toHaveAttribute("aria-required", "true");
    });

    it("has aria-required attribute set to false if errorMessages do not contain inputRequired", () => {
      render(<Textarea name="test" errorMessages={undefined} />);
      const element = screen.getByRole("textbox");
      expect(element).toHaveAttribute("aria-required", "false");
    });
  });
});
