import { render } from "@testing-library/react";
import Hero from "../Hero";

describe("Hero", () => {
  it("should render the component with the heading", () => {
    const { queryByText } = render(<Hero heading={{ text: "someText" }} />);

    expect(queryByText("someText")).toBeInTheDocument();
  });

  it("should render the component with the content", () => {
    const { queryByText } = render(
      <Hero heading={{ text: "someText" }} content={{ html: "someContent" }} />,
    );

    expect(queryByText("someContent")).toBeInTheDocument();
  });

  it("should render button when provided", () => {
    const { queryByText } = render(
      <Hero
        heading={{ text: "someText" }}
        button={{ text: "Button 1", href: "/link-1", look: "primary" }}
      />,
    );

    expect(queryByText("Button 1")).toBeInTheDocument();
  });

  it("should not render ButtonContainer when no button provided", () => {
    const { container } = render(<Hero heading={{ text: "someText" }} />);

    expect(
      container.querySelector(".ds-button-container"),
    ).not.toBeInTheDocument();
  });
});
