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
      />,
    );

    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("should link button to heading via aria-describedby", () => {
    render(
      <Card
        heading="Heading"
        title="Title"
        description="Description"
        buttonLabel="Click me"
        id="card-1"
      />,
    );

    const heading = screen.getByText("Heading");
    const button = screen.getByRole("button", { name: "Click me" });

    expect(button).toHaveAttribute("aria-describedby", heading.id);
  });
});
