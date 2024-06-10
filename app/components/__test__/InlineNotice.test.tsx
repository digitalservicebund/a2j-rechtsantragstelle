import { render, screen, type RenderResult } from "@testing-library/react";
import { InlineNotice } from "~/components/InlineNotice";

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
    expect(note).toContainElement(screen.getByTestId("WarningAmberIcon"));
  });

  it("renders tips icon", () => {
    component = render(<InlineNotice look="tips" {...mockProps} />);
    expect(screen.getByRole("note")).toContainElement(
      screen.getByTestId("LightbulbOutlinedIcon"),
    );
  });

  it("doesn't render without content", () => {
    component = render(<InlineNotice look="tips" {...mockProps} content="" />);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });
});
