import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { type UserData } from "~/domains/userData";
import { type Translations } from "~/services/translations/getTranslationByKey";
import {
  getItemValueBox,
  extractFieldItemsFromInlineItems,
} from "../getItemValueBox";
import SummaryOverviewBoxItem from "../SummaryOverviewBoxItem";

vi.mock("../getItemValueBox", () => ({
  getItemValueBox: vi.fn(),
  extractFieldItemsFromInlineItems: vi.fn(),
}));

const mockTranslations: Translations = {};

describe("SummaryOverviewBoxItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders nothing when item value is missing", () => {
    const userData: UserData = { status: "" };

    vi.mocked(getItemValueBox).mockReturnValue("");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "status", fieldValue: "" },
    ]);

    const { queryByTestId } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "status" }]}
      />,
    );

    expect(queryByTestId("summary-box-item-title")).not.toBeInTheDocument();
    expect(queryByTestId("summary-box-item-value")).not.toBeInTheDocument();
  });

  test("renders title and value correctly", () => {
    const userData: UserData = { status: "active" };

    vi.mocked(getItemValueBox).mockReturnValue("Aktiv");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "status", fieldValue: "active" },
    ]);

    const { getByText, queryByTestId } = render(
      <SummaryOverviewBoxItem
        title="Status"
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "status" }]}
      />,
    );

    expect(queryByTestId("summary-box-item-title")).toBeInTheDocument();
    expect(queryByTestId("summary-box-item-value")).toBeInTheDocument();
    expect(getByText("Status")).toBeInTheDocument();
    expect(getByText("Aktiv")).toBeInTheDocument();
  });

  test("renders even if title is missing", () => {
    const userData: UserData = { status: "inactive" };

    vi.mocked(getItemValueBox).mockReturnValue("Inaktiv");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "status", fieldValue: "inactive" },
    ]);

    const { getByText, queryByTestId } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "status" }]}
      />,
    );

    expect(queryByTestId("summary-box-item-title")).not.toBeInTheDocument();
    expect(queryByTestId("summary-box-item-value")).toBeInTheDocument();
    expect(getByText("Inaktiv")).toBeInTheDocument();
  });

  test("renders item value based on the  inlineItemValues", () => {
    const userData: UserData = { status: "inactive" };

    vi.mocked(getItemValueBox).mockReturnValue("Inaktiv");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "status", fieldValue: "inactive" },
    ]);

    const { getByText, queryByTestId } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "status" }]}
      />,
    );

    expect(queryByTestId("summary-box-item-value")).toBeInTheDocument();
    expect(getByText("Inaktiv")).toBeInTheDocument();
  });

  test("should wrap value in a scrollable container for long-text summary", () => {
    const userData: UserData = { sachverhaltBegruendung: "Langer Text" };

    vi.mocked(getItemValueBox).mockReturnValue("Langer Text");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      {
        fieldName: "sachverhaltBegruendung",
        fieldValue: "Langer Text",
      },
    ]);

    const { container } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "sachverhaltBegruendung" }]}
      />,
    );

    const scrollableContainer = container.querySelector(".resize-y");
    expect(scrollableContainer).toBeInTheDocument();
  });

  test("should not render scrollable container when long-text field is blank", () => {
    const userData: UserData = { sachverhaltBegruendung: "" };

    vi.mocked(getItemValueBox).mockReturnValue("Fallback value");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "sachverhaltBegruendung", fieldValue: "" },
    ]);

    const { container } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "sachverhaltBegruendung" }]}
      />,
    );

    const scrollableContainer = container.querySelector(".resize-y");
    expect(scrollableContainer).not.toBeInTheDocument();
  });

  test("should not render scrollable container when userData key is not allowed", () => {
    const userData: UserData = { vorname: "Donatello" };

    vi.mocked(getItemValueBox).mockReturnValue("Fallback value");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "vorname", fieldValue: "Donatello" },
    ]);

    const { container } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "vorname" }]}
      />,
    );

    const scrollableContainer = container.querySelector(".resize-y");
    expect(scrollableContainer).not.toBeInTheDocument();
  });
  test.each([
    { actual: "1000", expected: "1000" },
    { actual: "1000,00", expected: "1000,00 €" },
    { actual: "1.000,00", expected: "1.000,00 €" },
    { actual: "1.000", expected: "1.000" },
    { actual: "1.234.567,89", expected: "1.234.567,89 €" },
    { actual: "0", expected: "0" },
    { actual: "0,00", expected: "0,00 €" },
    { actual: "-1.000,00", expected: "-1.000,00 €" },
    { actual: "€1.000,00", expected: "€1.000,00" },
    { actual: "1 000,00", expected: "1 000,00" },
    { actual: "1.000,0", expected: "1.000,0" },
  ])("renders numeric values correctly: %o", ({ actual, expected }) => {
    const userData: UserData = { amount: actual } as unknown as UserData;

    vi.mocked(getItemValueBox).mockReturnValue(actual);
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "amount", fieldValue: actual },
    ]);

    const { getByText } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "amount" }]}
      />,
    );

    expect(getByText(expected)).toBeInTheDocument();
  });
});
