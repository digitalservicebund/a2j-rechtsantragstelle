import { render, screen } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  it("should render heading, title, description and button", () => {
    render(
      <Card
        heading="Heading"
        title="Title"
        description="Description"
        buttonLabel="Click me"
        id="card-1"
        link={"/link"}
      />,
    );

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Click me" })).toBeInTheDocument();
  });

  it("should link button to heading via aria-describedby", () => {
    render(
      <Card
        heading="Heading"
        title="Title"
        description="Description"
        buttonLabel="Click me"
        id="card-1"
        link={"/link"}
      />,
    );

    const button = screen.getByRole("link", { name: "Click me" });

    expect(button).toHaveAttribute("aria-describedby", "card-1");
  });
});
