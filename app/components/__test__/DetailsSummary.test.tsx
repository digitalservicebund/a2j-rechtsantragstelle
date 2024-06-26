import { render, screen, fireEvent } from "@testing-library/react";
import { DetailsSummary } from "~/components/DetailsSummary";

const testContent = "Test Content";
describe("DetailsSummary", () => {
  it("renders title and content correctly", () => {
    render(<DetailsSummary title="Test Title" content="Test Content" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("renders RichText with correct markdown", () => {
    render(<DetailsSummary title="Test Title" content="**Test Markdown**" />);
    expect(screen.getByText("Test Markdown")).toBeInTheDocument();
  });

  it("toggles visibility of content on summary click", () => {
    render(<DetailsSummary title="Test Title" content="Test Content" />);
    const summaryElement = screen.getByText("Test Title");
    fireEvent.click(summaryElement);
    expect(screen.getByText(testContent)).toBeVisible();
    fireEvent.click(summaryElement);
    expect(screen.getByText(testContent)).not.toBeVisible();
  });
});
