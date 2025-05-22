import { render } from "@testing-library/react";
import type { ArrayConfigClient } from "~/services/array";
import ArraySummary from "../ArraySummary";

const mockArrayConfiguration: ArrayConfigClient = {
  event: "add-unterhaltszahlungen",
  initialInputUrl: "daten",
  url: "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person",
  disableAddButton: true,
};

const arrayData = {
  configuration: mockArrayConfiguration,
  data: [
    {
      birthday: "01.01.1950",
      familyRelationship: "mother",
      firstName: "Another",
      monthlyPayment: "100,00",
      surname: "test",
    },
  ],
};

vi.mock("~/components/arraySummary/ArraySummaryDataItems", () => ({
  default: (props: { headingTitleTagNameItem: string }) => (
    <div> Mock ArraySummaryDataItems {props.headingTitleTagNameItem} </div>
  ),
}));

describe("ArraySummary", () => {
  afterEach(() => {
    vi.restoreAllMocks(); // This clears all mocks after each test
  });

  it("should call <ArraySummaryDataItems> with headingTitleTagNameItem as h2 when the title is an empty space", () => {
    const translations = {
      "unterhaltszahlungen.label.title": " ",
      "unterhaltszahlungen.label.subtitle": "Person ",
      "unterhaltszahlungen.familyRelationship": "Familienverhältnis",
      "unterhaltszahlungen.familyRelationship.mother": "Mutter",
      "unterhaltszahlungen.firstName": "Vorname",
      "unterhaltszahlungen.surname": "Nachname",
      "unterhaltszahlungen.birthday": "Geburtsdatum",
      "unterhaltszahlungen.monthlyPayment": "Monatliche Unterhaltszahlungen",
    };

    const { getByText } = render(
      <ArraySummary
        arrayData={arrayData}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByText("Mock ArraySummaryDataItems h2")).toBeInTheDocument();
  });

  it("should call <ArraySummaryDataItems> with headingTitleTagNameItem as h3 when the title has value", () => {
    const translations = {
      "unterhaltszahlungen.label.title": "Any title",
      "unterhaltszahlungen.label.subtitle": "Person ",
      "unterhaltszahlungen.familyRelationship": "Familienverhältnis",
      "unterhaltszahlungen.familyRelationship.mother": "Mutter",
      "unterhaltszahlungen.firstName": "Vorname",
      "unterhaltszahlungen.surname": "Nachname",
      "unterhaltszahlungen.birthday": "Geburtsdatum",
      "unterhaltszahlungen.monthlyPayment": "Monatliche Unterhaltszahlungen",
    };

    const { getByText } = render(
      <ArraySummary
        arrayData={arrayData}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByText("Mock ArraySummaryDataItems h3")).toBeInTheDocument();
  });

  it("should have class is-disabled pointer-events-none on button given disableAddButton true", () => {
    const mockArrayConfigurationDisableAddButton = {
      ...mockArrayConfiguration,
      disableAddButton: true,
    };

    const mockArrayDataDisableAddButton = {
      configuration: mockArrayConfigurationDisableAddButton,
      data: [
        {
          birthday: "01.01.1950",
          familyRelationship: "mother",
          firstName: "Another",
          monthlyPayment: "100,00",
          surname: "test",
        },
      ],
    };

    const { getByTestId } = render(
      <ArraySummary
        arrayData={mockArrayDataDisableAddButton}
        translations={{}}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByTestId(`add-unterhaltszahlungen`)).toHaveClass(
      "is-disabled pointer-events-none",
    );
  });

  it("should not have class given disableAddButton false", () => {
    const mockArrayConfigurationDisableAddButton = {
      ...mockArrayConfiguration,
      disableAddButton: false,
    };

    const mockArrayDataDisableAddButton = {
      configuration: mockArrayConfigurationDisableAddButton,
      data: [
        {
          birthday: "01.01.1950",
          familyRelationship: "mother",
          firstName: "Another",
          monthlyPayment: "100,00",
          surname: "test",
        },
      ],
    };

    const { getByTestId } = render(
      <ArraySummary
        arrayData={mockArrayDataDisableAddButton}
        translations={{}}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByTestId(`add-unterhaltszahlungen`)).not.toHaveClass(
      "is-disabled pointer-events-none",
    );
  });
});
