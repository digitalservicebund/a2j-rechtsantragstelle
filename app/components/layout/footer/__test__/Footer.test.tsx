import { render } from "@testing-library/react";
import Footer, { logoAltText } from "../Footer";
import { layoutTranslations } from "~/services/translations/layout";

describe("Footer", () => {
  it("should render the BMJV Logo", () => {
    const { getByTitle } = render(<Footer />);
    expect(getByTitle(logoAltText)).toBeInTheDocument();
  });

  it("should render deletionBanner", () => {
    const { getByText } = render(<Footer showDeletionBanner={true} />);
    expect(
      getByText(layoutTranslations["footer"].footerLinkLabel.de),
    ).toBeInTheDocument();
  });

  it("should render aria label translation if provided", () => {
    const ariaLabel = "Footer Navigation";
    const { getByLabelText } = render(<Footer ariaLabel={ariaLabel} />);
    expect(getByLabelText(ariaLabel)).toBeInTheDocument();
  });
  it("should render internal links", () => {
    const { getByText } = render(<Footer />);
    expect(
      getByText(layoutTranslations.footer.impressum.de),
    ).toBeInTheDocument();
    expect(
      getByText(layoutTranslations.footer.barrierefreiheit.de),
    ).toBeInTheDocument();
    expect(
      getByText(layoutTranslations.footer.datenschutz.de),
    ).toBeInTheDocument();
    expect(getByText(layoutTranslations.footer.kontakt.de)).toBeInTheDocument();
    expect(
      getByText(layoutTranslations.footer.openSourceCode.de),
    ).toBeInTheDocument();
    expect(
      getByText(layoutTranslations.footer.anBefragungenTeilnehmen.de),
    ).toBeInTheDocument();
  });
  it("should render external links", () => {
    const { getByText } = render(<Footer />);
    expect(
      getByText(layoutTranslations.footer.pilotProjekt.de),
    ).toBeInTheDocument();
    expect(
      getByText(layoutTranslations.footer.digitalService.de),
    ).toBeInTheDocument();
    expect(
      getByText(layoutTranslations.footer.projektZugangZumRecht.de),
    ).toBeInTheDocument();
  });
});
