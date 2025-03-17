import { render, screen, fireEvent } from "@testing-library/react";
import { vi as vitestVi } from "vitest";
import AccordionItem, { AccordionItemProps } from "~/components/AccordionItem";
import { useTranslations } from "~/services/translations/translationsContext";

vi.mock("~/services/translations/translationsContext", () => ({
  useTranslations: vitestVi.fn(),
}));

vi.mock("@digitalservicebund/icons/KeyboardArrowDown", () => ({
  __esModule: true,
  default: () => <div data-testid="keyboard-arrow-down-icon" />,
}));

vi.mock("@digitalservicebund/icons/KeyboardArrowUp", () => ({
  __esModule: true,
  default: () => <div data-testid="keyboard-arrow-up-icon" />,
}));

describe("AccordionItem Component", () => {
  const defaultProps: AccordionItemProps = {
    title: "Test Title",
    description: "Test Description",
    id: 1,
    isOpen: false,
    onToggle: vi.fn(),
    jsEnabled: true,
  };

  const mockTranslations = {
    feedback: {},
    video: {},
    accessibility: {},
    fileUpload: {},
    accordion: {
      accordionItemShow: "Einblenden",
      accordionItemHide: "Ausblenden",
    },
  };

  beforeEach(() => {
    vitestVi.mocked(useTranslations).mockReturnValue(mockTranslations);
  });

  afterEach(() => {
    vitestVi.clearAllMocks();
  });

  describe("JS-enabled (controlled) branch", () => {
    it("renders closed state correctly with translations and icons", () => {
      render(<AccordionItem {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveTextContent("Test Title");
      expect(button).toHaveTextContent("Einblenden");
      expect(
        screen.getByTestId("keyboard-arrow-down-icon"),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("keyboard-arrow-up-icon"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Test Description")).toBeNull();
    });

    it("renders open state correctly with translations and icons", () => {
      render(<AccordionItem {...defaultProps} isOpen={true} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "true");
      expect(button).toHaveTextContent("Test Title");
      expect(button).toHaveTextContent("Ausblenden");
      expect(screen.getByTestId("keyboard-arrow-up-icon")).toBeInTheDocument();
      expect(
        screen.queryByTestId("keyboard-arrow-down-icon"),
      ).not.toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("calls onToggle when the button is clicked", () => {
      const mockToggle = vitestVi.fn();
      render(<AccordionItem {...defaultProps} onToggle={mockToggle} />);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Fallback (no-JS) branch", () => {
    const fallbackProps: AccordionItemProps = {
      ...defaultProps,
      jsEnabled: false,
    };

    it("renders fallback markup using native details/summary with translations and icons", () => {
      render(<AccordionItem {...fallbackProps} />);
      const detailsElem = screen.getByRole("group", { hidden: true });
      expect(detailsElem).toBeInTheDocument();
      const summary = detailsElem.querySelector("summary");
      expect(summary).toBeInTheDocument();
      expect(summary).toHaveTextContent("Test Title");
      expect(summary).toHaveTextContent("Einblenden");
      expect(
        screen.getByTestId("keyboard-arrow-down-icon"),
      ).toBeInTheDocument();
    });

    it("renders description when fallback details is open", () => {
      render(<AccordionItem {...fallbackProps} />);
      const detailsElem = screen.getByRole("group", { hidden: true });
      detailsElem.setAttribute("open", "");
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("renders open state fallback markup with hide translations and icons", () => {
      render(<AccordionItem {...fallbackProps} />);
      const detailsElem = screen.getByRole("group", { hidden: true });
      detailsElem.setAttribute("open", "");
      const summary = detailsElem.querySelector("summary");
      expect(summary).toHaveTextContent("Ausblenden");
      expect(screen.getByTestId("keyboard-arrow-up-icon")).toBeInTheDocument();
    });

    it("renders correctly with empty title and description", () => {
      render(<AccordionItem {...fallbackProps} title="" description="" />);
      const detailsElem = screen.getByRole("group", { hidden: true });
      expect(detailsElem).toBeInTheDocument();
    });

    it("renders correctly when id is undefined", () => {
      render(<AccordionItem {...fallbackProps} id={undefined} />);
      const detailsElem = screen.getByRole("group", { hidden: true });
      expect(detailsElem).toBeInTheDocument();
    });
  });
});
