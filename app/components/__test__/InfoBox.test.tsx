import { render, screen } from "@testing-library/react";
import InfoBox from "~/components/InfoBox";

const mockInfoBoxItems = [
  {
    label: undefined,
    headline: undefined,
    image: undefined,
    content: "Lorem1",
    buttons: [],
  },
  {
    label: undefined,
    headline: undefined,
    image: undefined,
    content: "Lorem2",
    buttons: [],
  },
];

describe("InfoBox", () => {
  it("has expected padding when the separator is enabled", () => {
    render(<InfoBox separator={true} items={mockInfoBoxItems} />);
    expect(screen.getByRole("list")).toHaveClass("ds-stack-32");
  });
  it("has expected padding when the separator is disabled", () => {
    render(<InfoBox separator={false} items={mockInfoBoxItems} />);
    expect(screen.getByRole("list")).toHaveClass("ds-stack-48");
  });
  it("has expected padding when the separator is unset", () => {
    render(<InfoBox items={mockInfoBoxItems} />);
    expect(screen.getByRole("list")).toHaveClass("ds-stack-32");
  });
});
