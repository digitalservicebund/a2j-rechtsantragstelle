import { render } from "@testing-library/react";
import type { ArrayConfig } from "~/services/array";
import ArraySummaryDataItems from "../ArraySummaryDataItems";

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

const mockDataItem = {
  firstName: "Another",
  surname: "test",
};

// eslint-disable-next-line react/display-name
vi.mock("~/components/arraySummary/ArraySummaryItemButton", () => ({
  default: () => <div>Mock ArraySummaryItemButton</div>,
}));

describe("ArraySummaryDataItems", () => {
  afterEach(() => {
    vi.restoreAllMocks(); // This clears all mocks after each test
  });

  it("should render ArraySummaryDataItems with the correct values", () => {
    const translations = {
      "unterhaltszahlungen.familyRelationship": "Familienverhältnis",
      "unterhaltszahlungen.familyRelationship.mother": "Mutter",
      "unterhaltszahlungen.firstName": "Vorname",
      "unterhaltszahlungen.surname": "Nachname",
    };

    const { getByText, queryAllByTestId } = render(
      <ArraySummaryDataItems
        configuration={mockArrayConfiguration}
        items={mockDataItem}
        headingTitleTagNameItem="h2"
        itemIndex={0}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(queryAllByTestId(arraySummaryItem)[0].tagName.toLowerCase()).toBe(
      "h2",
    );
    expect(
      getByText(translations["unterhaltszahlungen.firstName"]),
    ).toBeInTheDocument();
    expect(
      getByText(translations["unterhaltszahlungen.surname"]),
    ).toBeInTheDocument();
    expect(getByText(mockDataItem.firstName)).toBeInTheDocument();
    expect(getByText(mockDataItem.surname)).toBeInTheDocument();
  });
});
