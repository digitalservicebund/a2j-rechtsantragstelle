import z from "zod";
import { type Flow } from "~/domains/flows.server";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/newFlowEngine/migrateSourceFlowDataToDestinationFlow";
import {
  type InferredUserData,
  type PageConfigMap,
} from "~/services/flow/newFlowEngine/types";

vi.mock("~/domains/pageSchemas");

describe("migrateSourceFlowDataToDestinationFlow", () => {
  it("should call the flow's migrationDataMerger if it exists", () => {
    const mockMigrationDataMerger = vi.fn();
    const sourceFlow = {
      flowType: "formFlow",
      config: {
        states: {},
      },
    } satisfies Flow;

    const destinationFlow = {
      flowType: "formFlow",
      config: {
        states: {},
      },
      migration: {
        source: "/nachlass/erbschein/erbfolge",
        sortedFields: [],
        migrationDataMerger: mockMigrationDataMerger,
      },
    } satisfies Flow;

    migrateSourceFlowDataToDestinationFlow(
      {},
      sourceFlow,
      destinationFlow,
      "/nachlass/erbschein/anfrage",
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
      config: {
        states: {},
      },
      newEngineConfig: compileFlow({
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
      config: {
        states: {},
      },
      newEngineConfig: {} as CompiledFlow<PageConfigMap>,
      migration: {
        source: "/nachlass/erbschein/erbfolge",
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
      "/nachlass/erbschein/anfrage",
    );

    expect(migrationData).toEqual(mockUserData);
  });
});
