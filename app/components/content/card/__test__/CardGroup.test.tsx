import { render, screen } from "@testing-library/react";
import CardGroup from "../CardGroup";
import { type CardGroupItem } from "../Card";

const mockCards: CardGroupItem[] = [
  {
    id: "card-1",
    heading: "Card 1",
    title: "Title 1",
    description: "Description 1",
    buttonLabel: "Click 1",
    span: 4,
  },
  {
    id: "card-2",
    heading: "Card 2",
    title: "Title 2",
    description: "Description 2",
    buttonLabel: "Click 2",
    span: 4,
  },
];

describe("CardGroup", () => {
  it("should render all cards", () => {
    render(<CardGroup cards={mockCards} />);

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("should render card content correctly", () => {
    render(<CardGroup cards={mockCards} />);

    expect(screen.getByText("Card 1")).toBeInTheDocument();
    expect(screen.getByText("Title 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Click 1" })).toBeInTheDocument();
  });

  it("should wrap each card in a grid column", () => {
    const { container } = render(<CardGroup cards={mockCards} />);

    const columns = container.querySelectorAll(".xl\\:col-span-4");

    expect(columns).toHaveLength(mockCards.length);
  });
  it("should render cards in a grid", () => {
    const { container } = render(<CardGroup cards={mockCards} />);
    expect(container.querySelector(".grid.grid-cols-12")).toBeInTheDocument();
  });

  it("should not render when cards array is empty", () => {
    const { container } = render(<CardGroup cards={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("should render a Card component for each item", () => {
    render(<CardGroup cards={mockCards} />);

    const headings = screen.getAllByText(/Card/);

    expect(headings.length).toBeGreaterThan(0);
  });
});
