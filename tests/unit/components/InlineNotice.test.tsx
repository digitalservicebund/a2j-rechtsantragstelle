import { render, screen, type RenderResult } from "@testing-library/react";
import { InlineNotice } from "~/components/InlineNotice";

describe("InlineNotice Component", () => {
  let component: RenderResult;

  afterEach(() => {
    component.unmount();
  });

  it("renders warning notice correctly with all props provided", () => {
    const WARNING_ICON_ID = "WarningAmberIcon";
    const mockProps = {
      identifier: "test-identifier",
      title: "Achtung!",
      tagName: "h2",
      look: "warning",
      content: "Test content",
    } as const;

    component = render(<InlineNotice {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.content)).toBeInTheDocument();
    expect(screen.getByTestId(WARNING_ICON_ID)).toBeInTheDocument();
  });

  it("renders tips notice correctly with all props provided", () => {
    const TIPS_ICON_ID = "LightbulbOutlinedIcon";

    const mockProps = {
      identifier: "test-identifier",
      title: "Achtung!",
      tagName: "h2",
      look: "tips",
      content: "Text **strong**\n\n* first list\n* second list",
    } as const;

    component = render(<InlineNotice {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByTestId(TIPS_ICON_ID)).toBeInTheDocument();

    const listDescription = screen.getByRole("list");

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(listDescription.querySelectorAll("li")).toHaveLength(2);
  });
});
