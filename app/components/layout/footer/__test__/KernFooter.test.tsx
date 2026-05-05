import { render } from "@testing-library/react";
import { translations } from "~/services/translations/translations";
import Footer, { logoAltText } from "../Footer";

describe("Footer", () => {
  it("should render the BMJV Logo", () => {
    const { getByTitle } = render(<Footer />);
    expect(getByTitle(logoAltText)).toBeInTheDocument();
  });

  it("should render deletionBanner", () => {
    const { getByText } = render(<Footer showDeletionBanner={true} />);
    expect(
      getByText(translations["delete-data"].footerLinkLabel.de),
    ).toBeInTheDocument();
  });

  it("should render aria label translation if provided", () => {
    const ariaLabel = "Footer Navigation";
    const { getByLabelText } = render(<Footer ariaLabel={ariaLabel} />);
    expect(getByLabelText(ariaLabel)).toBeInTheDocument();
  });
});
