import { render } from "@testing-library/react";
import Image from "../Image";

describe("Image", () => {
  const altText = "Alt Text";

  it("should render an image as an <img> tag", () => {
    const { getByRole } = render(
      <Image url="photo.jpg" alternativeText={altText} />,
    );
    const image = getByRole("img");
    expect(image).toBeVisible();
  });

  it("should render SVGs inline", () => {
    const { getByRole } = render(<Image svgString="<svg></svg>" />);
    const image = getByRole("img");
    expect(image).toBeVisible();
    expect(image.tagName).toBe("svg");
  });

  it("should handle broken markup", () => {
    const { queryByRole } = render(<Image svgString="<wrong>notHtml" />);
    expect(queryByRole("img")).toBeNull();
  });

  it("svgs are aria-hidden without altText", () => {
    const { queryByRole } = render(<Image svgString="<svg></svg>" />);
    expect(queryByRole("img")).toHaveAttribute("aria-hidden");
  });

  it("altText on svgs are rendered as <title>", () => {
    const { getByTitle } = render(
      <Image svgString="<svg></svg>" alternativeText={altText} />,
    );
    const image = getByTitle(altText);
    expect(image.parentElement?.tagName).toBe("svg");
    expect(image).not.toHaveAttribute("aria-hidden");
  });

  it("should render an image as with aria-hidden as true", () => {
    const { container } = render(<Image url="photo.jpg" ariaHidden />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("aria-hidden", "true");
  });

  it("should render an image as with aria-hidden as false", () => {
    const { container } = render(<Image url="photo.jpg" ariaHidden={false} />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("aria-hidden", "false");
  });

  it("should render an image without aria-hidden element if ariaHidden props is undefined", () => {
    const { container } = render(<Image url="photo.jpg" />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).not.toHaveAttribute("aria-hidden");
  });

  it("should render an image with empty alt text as decorative if alternativeText undefined", () => {
    const { container } = render(<Image url="photo.jpg" />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "");
  });
});
