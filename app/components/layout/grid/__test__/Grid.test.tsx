import { render } from "@testing-library/react";
import { Grid } from "../Grid";
import type { Background } from "../types";

describe("Grid Component", () => {
  it("renders background element when background prop is provided", () => {
    const background: Background = {
      className: "bg-blue-500",
      smColumn: { start: 1, span: 12 },
    };

    const { container } = render(
      <Grid background={background}>
        <div>Test content</div>
      </Grid>,
    );

    const backgroundElement = container.querySelector(
      '[aria-hidden="true"]',
    )?.firstChild;
    expect(backgroundElement).toBeInTheDocument();
    expect(backgroundElement).toHaveClass("bg-blue-500");
  });

  it("applies responsive grid classes for background", () => {
    const background: Background = {
      className: "bg-gray-100",
      smColumn: { start: 2, span: 10 },
      mdColumn: { start: 3, span: 8 },
      lgColumn: { start: 4, span: 6 },
      xlColumn: { start: 5, span: 4 },
    };

    const { container } = render(
      <Grid background={background}>
        <div>Test content</div>
      </Grid>,
    );

    const backgroundElement = container.querySelector('[aria-hidden="true"]');
    expect(backgroundElement).toHaveClass(
      "col-start-2",
      "col-span-10",
      "md:col-start-3",
      "md:col-span-8",
      "lg:col-start-4",
      "lg:col-span-6",
      "xl:col-start-5",
      "xl:col-span-4",
    );
  });

  it("only applies sm classes when md, lg, xl are not provided", () => {
    const background: Background = {
      className: "bg-gray-100",
      smColumn: { start: 2, span: 10 },
    };

    const { container } = render(
      <Grid background={background}>
        <div>Test content</div>
      </Grid>,
    );

    const backgroundElement = container.querySelector('[aria-hidden="true"]');
    expect(backgroundElement).toHaveClass("col-start-2", "col-span-10");
    expect(backgroundElement).not.toHaveClass(
      "md:col-start-3",
      "md:col-span-8",
      "lg:col-start-4",
      "lg:col-span-6",
      "xl:col-start-5",
      "xl:col-span-4",
    );
  });

  it("only applies sm and md classes when lg, xl are not provided", () => {
    const background: Background = {
      className: "bg-gray-100",
      smColumn: { start: 1, span: 12 },
      mdColumn: { start: 2, span: 10 },
    };

    const { container } = render(
      <Grid background={background}>
        <div>Test content</div>
      </Grid>,
    );

    const backgroundElement = container.querySelector('[aria-hidden="true"]');
    expect(backgroundElement).toHaveClass(
      "col-start-1",
      "col-span-12",
      "md:col-start-2",
      "md:col-span-10",
    );
    expect(backgroundElement).not.toHaveClass(
      "lg:col-start-4",
      "lg:col-span-6",
      "xl:col-start-5",
      "xl:col-span-4",
    );
  });

  it("only applies lg , xl and sm classes when md are not provided", () => {
    const background: Background = {
      className: "bg-gray-100",
      lgColumn: { start: 3, span: 6 },
      xlColumn: { start: 4, span: 4 },
    };

    const { container } = render(
      <Grid background={background}>
        <div>Test content</div>
      </Grid>,
    );

    const backgroundElement = container.querySelector('[aria-hidden="true"]');
    expect(backgroundElement).toHaveClass(
      "col-start-1",
      "col-span-12",
      "lg:col-start-3",
      "lg:col-span-6",
      "xl:col-start-4",
      "xl:col-span-4",
    );
    expect(backgroundElement).not.toHaveClass(
      "md:col-start-2",
      "md:col-span-10",
    );
  });

  it("does not render background element when background prop is not provided", () => {
    const { container } = render(
      <Grid>
        <div>Test content</div>
      </Grid>,
    );

    const backgroundElement = container.querySelector('[aria-hidden="true"]');
    expect(backgroundElement).not.toBeInTheDocument();
  });
});
