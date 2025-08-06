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
  default: vi.fn(() => <div> Mock ArraySummaryDataItems</div>),
}));

describe("ArraySummary", () => {
  afterEach(() => {
    vi.restoreAllMocks(); // This clears all mocks after each test
  });

  it("should render title and description when it's available", () => {
    const { getByText } = render(
      <ArraySummary
        arrayData={arrayData}
        content={{
          title: {
            text: "Array Summary Title",
            tagName: "h2",
          },
          items: [],
          buttonLabel: "Add Item",
          description: "Array Summary Description",
        }}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByText("Array Summary Title")).toBeInTheDocument();
    expect(getByText("Array Summary Description")).toBeInTheDocument();
  });

  it("should render ArraySummaryDataItems for each item in arrayData", () => {
    const { getByText } = render(
      <ArraySummary
        arrayData={arrayData}
        content={{
          items: [],
          buttonLabel: "Add Item",
        }}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByText("Mock ArraySummaryDataItems")).toBeInTheDocument();
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
        content={{
          items: [],
          buttonLabel: "Add Item",
        }}
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
        content={{
          items: [],
          buttonLabel: "Add Item",
        }}
        category="unterhaltszahlungen"
        csrf="csrf"
      />,
    );

    expect(getByTestId(`add-unterhaltszahlungen`)).not.toHaveClass(
      "is-disabled pointer-events-none",
    );
  });
});
