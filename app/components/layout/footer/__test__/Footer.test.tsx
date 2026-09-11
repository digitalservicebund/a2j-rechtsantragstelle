import { translations } from "~/services/translations/translations";
import Footer, { logoAltText } from "../Footer";
import { renderWithRouter } from "~/components/__test__/renderWithRouter";

describe("Footer", () => {
  it("should render the BMJV Logo", () => {
    const { getByTitle } = renderWithRouter(<Footer />);
    expect(getByTitle(logoAltText)).toBeInTheDocument();
  });

  it("should render deletionBanner", () => {
    const { getByText } = renderWithRouter(
      <Footer showDeletionBanner={true} />,
    );
    expect(
      getByText(translations["delete-data"].footerLinkLabel.de),
    ).toBeInTheDocument();
  });

  it("should render aria label translation if provided", () => {
    const ariaLabel = "Footer Navigation";
    const { getByLabelText } = renderWithRouter(
      <Footer ariaLabel={ariaLabel} />,
    );
    expect(getByLabelText(ariaLabel)).toBeInTheDocument();
  });
  it("should render internal links", () => {
    const { getByText } = renderWithRouter(<Footer />);
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
    const { getByText } = renderWithRouter(<Footer />);
    expect(getByText(translations.footer.pilotProjekt.de)).toBeInTheDocument();
    expect(
      getByText(translations.footer.digitalService.de),
    ).toBeInTheDocument();
    expect(
      getByText(translations.footer.projektZugangZumRecht.de),
    ).toBeInTheDocument();
  });
  it("should add bottom margin if the user is on a flow site", () => {
    const renderResult = renderWithRouter(<Footer />, "/erbschein/anfrage");
    expect(
      renderResult.getByText(translations.footer.pilotProjekt.de),
    ).toBeInTheDocument();

    const footerSection = renderResult.container.querySelector("section");
    expect(footerSection).toHaveClass("mb-80");
    expect(footerSection).toHaveClass("lg:mb-0");
  });
});
