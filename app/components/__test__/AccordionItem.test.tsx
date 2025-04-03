import { render, screen, fireEvent } from "@testing-library/react";
import AccordionItem from "~/components/AccordionItem";

const defaultProps = {
  title: "Test Title",
  description: "Test Description",
  labels: {
    show: "Einblenden",
    hide: "Ausblenden",
  },
};

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
    expect(screen.getByTestId("KeyboardArrowDownIcon")).toBeInTheDocument();
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
