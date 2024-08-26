import { render } from "@testing-library/react";
import type { ArrayConfig } from "~/services/array";
import ArraySummary from "../ArraySummary";
import ArraySummaryDataItems from "../ArraySummaryDataItems";

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

vi.mock("../ArraySummaryDataItems", () => ({
  default: vi.fn(),
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

    render(
      <ArraySummary
        arrayData={arrayData}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(ArraySummaryDataItems).toHaveBeenCalledWith(
      expect.objectContaining({
        headingTitleTagNameItem: "h2",
      }),
      expect.anything(),
    );
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

    render(
      <ArraySummary
        arrayData={arrayData}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(ArraySummaryDataItems).toHaveBeenCalledWith(
      expect.objectContaining({
        headingTitleTagNameItem: "h3",
      }),
      expect.anything(),
    );
  });

  it("should not call <ArraySummaryDataItems> if statement value is false", () => {
    const mocktArrayDataWithoutStatementValue = {
      ...arrayData,
      arrayConfiguration: { ...mockArrayConfiguration, statementValue: false },
    };

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

    render(
      <ArraySummary
        arrayData={mocktArrayDataWithoutStatementValue}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(ArraySummaryDataItems).not.toBeCalled();
  });
});
