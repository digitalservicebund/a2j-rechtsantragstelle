import { render } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("should render image with label", () => {
    const { getByAltText } = render(
      <Footer image={{ url: "image.jpg", alternativeText: "label" }} />,
    );
    expect(getByAltText("label")).toBeInTheDocument();
  });

  it("should render multiple paragraphs", () => {
    const { getByText } = render(
      <Footer paragraphs={[{ html: "paragraph1" }, { html: "paragraph2" }]} />,
    );
    expect(getByText("paragraph1")).toBeInTheDocument();
    expect(getByText("paragraph2")).toBeInTheDocument();
  });

  it("should render multiple links in single list", () => {
    const { getByText, getAllByRole } = render(
      <Footer
        links={[
          { url: "url1", text: "link1" },
          { url: "url2", text: "link2" },
        ]}
      />,
    );
    expect(getAllByRole("link")).toHaveLength(2);
    expect(getAllByRole("list")).toHaveLength(1);
    expect(getByText("link1")).toBeInTheDocument();
    expect(getByText("link2")).toBeInTheDocument();
  });

  it("should render link with className pb-6", () => {
    const { getByRole } = render(
      <Footer links={[{ url: "url1", text: "link1" }]} />,
    );
    expect(getByRole("link")).toHaveClass("pb-6");
  });

  it("should render deletionBanner", () => {
    const { getByText } = render(
      <Footer showDeletionBanner={true} deletionLabel="deletionLabel" />,
    );
    expect(getByText("deletionLabel")).toBeInTheDocument();
  });
});
