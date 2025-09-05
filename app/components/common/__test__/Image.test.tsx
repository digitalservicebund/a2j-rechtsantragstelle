import { act, render } from "@testing-library/react";
import Image from "../Image";

describe("Image", () => {
  const altText = "Alt Text";

  it("should render an image as an <img> tag", () => {
    const { getByRole } = render(
      <Image url="photo.jpg" alternativeText={altText} />,
    );
    const image = getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toBeInstanceOf(HTMLImageElement);
  });

  it("should render an svg image inline instead of as an <img> tag", async () => {
    const { getByTitle } = await act(() =>
      render(
        <Image url="a.svg" svgString="<svg></svg>" alternativeText={altText} />,
      ),
    );
    expect(getByTitle(altText).parentElement?.tagName).toBe("svg");
  });

  it("should render an image as with aria-hidden as true", () => {
    const { container } = render(
      <Image url="photo.jpg" alternativeText={altText} ariaHidden />,
    );
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("aria-hidden", "true");
  });

  it("should render an image as with aria-hidden as false", () => {
    const { container } = render(
      <Image url="photo.jpg" alternativeText={altText} ariaHidden={false} />,
    );
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("aria-hidden", "false");
  });

  it("should render an image without aria-hidden element if ariaHidden props is undefined", () => {
    const { container } = render(
      <Image url="photo.jpg" alternativeText={altText} />,
    );
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
