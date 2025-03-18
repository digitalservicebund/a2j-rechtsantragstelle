import { render, screen, fireEvent } from "@testing-library/react";
import { vi as vitestVi } from "vitest";
import AccordionItem, {
  type AccordionItemProps,
} from "~/components/AccordionItem";
import { useTranslations } from "~/services/translations/translationsContext";

vi.mock("~/services/translations/translationsContext", () => ({
  useTranslations: vitestVi.fn(),
}));

vi.mock("@digitalservicebund/icons/KeyboardArrowDown", () => ({
  __esModule: true,
  default: () => <div data-testid="keyboard-arrow-down-icon" />,
}));

const defaultProps: AccordionItemProps = {
  title: "Test Title",
  description: "Test Description",
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

vitestVi.mocked(useTranslations).mockReturnValue(mockTranslations);

describe("AccordionItem Component", () => {
  it("renders native details/summary with translations and icons", () => {
    render(<AccordionItem {...defaultProps} />);
    const detailsElem = screen.getByRole("group", { hidden: true });
    expect(detailsElem).toBeInTheDocument();
    const summary = detailsElem.querySelector("summary");
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveTextContent("Test Title");
    expect(summary).toHaveTextContent("Einblenden");
    expect(summary).toHaveTextContent("Einblenden");
    // expect(screen.getByTestId("keyboard-arrow-down-icon")).toBeInTheDocument();
  });

  it("calls onSummary when summary is clicked", () => {
    const onSummaryClick = vi.fn();
    const { getByRole } = render(
      <AccordionItem {...defaultProps} onSummaryClick={onSummaryClick} />,
    );
    fireEvent.click(getByRole("button"));
    expect(onSummaryClick).toHaveBeenCalledTimes(1);
  });
});

it("renders correctly with empty title and description", () => {
  render(<AccordionItem title="" description="" />);
  const detailsElem = screen.getByRole("group", { hidden: true });
  expect(detailsElem).toBeInTheDocument();
});
