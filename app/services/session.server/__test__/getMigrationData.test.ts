import type { Flow } from "~/domains/flows.server";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { getSessionData } from "~/services/session.server";
import { getMigrationData, migrationKey } from "../crossFlowMigration";

vi.mock("~/services/session.server");
const getSessionDataMock = vi.mocked(getSessionData);

vi.mock("~/services/flow/pruner");
const pruneIrrelevantDataMock = vi.mocked(pruneIrrelevantData);

const mockMigrationFlowDestination: Flow = {
  flowType: "formFlow",
  migration: {
    source: "/fluggastrechte/vorabcheck",
    sortedFields: [],
  },
  config: {},
  guards: {},
};

const mockMigrationFlowIdDestination = "/fluggastrechte/formular";

describe("getMigrationData", () => {
  it("should return undefined given a migrationFlowDestination without migration config", async () => {
    const actual = await getMigrationData(
      migrationKey,
      mockMigrationFlowIdDestination,
      { flowType: "formFlow", config: {}, guards: {} },
      "any cookie",
    );

    expect(actual).toBeUndefined();
  });

  it("should return undefined given a step id without be the migration key", async () => {
    const actual = await getMigrationData(
      "anotherMigrationKey",
      mockMigrationFlowIdDestination,
      mockMigrationFlowDestination,
      "any cookie",
    );

    expect(actual).toBeUndefined();
  });

  it("should return undefined given an undefined cookie", async () => {
    const actual = await getMigrationData(
      "anotherMigrationKey",
      mockMigrationFlowIdDestination,
      mockMigrationFlowDestination,
      undefined,
    );

    expect(actual).toBeUndefined();
  });

  it("should return the mock value given the /fluggastrechte/vorabcheck as flow to be migrated", async () => {
    const userDataMock = { startAirport: "BER" };

    getSessionDataMock.mockResolvedValue({
      userData: userDataMock,
      debugId: "",
    });

    pruneIrrelevantDataMock.mockResolvedValueOnce({
      prunedData: userDataMock,
      validFlowPaths: {},
    });

    const actual = await getMigrationData(
      migrationKey,
      mockMigrationFlowIdDestination,
      mockMigrationFlowDestination,
      "any data",
    );

    expect(actual).toStrictEqual(userDataMock);
  });
});
