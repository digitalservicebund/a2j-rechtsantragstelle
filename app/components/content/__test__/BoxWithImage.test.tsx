import { render } from "@testing-library/react";
import type { Variant } from "~/components/content/BoxWithImage";
import BoxWithImage, { variantWidths } from "~/components/content/BoxWithImage";

describe("BoxWithImage", () => {
  const imageAltText = "Alt text";
  it("should render", () => {
    const imageText = "A beautiful image";
    const headerText = "Some title description";
    const { getByText, getByAltText } = render(
      <BoxWithImage
        image={{ alternativeText: imageAltText, url: "image.png" }}
        content={imageText}
        heading={{ text: headerText }}
      />,
    );
    expect(getByText(imageText)).toBeInTheDocument();
    expect(getByText(headerText)).toBeInTheDocument();
    expect(getByAltText(imageAltText)).toBeInTheDocument();
  });

  it.each(
    Object.entries(variantWidths).map(([key, value]) => [
      key as Variant,
      value,
    ]),
  )("image variant %s should have proper styling", (imageVariant) => {
    const { getByAltText } = render(
      <BoxWithImage
        variant={imageVariant}
        image={{ url: "image.png", alternativeText: imageAltText }}
        content="Wow great image!"
      />,
    );
    const imageContainer = getByAltText(imageAltText);
    expect(imageContainer).toBeInTheDocument();
  });

  it("should display just an image if there is no text content", () => {
    const { getByAltText } = render(
      <BoxWithImage
        image={{ url: "image.png", alternativeText: imageAltText }}
      />,
    );
    const image = getByAltText(imageAltText);
    expect(image).toBeInTheDocument();
  });
});
