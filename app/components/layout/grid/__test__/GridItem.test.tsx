import { render } from "@testing-library/react";
import { GridItem } from "../GridItem";

describe("GridItem Component", () => {
  it("applies default sm column classes", () => {
    const { container } = render(
      <GridItem>
        <div>Test content</div>
      </GridItem>,
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveClass(
      "col-start-1",
      "col-span-12",
      "[grid-row:1]",
      "z-10",
    );
  });

  it("applies custom sm column classes", () => {
    const { container } = render(
      <GridItem smColumn={{ start: 2, span: 6 }}>
        <div>Test content</div>
      </GridItem>,
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveClass("col-start-2", "col-span-6");
  });

  it("applies md column classes when provided", () => {
    const { container } = render(
      <GridItem mdColumn={{ start: 3, span: 8 }}>
        <div>Test content</div>
      </GridItem>,
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveClass("md:col-start-3", "md:col-span-8");
  });

  it("applies lg column classes when provided", () => {
    const { container } = render(
      <GridItem lgColumn={{ start: 4, span: 6 }}>
        <div>Test content</div>
      </GridItem>,
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveClass("lg:col-start-4", "lg:col-span-6");
  });

  it("applies xl column classes when provided", () => {
    const { container } = render(
      <GridItem xlColumn={{ start: 5, span: 4 }}>
        <div>Test content</div>
      </GridItem>,
    );

    const item = container.firstChild as HTMLElement;
    expect(item).toHaveClass("xl:col-start-5", "xl:col-span-4");
  });

  it("does not apply md classes when mdColumn is not provided", () => {
    const { container } = render(
      <GridItem>
        <div>Test content</div>
      </GridItem>,
    );

    const item = container.firstChild as HTMLElement;
    expect(item).not.toHaveClass("md:col-start-3", "md:col-span-8");
  });
});
