import { act, render } from "@testing-library/react";
import Image from "../Image";

describe("Image", () => {
  const altText = "Alt Text";
  it("should not render if the url is not provided", () => {
    const { queryByAltText } = render(<Image alternativeText={altText} />);
    expect(queryByAltText(altText)).not.toBeInTheDocument();
  });

  it("should render an image as an <img> tag", () => {
    const { getByRole } = render(
      <Image url="photo.jpg" alternativeText={altText} />,
    );
    const image = getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toBeInstanceOf(HTMLImageElement);
  });

  it("should render an svg image inline instead of as an <img> tag", async () => {
    const { queryByRole } = await act(() =>
      render(<Image url="image.svg" alternativeText={altText} />),
    );
    // since react-inlinesvg parses an actual svg to create the DOM,
    // we basically just need to ensure that an <img> isn't present
    expect(queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render a noscript without JS", async () => {
    vi.mock(import("react"), async (importOriginal) => ({
      ...(await importOriginal()),
      useState: vi.fn().mockReturnValue([false, vi.fn()]),
    }));

    const { baseElement } = await act(() =>
      render(<Image url="image.svg" alternativeText={altText} />),
    );
    expect(baseElement).toContainHTML("<noscript>");
  });
});
