import { fireEvent, render, screen } from "@testing-library/react";
import KernButton from "~/components/kern/KernButton";

describe("Button Component", () => {
  test("works for button click event", () => {
    const handleClick = vi.fn();
    render(<KernButton onClick={handleClick}>Click Me</KernButton>);
    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalled();
  });

  test("works for button space keydown event", () => {
    const handleKeydown = vi.fn();
    render(<KernButton onKeyDown={handleKeydown} />);
    fireEvent.keyDown(screen.getByRole("button"), {
      key: "Space",
      code: "Space",
    });

    expect(handleKeydown).toHaveBeenCalled();
  });

  test("renders button without any additional props", () => {
    render(<KernButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders button with full width prop", () => {
    render(<KernButton fullWidth />);

    expect(screen.getByRole("button")).toHaveClass(
      "kern-btn kern-btn--primary kern-btn--block",
    );
  });

  test("renders button as a link with href prop", () => {
    render(<KernButton href="mockHref">Download</KernButton>);

    expect(screen.getByText("Download").closest("a")).toHaveAttribute(
      "href",
      "mockHref",
    );
  });

  test("renders button with iconLeft and iconRight props", () => {
    const { container } = render(
      <KernButton
        iconLeft={<div className="icon-left" />}
        iconRight={<div className="icon-right" />}
      />,
    );

    expect(container.querySelector(".icon-left")).toBeInTheDocument();
    expect(container.querySelector(".icon-right")).toBeInTheDocument();
  });

  test("Full URL renders link with blank target", () => {
    render(<KernButton href="https://www.test.com">Download</KernButton>);
    const buttonElem = screen.getByText("Download");
    expect(buttonElem.closest("a")).toHaveAttribute("target", "_blank");
    expect(buttonElem.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  test("renders button with data-testid from props", () => {
    render(
      <KernButton data-testid="anyTestId" href="mockHref">
        Download
      </KernButton>,
    );
    expect(screen.getByTestId("anyTestId")).toBeInTheDocument();
  });
});
