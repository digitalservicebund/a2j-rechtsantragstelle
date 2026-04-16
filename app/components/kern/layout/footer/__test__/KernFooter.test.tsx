import { render } from "@testing-library/react";
import KernFooter, {
  logoAltText,
} from "~/components/kern/layout/footer/KernFooter";
import { translations } from "~/services/translations/translations";

describe("KernFooter", () => {
  it("should render the BMJV Logo", () => {
    const { getByTitle } = render(<KernFooter />);
    expect(getByTitle(logoAltText)).toBeInTheDocument();
  });

  it("should render deletionBanner", () => {
    const { getByText } = render(<KernFooter showDeletionBanner={true} />);
    expect(
      getByText(translations["delete-data"].footerLinkLabel.de),
    ).toBeInTheDocument();
  });

  it("should render aria label translation if provided", () => {
    const ariaLabel = "KernFooter Navigation";
    const { getByLabelText } = render(<KernFooter ariaLabel={ariaLabel} />);
    expect(getByLabelText(ariaLabel)).toBeInTheDocument();
  });
});
