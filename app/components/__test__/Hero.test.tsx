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
});
