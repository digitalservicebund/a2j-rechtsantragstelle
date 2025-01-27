import { render } from "@testing-library/react";
import type { ArrayConfigClient } from "~/services/array";
import ArraySummaryDataItems from "../ArraySummaryDataItems";

const arraySummaryItem = "array-summary-item";

const mockArrayConfiguration: ArrayConfigClient = {
  event: "add-unterhaltszahlungen",
  initialInputUrl: "daten",
  url: "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person",
  disableAddButton: false,
};

const mockDataItem = {
  firstName: "Another",
  surname: "test",
};

const translations = {
  "unterhaltszahlungen.familyRelationship": "Familienverhältnis",
  "unterhaltszahlungen.familyRelationship.mother": "Mutter",
  "unterhaltszahlungen.firstName": "Vorname",
  "unterhaltszahlungen.surname": "Nachname",
};

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

  it("should not render ArraySummaryDataItems in case all the field are hidden", () => {
    const mockArrayConfiguratinWithHiddenFields = {
      ...mockArrayConfiguration,
      hiddenFields: ["firstName", "surname"],
    };

    const { container } = render(
      <ArraySummaryDataItems
        configuration={mockArrayConfiguratinWithHiddenFields}
        items={mockDataItem}
        headingTitleTagNameItem="h2"
        itemIndex={0}
        translations={translations}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should render ArraySummaryDataItems with heading in case exists in the translations", () => {
    const translationWithHeadline = {
      ...translations,
      "unterhaltszahlungen.label.heading": "Heading",
    };

    const { getByText } = render(
      <ArraySummaryDataItems
        configuration={mockArrayConfiguration}
        items={mockDataItem}
        headingTitleTagNameItem="h2"
        itemIndex={0}
        translations={translationWithHeadline}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(
      getByText(translationWithHeadline["unterhaltszahlungen.label.heading"]),
    ).toBeInTheDocument();
  });

  it("renders heading with placeholder {{ indexArray }} replaced by default index when customStartDisplayIndex is not provided", () => {
    const translationWithHeadline = {
      ...translations,
      "unterhaltszahlungen.label.heading": "Heading {{ indexArray }}",
    };

    const { queryByText } = render(
      <>
        {[0, 1].map((itemIndex) => (
          <ArraySummaryDataItems
            key={itemIndex}
            configuration={mockArrayConfiguration}
            items={mockDataItem}
            headingTitleTagNameItem="h2"
            itemIndex={itemIndex}
            translations={translationWithHeadline}
            category="unterhaltszahlungen"
            csrf="csrf"
          />
        ))}
      </>,
    );

    expect(queryByText("Heading 1")).toBeInTheDocument();
    expect(queryByText("Heading 2")).toBeInTheDocument();
  });

  it("renders heading with placeholder {{ indexArray }} replaced by customStartDisplayIndex when provided", () => {
    const translationWithHeadline = {
      ...translations,
      "unterhaltszahlungen.label.heading": "Heading {{ indexArray }}",
    };

    const { queryByText } = render(
      <>
        {[0, 1].map((itemIndex) => (
          <ArraySummaryDataItems
            key={itemIndex}
            configuration={{
              ...mockArrayConfiguration,
              customStartDisplayIndex: 2,
            }}
            items={mockDataItem}
            headingTitleTagNameItem="h2"
            itemIndex={itemIndex}
            translations={translationWithHeadline}
            category="unterhaltszahlungen"
            csrf="csrf"
          />
        ))}
      </>,
    );

    expect(queryByText("Heading 1")).not.toBeInTheDocument();
    expect(queryByText("Heading 2")).toBeInTheDocument();
    expect(queryByText("Heading 3")).toBeInTheDocument();
  });
});
