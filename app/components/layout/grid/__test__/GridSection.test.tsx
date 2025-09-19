import { render } from "@testing-library/react";
import { GridSection } from "../GridSection";

describe("GridSection Component", () => {
  it("applies background class", () => {
    const { container } = render(
      <GridSection backgroundClass="bg-blue-500">
        <div>Test content</div>
      </GridSection>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-blue-500");
  });

  it("applies padding classes from pt and pb props", () => {
    const { container } = render(
      <GridSection pt="16" pb="24">
        <div>Test content</div>
      </GridSection>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("pt-16", "pb-24");
  });

  it("converts default padding values", () => {
    const { container } = render(
      <GridSection pt="default" pb="default">
        <div>Test content</div>
      </GridSection>,
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass("pt-40", "pb-40");
  });

  it("does not apply padding classes when pt and pb are not provided", () => {
    const { container } = render(
      <GridSection>
        <div>Test content</div>
      </GridSection>,
    );

    const section = container.querySelector("section");
    expect(section).not.toHaveClass("pt-16", "pb-24", "pt-40", "pb-40");
  });
});
