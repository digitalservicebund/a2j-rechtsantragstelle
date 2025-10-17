import { render } from "@testing-library/react";
import MigrationDataOverview from "../MigrationDataOverview";

vi.mock("~/components/common/StandaloneLink", () => ({
  StandaloneLink: () => <div>Mock Button</div>,
}));

describe("MigrationDataOverview", () => {
  it("should not render in case is missing migration userData", () => {
    const { container } = render(<MigrationDataOverview translations={{}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should render the component based on the migration userData and translations", () => {
    const migrationUserData = {
      bereich: "verspaetet",
    };

    const translations = {
      bereich: "Problem",
      "bereich.verspaetet": "Verspätete Beförderung",
    };

    const { container, getByText } = render(
      <MigrationDataOverview
        translations={translations}
        userData={migrationUserData}
      />,
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(getByText(translations.bereich)).toBeInTheDocument();
    expect(getByText(translations["bereich.verspaetet"])).toBeInTheDocument();
  });

  it("should render the component based on the migration data and the specific translation with .migration.value", () => {
    const migrationUserData = {
      startAirport: "BER",
    };

    const translations = {
      startAirport: "Startflughafen",
      "startAirport.migration.value": "Berlin Brandenburg Flughafen (BER)",
    };

    const { container, getByText } = render(
      <MigrationDataOverview
        translations={translations}
        userData={migrationUserData}
      />,
    );

    expect(container).not.toBeEmptyDOMElement();
    expect(getByText(translations.startAirport)).toBeInTheDocument();
    expect(
      getByText(translations["startAirport.migration.value"]),
    ).toBeInTheDocument();
  });

  it("should render the component with fields sorted according to the sortedFields array", () => {
    const migrationUserData = {
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
        userData={migrationUserData}
        sortedFields={["startAirport", "endAirport", "bereich"]}
      />,
    );
    const migrationFields = queryAllByTestId("migration-field-value");
    expect(migrationFields[0]).toHaveTextContent(translations.startAirport);
    expect(migrationFields[1]).toHaveTextContent(translations.endAirport);
    expect(migrationFields[2]).toHaveTextContent(translations.bereich);
  });

  it("should render the component and order the fields based on the migrationUserData prop in case the sortedFields prop is an empty array.", () => {
    const migrationUserData = {
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
        userData={migrationUserData}
        sortedFields={[]}
      />,
    );
    const migrationFields = queryAllByTestId("migration-field-value");
    expect(migrationFields[0]).toHaveTextContent(translations.bereich);
    expect(migrationFields[1]).toHaveTextContent(translations.startAirport);
    expect(migrationFields[2]).toHaveTextContent(translations.endAirport);
  });

  it("should render a Mock Button in case props buttonUrl has value", () => {
    const migrationUserData = {
      bereich: "verspaetet",
    };

    const translations = {
      bereich: "Problem",
      "bereich.verspaetet": "Verspätete Beförderung",
    };

    const { queryByText } = render(
      <MigrationDataOverview
        translations={translations}
        userData={migrationUserData}
        buttonUrl="any button url"
      />,
    );

    expect(queryByText("Mock Button")).toBeInTheDocument();
  });

  it("should not render a Mock Button in case props buttonUrl is not defined", () => {
    const migrationUserData = {
      bereich: "verspaetet",
    };

    const translations = {
      bereich: "Problem",
      "bereich.verspaetet": "Verspätete Beförderung",
    };

    const { queryByText } = render(
      <MigrationDataOverview
        translations={translations}
        userData={migrationUserData}
      />,
    );

    expect(queryByText("Mock Button")).not.toBeInTheDocument();
  });
});
