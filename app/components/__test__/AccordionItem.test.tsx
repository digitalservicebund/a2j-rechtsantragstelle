import { render, screen, fireEvent } from "@testing-library/react";
import { vi as vitestVi } from "vitest";
import AccordionItem, { Props } from "~/components/AccordionItem";
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
  const defaultProps: Props = {
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

  describe("JS Enabled Branch", () => {
    it("renders correctly in closed state", () => {
      render(<AccordionItem {...defaultProps} />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(
        screen.getByTestId("keyboard-arrow-down-icon"),
      ).toBeInTheDocument();
      expect(screen.queryByText("Test Description")).not.toBeVisible();
    });

    it("renders correctly in open state", () => {
      render(<AccordionItem {...defaultProps} isOpen={true} />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByTestId("keyboard-arrow-up-icon")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("calls onToggle when summary is clicked", () => {
      const onToggleMock = vi.fn();
      render(<AccordionItem {...defaultProps} onToggle={onToggleMock} />);
      fireEvent.click(
        screen.getByRole("group", { hidden: true }).querySelector("summary")!,
      );
      expect(onToggleMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Fallback (No JS) Branch", () => {
    const fallbackProps: Props = {
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
  });
});
