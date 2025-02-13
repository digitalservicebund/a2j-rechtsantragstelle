import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Context } from "~/domains/contexts";
import { Translations } from "~/services/translations/getTranslationByKey";
import { getItemValueBox } from "../getItemValueBox";
import SummaryOverviewBoxItem from "../SummaryOverviewBoxItem";

vi.mock("../getItemValueBox", () => ({
  getItemValueBox: vi.fn(),
}));

describe("SummaryOverviewBoxItem", () => {
  test("renders title and value correctly", () => {
    const translations: Translations = {
      status: "Status",
    };
    const userData: Context = { status: "active" };

    vi.mocked(getItemValueBox).mockReturnValue("Aktiv");

    const { getByText, queryByTestId } = render(
      <SummaryOverviewBoxItem
        fieldName="status"
        userData={userData}
        translations={translations}
      />,
    );

    expect(queryByTestId("summary-box-item-title")).toBeInTheDocument();
    expect(queryByTestId("summary-box-item-value")).toBeInTheDocument();
    expect(getByText("Status")).toBeInTheDocument();
    expect(getByText("Aktiv")).toBeInTheDocument();
  });

  test("renders only value if title is missing", () => {
    const translations: Translations = {};
    const userData: Context = { status: "inactive" };

    vi.mocked(getItemValueBox).mockReturnValue("Inaktiv");

    const { queryByText, getByText, queryByTestId } = render(
      <SummaryOverviewBoxItem
        fieldName="status"
        userData={userData}
        translations={translations}
      />,
    );

    expect(queryByTestId("summary-box-item-title")).not.toBeInTheDocument();
    expect(queryByText("Status")).not.toBeInTheDocument();
    expect(queryByTestId("summary-box-item-value")).toBeInTheDocument();
    expect(getByText("Inaktiv")).toBeInTheDocument();
  });

  test("renders nothing when item value is missing", () => {
    const translations: Translations = { status: "Status" };
    const userData: Context = { status: "" };

    vi.mocked(getItemValueBox).mockReturnValue("");

    const { queryByText, queryByTestId } = render(
      <SummaryOverviewBoxItem
        fieldName="status"
        userData={userData}
        translations={translations}
      />,
    );

    expect(queryByTestId("summary-box-item-title")).not.toBeInTheDocument();
    expect(queryByText("Status")).not.toBeInTheDocument();
    expect(queryByTestId("summary-box-item-value")).not.toBeInTheDocument();
  });
});
