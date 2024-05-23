import { render } from "@testing-library/react";
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
    const { container } = render(
      <InfoBox separator={true} items={mockInfoBoxItems} />,
    );
    expect(container.querySelector(".ds-stack-32")).toBeInTheDocument();
  });
  it("has expected padding when the separator is disabled", () => {
    const { container } = render(
      <InfoBox separator={false} items={mockInfoBoxItems} />,
    );
    expect(container.querySelector(".ds-stack-48")).toBeInTheDocument();
  });
  it("has expected padding when the separator is unset", () => {
    const { container } = render(<InfoBox items={mockInfoBoxItems} />);
    expect(container.querySelector(".ds-stack-32")).toBeInTheDocument();
  });
});
