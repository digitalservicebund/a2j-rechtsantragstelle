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

  test("Link can have custom styling", () => {
    render(
      <StandaloneLink
        url={"/home"}
        text={"Internal Link, custom styling"}
        look={"ds-label-03-bold"}
      />,
    );
    expect(screen.getByText("Internal Link, custom styling")).toHaveClass(
      "ds-label-03-bold",
    );
  });
});
