import { render, screen, type RenderResult } from "@testing-library/react";
import { InlineNotice } from "~/components/formElements/InlineNotice";

describe("InlineNotice Component", () => {
  let component: RenderResult;

  afterEach(() => {
    component.unmount();
  });

  const mockProps = {
    title: "Achtung!",
    tagName: "h2",
    content: "Test content",
  } as const;

  it("renders warning notice correctly with all props provided", () => {
    component = render(<InlineNotice look="warning" {...mockProps} />);
    const note = screen.getByRole("note");

    expect(note).toBeVisible();
    expect(note).toHaveTextContent(mockProps.title);
    expect(note).toHaveTextContent(mockProps.content);
    expect(note).toContainElement(screen.getByTestId("icon-warning"));
  });

  it("should renders a success notice correctly", () => {
    component = render(<InlineNotice look="success" {...mockProps} />);
    const note = screen.getByRole("note");
    expect(note).toContainElement(screen.getByTestId("icon-check-circle"));
    expect(note).toHaveClass("kern-alert kern-alert--success");
  });

  it("should renders an error notice correctly", () => {
    component = render(<InlineNotice look="danger" {...mockProps} />);
    const note = screen.getByRole("note");
    expect(note).toContainElement(screen.getByTestId("icon-emergency-home"));
    expect(note).toHaveClass("kern-alert kern-alert--danger");
  });

  it("renders info icon", () => {
    component = render(<InlineNotice look="info" {...mockProps} />);
    expect(screen.getByRole("note")).toContainElement(
      screen.getByTestId("icon-info"),
    );
  });

  it("doesn't render without content", () => {
    component = render(<InlineNotice look="info" {...mockProps} content="" />);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });
});
