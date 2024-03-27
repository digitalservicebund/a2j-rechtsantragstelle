import { fireEvent, render, screen } from "@testing-library/react";
import Button from "~/components/Button";

describe("Button Component", () => {
  test("works for button click event", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalled();
  });

  test("works for button space keydown event", () => {
    const handleKeydown = jest.fn();
    render(<Button onKeyDown={handleKeydown} />);
    fireEvent.keyDown(screen.getByRole("button"), {
      key: "Space",
      code: "Space",
    });

    expect(handleKeydown).toHaveBeenCalled();
  });

  test("renders button without any additional props", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders button with full width prop", () => {
    render(<Button fullWidth />);

    expect(screen.getByRole("button").className).toEqual(
      "ds-button ds-button-full-width",
    );
  });

  test("renders button with different look prop", () => {
    render(<Button look="secondary" />);

    expect(screen.getByRole("button")).toHaveClass("ds-button-secondary");
  });

  test("renders button with different size prop", () => {
    render(<Button size="large" />);

    expect(screen.getByRole("button")).toHaveClass("ds-button-large");
  });

  test("renders button as a link with href prop", () => {
    render(<Button href="mockHref">Download</Button>);

    expect(screen.getByText("Download").closest("a")).toHaveAttribute(
      "href",
      "mockHref",
    );
  });

  test("renders button with iconLeft and iconRight props", () => {
    const { container } = render(
      <Button
        iconLeft={<div className="icon-left" />}
        iconRight={<div className="icon-right" />}
      />,
    );

    expect(container.querySelector(".icon-left")).toBeInTheDocument();
    expect(container.querySelector(".icon-right")).toBeInTheDocument();
  });

  test("renders button with downloadFile prop", () => {
    render(
      <Button href="mockHref" downloadFile="file.pdf">
        Download
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("download", "file.pdf");
    expect(screen.getByText("Download").closest("a")).not.toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByText("Download").closest("a")).not.toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  test("renders button with openInNewTab prop", () => {
    render(
      <Button href="mockHref" openInNewTab>
        Download
      </Button>,
    );
    expect(screen.getByText("Download").closest("a")).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByText("Download").closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
