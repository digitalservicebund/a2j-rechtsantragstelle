import { render, screen } from "@testing-library/react";
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
    expect(screen.getByTestId("keyboard-arrow-down-icon")).toBeInTheDocument();
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
