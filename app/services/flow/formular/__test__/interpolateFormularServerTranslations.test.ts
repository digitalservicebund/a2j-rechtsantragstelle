import { Flow } from "~/domains/flows.server";
import { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getArraySummaryPageTranslations } from "~/services/array/getArraySummaryPageTranslations";
import { interpolateFormularServerTranslations } from "../interpolateFormularServerTranslations";

const mockFlow: Flow = {
  flowType: "formFlow",
  config: {},
  guards: {},
  stringReplacements: (context: FluggastrechtContext) => {
    return {
      airlineName: context.fluggesellschaft,
    };
  },
};

vi.mock("~/services/array/getArraySummaryPageTranslations");

describe("interpolateFormularServerTranslations", () => {
  it("should return an interpolated translation coming first from migration data even if exits in overviewTranslations", async () => {
    const mockMigrationData = {
      fluggesellschaft: "Lufthansa",
    };

    const mockFlowTranslations = {
      "fluggesellschaft.value": "{{{ airlineName }}}",
    };

    const mockOverviewTranslations = {
      "fluggesellschaft.value": "{{{ airlineName }}}",
    };

    const actual = await interpolateFormularServerTranslations(
      mockFlow,
      mockFlowTranslations,
      mockMigrationData,
      [],
      mockOverviewTranslations,
      {},
    );

    expect(actual).toEqual({
      "fluggesellschaft.value": "Lufthansa",
    });
  });

  it("should return the translation of the array summary page", async () => {
    vi.mocked(getArraySummaryPageTranslations).mockResolvedValue({
      button: "Edit",
    });

    const actual = await interpolateFormularServerTranslations(
      mockFlow,
      {},
      {},
      [],
      {},
      {},
    );

    expect(actual).toEqual({
      button: "Edit",
    });
  });
});
