import z from "zod";
import { type Flow } from "~/domains/flows.server";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/flowEngine/compileFlow";
import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/flowEngine/migrateSourceFlowDataToDestinationFlow";
import {
  type InferredUserData,
  type PageConfigMap,
} from "~/services/flow/flowEngine/types";

vi.mock("~/domains/pageSchemas");

describe("migrateSourceFlowDataToDestinationFlow", () => {
  it("should call the flow's migrationDataMerger if it exists", () => {
    const mockMigrationDataMerger = vi.fn();
    const sourceFlow = {
      flowType: "formFlow",
    } satisfies Flow;

    const destinationFlow = {
      flowType: "formFlow",
      migration: {
        source: "/erbschein/erbfolge",
        sortedFields: [],
        migrationDataMerger: mockMigrationDataMerger,
      },
    } satisfies Flow;

    migrateSourceFlowDataToDestinationFlow(
      {},
      sourceFlow,
      destinationFlow,
      "/erbschein/anfrage",
    );

    expect(destinationFlow.migration?.migrationDataMerger).toHaveBeenCalled();
  });

  it("should return only fields that exist in the destination flow if no migrationDataMerger is provided", () => {
    vi.mocked(getAllPageSchemaByFlowId).mockReturnValue({
      start: z.string(),
      page1: z.number(),
    });
    const sourceFlow = {
      flowType: "formFlow",
      config: compileFlow({
        initialStep: "ergebnis",
        transitions: {
          ergebnis: null,
        },
        pages: {
          ergebnis: {
            stepId: "/ergebnis/erbfolge",
            pageSchema: {
              start: z.string(),
              page1: z.number(),
            },
          },
        },
        pruningStrategy: "cascading",
      }) as CompiledFlow<PageConfigMap>,
    } satisfies Flow;

    const destinationFlow = {
      flowType: "formFlow",
      config: {} as CompiledFlow<PageConfigMap>,
      migration: {
        source: "/erbschein/erbfolge",
        sortedFields: [],
      },
    } satisfies Flow;

    const mockUserData = {
      start: "foo",
      page1: 42,
    } as InferredUserData<PageConfigMap>;

    const migrationData = migrateSourceFlowDataToDestinationFlow(
      mockUserData,
      sourceFlow,
      destinationFlow,
      "/erbschein/anfrage",
    );

    expect(migrationData).toEqual(mockUserData);
  });
});
