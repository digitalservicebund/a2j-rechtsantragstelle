import { render } from "@testing-library/react";
import type { ArrayConfig } from "~/services/array";
import ArraySummary from "../ArraySummary";

const arraySummaryItem = "array-summary-item";

const mockArrayConfiguration: ArrayConfig = {
  event: "add-unterhaltszahlungen",
  initialInputUrl: "daten",
  statementKey: "hasWeitereUnterhaltszahlungen",
  statementUrl:
    "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/frage",
  statementValue: true,
  url: "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person",
};

const arrayData = {
  arrayConfiguration: mockArrayConfiguration,
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

// eslint-disable-next-line react/display-name
vi.mock("~/components/arraySummary/ArraySummaryItemButton", () => ({
  default: () => <div>Mock ArraySummaryItemButton</div>,
}));

describe("ArraySummary", () => {
  afterEach(() => {
    vi.restoreAllMocks(); // This clears all mocks after each test
  });

  it("when the title is an empty space, it should not render the data-test-id array-summary-title and render array-summary-item as h2", () => {
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

    const { queryByTestId, queryAllByTestId } = render(
      <ArraySummary
        arrayData={arrayData}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(queryByTestId("array-summary-title")).not.toBeInTheDocument();
    expect(queryAllByTestId(arraySummaryItem).length).toBeGreaterThan(0);
    expect(queryAllByTestId(arraySummaryItem)[0].tagName.toLowerCase()).toBe(
      "h2",
    );
  });

  it("when the title has value, it should render the data-test-id array-summary-title and render array-summary-item as h3", () => {
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

    const { queryByTestId, queryAllByTestId } = render(
      <ArraySummary
        arrayData={arrayData}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(queryByTestId("array-summary-title")).toBeInTheDocument();
    expect(queryAllByTestId(arraySummaryItem).length).toBeGreaterThan(0);
    expect(queryAllByTestId(arraySummaryItem)[0].tagName.toLowerCase()).toBe(
      "h3",
    );
  });
});
