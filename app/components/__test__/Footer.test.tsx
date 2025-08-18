import { render } from "@testing-library/react";
import { translations } from "~/services/translations/translations";
import Footer from "../common/Footer";

describe("Footer", () => {
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
  it("should render image with label", () => {
    const { getByAltText } = render(
      <Footer
        image={{ url: "image.jpg", alternativeText: "label" }}
        categorizedLinks={categorizedLinks}
      />,
    );
    expect(getByAltText("label")).toBeInTheDocument();
  });

  it("should render multiple paragraphs", () => {
    const { getByText } = render(
      <Footer
        paragraphs={[{ html: "paragraph1" }, { html: "paragraph2" }]}
        categorizedLinks={categorizedLinks}
      />,
    );
    expect(getByText("paragraph1")).toBeInTheDocument();
    expect(getByText("paragraph2")).toBeInTheDocument();
  });

  it("should render categorized links", () => {
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
      <Footer showDeletionBanner={true} categorizedLinks={[]} />,
    );
    expect(
      getByText(translations["delete-data"].footerLinkLabel.de),
    ).toBeInTheDocument();
  });

  it("should render aria label translation if provided", () => {
    const ariaLabel = "Footer Navigation";
    const { getByLabelText } = render(
      <Footer ariaLabel={ariaLabel} categorizedLinks={[]} />,
    );
    expect(getByLabelText(ariaLabel)).toBeInTheDocument();
  });
});
