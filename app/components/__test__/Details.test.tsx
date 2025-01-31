import { render, screen, fireEvent } from "@testing-library/react";
import { Details } from "~/components/Details";

const testContent = "Test Content";
describe("Details", () => {
  it("renders title and content correctly", () => {
    render(<Details title="Test Title" content="Test Content" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("renders RichText with correct html", () => {
    render(
      <Details title="Test Title" content="<strong>Test Markdown</strong>" />,
    );
    expect(screen.getByText("Test Markdown")).toBeInTheDocument();
  });

  it("toggles visibility of content on summary click", () => {
    render(<Details title="Test Title" content="Test Content" />);
    const summaryElement = screen.getByText("Test Title");
    fireEvent.click(summaryElement);
    expect(screen.getByText(testContent)).toBeVisible();
    fireEvent.click(summaryElement);
    expect(screen.getByText(testContent)).not.toBeVisible();
  });
});
