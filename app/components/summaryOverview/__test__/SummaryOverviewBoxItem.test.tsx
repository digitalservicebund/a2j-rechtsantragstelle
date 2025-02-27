import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { isFieldEmptyOrUndefined } from "~/util/isFieldEmptyOrUndefined";
import { getItemValueBox } from "../getItemValueBox";
import SummaryOverviewBoxItem from "../SummaryOverviewBoxItem";

vi.mock("../getItemValueBox", () => ({
  getItemValueBox: vi.fn(),
}));

vi.mock("~/util/isFieldEmptyOrUndefined", () => ({
  isFieldEmptyOrUndefined: vi.fn(),
}));

const mockTranslations: Translations = {};

describe("SummaryOverviewBoxItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders nothing when item value is missing", () => {
    const userData: Context = { status: "" };

    vi.mocked(getItemValueBox).mockReturnValue("");
    vi.mocked(isFieldEmptyOrUndefined).mockReturnValue(true);

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
    const userData: Context = { status: "active" };

    vi.mocked(getItemValueBox).mockReturnValue("Aktiv");
    vi.mocked(isFieldEmptyOrUndefined).mockReturnValue(false);

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
    const userData: Context = { status: "inactive" };

    vi.mocked(getItemValueBox).mockReturnValue("Inaktiv");
    vi.mocked(isFieldEmptyOrUndefined).mockReturnValue(false);

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
    const userData: Context = { status: "inactive" };

    vi.mocked(getItemValueBox).mockReturnValue("Inaktiv");

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
});
