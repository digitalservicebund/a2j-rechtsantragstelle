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

  it("should render buttons when provided", () => {
    const { queryByText } = render(
      <Hero
        heading={{ text: "someText" }}
        buttons={[
          { text: "Button 1", href: "/link-1", look: "primary" },
          { text: "Button 2", href: "/link-2", look: "secondary" },
        ]}
      />,
    );

    expect(queryByText("Button 1")).toBeInTheDocument();
    expect(queryByText("Button 2")).toBeInTheDocument();
  });

  it("should not render ButtonContainer when no buttons provided", () => {
    const { container } = render(<Hero heading={{ text: "someText" }} />);

    expect(
      container.querySelector(".ds-button-container"),
    ).not.toBeInTheDocument();
  });
});
