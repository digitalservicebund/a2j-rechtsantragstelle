import { render, screen } from "@testing-library/react";
import { StandaloneLink } from "../StandaloneLink";

describe("Standalone Button Component", () => {
  test("Displays an external link", () => {
    render(
      <StandaloneLink url={"https://blank.blank"} text={"External Link"} />,
    );
    expect(screen.getByText("External Link")).toBeInTheDocument();
    expect(screen.getByTestId("OpenInNewIcon")).toBeInTheDocument();
    expect(screen.getByTitle("öffnet neues Fenster")).toBeInTheDocument();
  });

  test("Displays an external link if link is to download a pdf", () => {
    render(
      <StandaloneLink url={"anyUrl//download/pdf"} text={"External Link"} />,
    );
    expect(screen.getByText("External Link")).toBeInTheDocument();
    expect(screen.getByTestId("OpenInNewIcon")).toBeInTheDocument();
    expect(screen.getByTitle("öffnet neues Fenster")).toBeInTheDocument();
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
    expect(screen.getByText("Internal Link")).toHaveClass("inline-block");
    expect(screen.getByText("Internal Link")).toHaveClass("min-h-[24px]");
  });
});
