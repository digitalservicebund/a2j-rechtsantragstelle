import { render } from "@testing-library/react";
import Image from "../Image";

describe("Image", () => {
  const altText = "Alt Text";
  it("should not render if the url is not provided", () => {
    const { queryByAltText } = render(<Image alternativeText={altText} />);
    expect(queryByAltText(altText)).not.toBeInTheDocument();
  });

  it("should render an image as an <img> tag", () => {
    const { getByAltText } = render(
      <Image url="photo.jpg" alternativeText={altText} />,
    );
    const image = getByAltText(altText);
    expect(image).toBeInTheDocument();
    expect(image).toBeInstanceOf(HTMLImageElement);
  });

  it("should render an svg image inline instead of as an <img> tag", () => {
    const { queryByAltText } = render(
      <Image url="image.svg" alternativeText={altText} />,
    );
    // since react-inlinesvg parses an actual svg to create the DOM,
    // we basically just need to ensure that an <img> isn't present
    expect(queryByAltText(altText)).not.toBeInTheDocument();
  });
});
