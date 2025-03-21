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

  it("should render categorized links", () => {
    const categorizedLinks = [
      {
        id: 1,
        title: "Category 1",
        links: [
          { url: "/url1", text: "link1" },
          { url: "/url2", text: "link2" },
        ],
      },
    ];
    const { getByText, getAllByRole } = render(
      <Footer categorizedLinks={categorizedLinks} />,
    );
    expect(getAllByRole("link")).toHaveLength(2);
    expect(getAllByRole("list")).toHaveLength(1);
    expect(getByText("Category 1")).toBeInTheDocument();
    expect(getByText("link1")).toBeInTheDocument();
    expect(getByText("link2")).toBeInTheDocument();
  });

  it("should render deletionBanner", () => {
    const { getByText } = render(
      <Footer showDeletionBanner={true} deletionLabel="deletionLabel" />,
    );
    expect(getByText("deletionLabel")).toBeInTheDocument();
  });

  it("should render aria label translation", () => {
    const translations = { "footer-navigation": "Footer Navigation" };
    const { getByLabelText } = render(<Footer translations={translations} />);
    expect(getByLabelText("Footer Navigation")).toBeInTheDocument();
  });

  it("should render default aria label when translation is not provided", () => {
    const { getByLabelText } = render(<Footer />);
    expect(getByLabelText("footer-navigation")).toBeInTheDocument();
  });
});
