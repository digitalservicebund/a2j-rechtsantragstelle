import { render } from "@testing-library/react";
import type { Variant } from "~/components/BoxWithImage";
import BoxWithImage, { variantWidths } from "~/components/BoxWithImage";

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
  )(
    "image variant %s should have proper styling",
    (imageVariant, expectedStyle) => {
      const { getByAltText } = render(
        <BoxWithImage
          variant={imageVariant}
          image={{ url: "image.png", alternativeText: imageAltText }}
          content="Wow great image!"
        />,
      );
      const imageContainer =
        getByAltText(imageAltText).parentElement?.parentElement;
      const shouldWrap = imageVariant === "XL" || imageVariant === "XXL";
      const flexContainer = imageContainer?.parentElement;
      expect(flexContainer).toHaveClass(
        shouldWrap ? "md:flex-wrap" : "sm:flex-nowrap",
      );
      expect(imageContainer).toHaveClass(expectedStyle);
    },
  );

  it("should display just an image if there is no text content", () => {
    const { getByAltText } = render(
      <BoxWithImage
        image={{ url: "image.png", alternativeText: imageAltText }}
      />,
    );
    const image = getByAltText(imageAltText);
    expect(image).toBeInTheDocument();
    expect(image.parentElement?.parentElement).toHaveClass("max-w-full");
  });
});
