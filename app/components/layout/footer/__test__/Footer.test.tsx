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
  it("should render internal links", () => {
    const { getByText } = render(<Footer />);
    expect(getByText(translations.footer.impressum.de)).toBeInTheDocument();
    expect(
      getByText(translations.footer.barrierefreiheit.de),
    ).toBeInTheDocument();
    expect(getByText(translations.footer.datenschutz.de)).toBeInTheDocument();
    expect(getByText(translations.footer.kontakt.de)).toBeInTheDocument();
    expect(
      getByText(translations.footer.openSourceCode.de),
    ).toBeInTheDocument();
    expect(
      getByText(translations.footer.anBefragungenTeilnehmen.de),
    ).toBeInTheDocument();
  });
  it("should render external links", () => {
    const { getByText } = render(<Footer />);
    expect(getByText(translations.footer.pilotProjekt.de)).toBeInTheDocument();
    expect(
      getByText(translations.footer.digitalService.de),
    ).toBeInTheDocument();
    expect(
      getByText(translations.footer.projektZugangZumRecht.de),
    ).toBeInTheDocument();
  });
});
