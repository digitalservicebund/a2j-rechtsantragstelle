import { render } from "@testing-library/react";
import MigrationDataOverview from "../MigrationDataOverview";

describe("MigrationDataOverview", () => {
  it("should not render in case is missing migration data", () => {
    const { container } = render(<MigrationDataOverview translations={{}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render the component based on the migration data and translations", () => {
    const migrationData = {
      bereich: "verspaetet",
    };

    const translations = {
      bereich: "Problem",
      "bereich.verspaetet": "Verspätete Beförderung",
    };

    const { container, getByText } = render(
      <MigrationDataOverview
        translations={translations}
        migrationData={migrationData}
      />,
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(getByText(translations["bereich"])).toBeInTheDocument();
    expect(getByText(translations["bereich.verspaetet"])).toBeInTheDocument();
  });

  it("should render the component based on the migration data and the specific translation with .value", () => {
    const migrationData = {
      startAirport: "BER",
    };

    const translations = {
      startAirport: "Startflughafen",
      "startAirport.value": "Berlin Brandenburg Flughafen (BER)",
    };

    const { container, getByText } = render(
      <MigrationDataOverview
        translations={translations}
        migrationData={migrationData}
      />,
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(getByText(translations["startAirport"])).toBeInTheDocument();
    expect(getByText(translations["startAirport.value"])).toBeInTheDocument();
  });

  it("should render the component based on the migration data when it contains nested objects and translations", () => {
    const migrationData = {
      zustaendigesAmtsgericht: {
        bezeichnung: "Amtsgericht Frankfurt am Main",
        strasseMitHausnummer: "Gerichtsstraße 2",
        plzUndStadt: "60313 Frankfurt am Main",
      },
    };

    const translations = {
      zustaendigesAmtsgericht: "Zuständiges Amtsgericht",
    };

    const { container, getByText } = render(
      <MigrationDataOverview
        translations={translations}
        migrationData={migrationData}
      />,
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(
      getByText(translations["zustaendigesAmtsgericht"]),
    ).toBeInTheDocument();
    expect(
      getByText(migrationData["zustaendigesAmtsgericht"].bezeichnung),
    ).toBeInTheDocument();
    expect(
      getByText(migrationData["zustaendigesAmtsgericht"].strasseMitHausnummer),
    ).toBeInTheDocument();
    expect(
      getByText(migrationData["zustaendigesAmtsgericht"].plzUndStadt),
    ).toBeInTheDocument();
  });

  it("should render the component order the fields bases on the props migrationOrderFields", () => {
    const migrationData = {
      bereich: "verspaetet",
      startAirport: "BER",
      endAirport: "FRA",
    };

    const translations = {
      bereich: "Problem",
      "bereich.verspaetet": "Verspätete Beförderung",
      startAirport: "Startflughafen",
      "startAirport.value": "Berlin Brandenburg Flughafen (BER)",
      endAirport: "Zielflughafen",
      "endAirport.value": "Frankfurt Flughafen (FRA)",
    };

    const { queryAllByTestId } = render(
      <MigrationDataOverview
        translations={translations}
        migrationData={migrationData}
      />,
    );

    expect(queryAllByTestId("migration-field-value")[0].textContent).toEqual(
      translations["bereich"],
    );

    expect(queryAllByTestId("migration-field-value")[1].textContent).toEqual(
      translations["startAirport"],
    );

    expect(queryAllByTestId("migration-field-value")[2].textContent).toEqual(
      translations["endAirport"],
    );
  });
});
