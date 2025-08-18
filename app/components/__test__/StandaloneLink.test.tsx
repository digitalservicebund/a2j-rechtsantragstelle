import { render, screen } from "@testing-library/react";
import { StandaloneLink } from "../common/StandaloneLink";

describe("Standalone Button Component", () => {
  test("Displays an external link", () => {
    render(
      <StandaloneLink url={"https://blank.blank"} text={"External Link"} />,
    );
    expect(screen.getByText("External Link")).toBeInTheDocument();
    expect(screen.getByTestId("OpenInNewIcon")).toBeInTheDocument();
  });

  test("Displays an external link if link is to download a pdf", () => {
    render(
      <StandaloneLink url={"anyUrl//download/pdf"} text={"External Link"} />,
    );
    expect(screen.getByText("External Link")).toBeInTheDocument();
    expect(screen.getByTestId("OpenInNewIcon")).toBeInTheDocument();
  });

  test("Displays an external link if url is string interpolation", () => {
    render(<StandaloneLink url={"{{externalUrl}}"} text={"External Link"} />);
    expect(screen.getByText("External Link")).toBeInTheDocument();
    expect(screen.getByTestId("OpenInNewIcon")).toBeInTheDocument();
  });

  test("Displays no icon if the input link isn't external", () => {
    render(<StandaloneLink url={"/home"} text={"Internal Link"} />);
    expect(screen.queryByTestId("OpenInNewIcon")).not.toBeInTheDocument();
  });

  test("Displays a custom icon", () => {
    render(
      <StandaloneLink
        url={"/home"}
        text={"Internal Link, custom icon"}
        icon={<p>Hello World</p>}
      />,
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("should have aria label for external link", () => {
    const { getByText } = render(
      <StandaloneLink url={"https://external.url.de"} text={"external link"} />,
    );
    const linkElement = getByText("external link");

    expect(linkElement).toHaveAttribute(
      "aria-label",
      "external link, öffnet neues Fenster",
    );
  });

  test("should not have aria label for internal link", () => {
    const { getByText } = render(
      <StandaloneLink url={"/standalone"} text={"internal link"} />,
    );
    const linkElement = getByText("internal link");

    expect(linkElement).not.toHaveAttribute(
      "aria-label",
      "internal link, öffnet neues Fenster",
    );
  });

  test("Render className coming from the props", () => {
    render(
      <StandaloneLink
        url={"/home"}
        text={"Internal Link"}
        className="oneClassName twoClassName"
      />,
    );
    expect(screen.getByText("Internal Link")).toHaveClass("oneClassName");
    expect(screen.getByText("Internal Link")).toHaveClass("twoClassName");
  });

  test("Render className with iniline-block and min-height", () => {
    render(<StandaloneLink url={"/home"} text={"Internal Link"} />);
    expect(screen.getByText("Internal Link")).toHaveClass("min-h-[24px]");
  });
});
