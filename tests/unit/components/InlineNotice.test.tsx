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
      heading: {
        text: "Achtung!",
        tagName: "h2",
        look: "ds-label-01-bold",
      },
      look: "warning",
      content: "Test content",
    } as const;

    component = render(
      <InlineNotice
        identifier={mockProps.identifier}
        heading={mockProps.heading}
        look={mockProps.look}
        content={mockProps.content}
      />,
    );

    expect(screen.getByText(mockProps.heading.text)).toBeInTheDocument();
    expect(screen.getByText(mockProps.content)).toBeInTheDocument();
    expect(screen.getByTestId(WARNING_ICON_ID)).toBeInTheDocument();
  });

  it("renders tips notice correctly with all props provided", () => {
    const TIPS_ICON_ID = "LightbulbOutlinedIcon";

    const mockProps = {
      identifier: "test-identifier",
      heading: {
        text: "Achtung!",
        tagName: "h2",
        look: "ds-label-01-bold",
      },
      look: "tips",
      content: "Test content",
    } as const;

    component = render(
      <InlineNotice
        identifier={mockProps.identifier}
        heading={mockProps.heading}
        look={mockProps.look}
        content={mockProps.content}
      />,
    );

    expect(screen.getByText(mockProps.heading.text)).toBeInTheDocument();
    expect(screen.getByText(mockProps.content)).toBeInTheDocument();
    expect(screen.getByTestId(TIPS_ICON_ID)).toBeInTheDocument();
  });
});
