import { render } from "@testing-library/react";
import { z } from "zod";
import { describe, expect, test, vi } from "vitest";
import { type UserData } from "~/domains/userData";
import { getPageSchema } from "~/domains/pageSchemas";
import {
  buildMoneyValidationSchema,
  formatCurrencyZodDescription,
} from "~/services/validation/money/buildMoneyValidationSchema";
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

vi.mock("~/domains/pageSchemas", () => ({
  getPageSchema: vi.fn(),
}));

const mockTranslations: Translations = {};
const TEST_PATHNAME =
  "/geld-einklagen/formular/klage-erstellen/prozessfuehrung/anwaltskosten";

describe("SummaryOverviewBoxItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPageSchema).mockReturnValue(undefined);
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
        pathname={TEST_PATHNAME}
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
        pathname={TEST_PATHNAME}
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
        pathname={TEST_PATHNAME}
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
        pathname={TEST_PATHNAME}
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
        pathname={TEST_PATHNAME}
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
        pathname={TEST_PATHNAME}
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
        pathname={TEST_PATHNAME}
      />,
    );

    const scrollableContainer = container.querySelector(".resize-y");
    expect(scrollableContainer).not.toBeInTheDocument();
  });
  test("appends euro word when field schema uses money validation", () => {
    const userData: UserData = { anwaltskosten: "1.000,00" };

    vi.mocked(getItemValueBox).mockReturnValue("1.000,00");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "anwaltskosten", fieldValue: "1.000,00" },
    ]);
    vi.mocked(getPageSchema).mockReturnValue({
      anwaltskosten: buildMoneyValidationSchema().meta({
        description: formatCurrencyZodDescription,
      }),
    });

    const { getByText } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "anwaltskosten" }]}
        pathname={TEST_PATHNAME}
      />,
    );

    expect(getByText("1.000,00 Euro")).toBeInTheDocument();
  });

  test("does not append euro word when field schema is not money validation", () => {
    const userData: UserData = { amount: "1.000,00" };

    vi.mocked(getItemValueBox).mockReturnValue("1.000,00");
    vi.mocked(extractFieldItemsFromInlineItems).mockReturnValue([
      { fieldName: "amount", fieldValue: "1.000,00" },
    ]);
    vi.mocked(getPageSchema).mockReturnValue({ amount: z.string() });

    const { getByText } = render(
      <SummaryOverviewBoxItem
        userData={userData}
        translations={mockTranslations}
        inlineItems={[{ field: "amount" }]}
        pathname={TEST_PATHNAME}
      />,
    );

    expect(getByText("1.000,00")).toBeInTheDocument();
  });
});
