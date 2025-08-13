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
  familyRelationship: "mother",
};

vi.mock("~/components/content/arraySummary/ArraySummaryItemButton", () => ({
  default: () => <div>Mock ArraySummaryItemButton</div>,
}));

describe("ArraySummaryDataItems", () => {
  afterEach(() => {
    vi.restoreAllMocks(); // This clears all mocks after each test
  });

  it("should render ArraySummaryDataItems with the correct values", () => {
    const { getByText, queryAllByTestId } = render(
      <ArraySummaryDataItems
        configuration={mockArrayConfiguration}
        items={mockDataItem}
        itemIndex={0}
        itemLabels={{
          familyRelationship: "Familienverhältnis",
          "familyRelationship.mother": "Mutter",
          firstName: "Vorname",
          surname: "Nachname",
        }}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(queryAllByTestId(arraySummaryItem)[0].tagName.toLowerCase()).toBe(
      "p",
    );
    expect(getByText("Familienverhältnis")).toBeInTheDocument();
    expect(getByText("Vorname")).toBeInTheDocument();
    expect(getByText("Nachname")).toBeInTheDocument();
    expect(getByText("Mutter")).toBeInTheDocument();
    expect(getByText(mockDataItem.firstName)).toBeInTheDocument();
    expect(getByText(mockDataItem.surname)).toBeInTheDocument();
  });

  it("should not render ArraySummaryDataItems in case all the field are hidden", () => {
    const mockArrayConfiguratinWithHiddenFields = {
      ...mockArrayConfiguration,
      hiddenFields: ["firstName", "surname", "familyRelationship"],
    };

    const { container } = render(
      <ArraySummaryDataItems
        configuration={mockArrayConfiguratinWithHiddenFields}
        items={mockDataItem}
        itemIndex={0}
        itemLabels={{}}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should render ArraySummaryDataItems with subtitle", () => {
    const { getByText } = render(
      <ArraySummaryDataItems
        configuration={mockArrayConfiguration}
        items={mockDataItem}
        itemIndex={0}
        subtitle={{ text: "Subtitle" }}
        itemLabels={{}}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByText("Subtitle")).toBeInTheDocument();
  });

  it("renders subtitle with placeholder {{ indexArray }} replaced by default index when displayIndexOffset is not provided", () => {
    const { queryByText } = render(
      <>
        {[0, 1].map((itemIndex) => (
          <ArraySummaryDataItems
            key={itemIndex}
            configuration={mockArrayConfiguration}
            items={mockDataItem}
            itemIndex={itemIndex}
            subtitle={{ text: "Subtitle {{ indexArray }}" }}
            itemLabels={{}}
            category="unterhaltszahlungen"
            csrf="csrf"
          />
        ))}
      </>,
    );

    expect(queryByText("Subtitle 1")).toBeInTheDocument();
    expect(queryByText("Subtitle 2")).toBeInTheDocument();
  });

  it("renders subtitle with placeholder {{ indexArray }} replaced by displayIndexOffset when provided", () => {
    const { queryByText } = render(
      <>
        {[0, 1].map((itemIndex) => (
          <ArraySummaryDataItems
            key={itemIndex}
            configuration={{
              ...mockArrayConfiguration,
              displayIndexOffset: 2,
            }}
            items={mockDataItem}
            subtitle={{ text: "Subtitle {{ indexArray }}" }}
            itemIndex={itemIndex}
            itemLabels={{}}
            category="unterhaltszahlungen"
            csrf="csrf"
          />
        ))}
      </>,
    );

    expect(queryByText("Subtitle 1")).not.toBeInTheDocument();
    expect(queryByText("Subtitle 2")).toBeInTheDocument();
    expect(queryByText("Subtitle 3")).toBeInTheDocument();
  });
});
