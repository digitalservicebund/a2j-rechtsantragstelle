import type { Flow } from "~/domains/flows.server";
import { getSessionData } from "~/services/session.server";
import { getMigrationData, migrationKey } from "../getMigrationData";
import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/flowEngine/migrateSourceFlowDataToDestinationFlow";
import { erbscheinAnfrage } from "~/domains/nachlass/erbschein/anfrage";

vi.mock("~/services/session.server");
const getSessionDataMock = vi.mocked(getSessionData);

vi.mock("~/services/flow/flowEngine/migrateSourceFlowDataToDestinationFlow");
const migrateSourceFlowDataToDestinationFlowMock = vi.mocked(
  migrateSourceFlowDataToDestinationFlow,
);

const mockMigrationFlowDestination: Flow = {
  flowType: "formFlow",
  migration: {
    source: "/fluggastrechte/vorabcheck",
    sortedFields: [],
  },
};

const mockMigrationFlowIdDestination = "/fluggastrechte/formular";

describe("getMigrationData", () => {
  it("should return undefined given a migrationFlowDestination without migration config", async () => {
    const actual = await getMigrationData(
      migrationKey,
      mockMigrationFlowIdDestination,
      { flowType: "formFlow" },
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

  it("should return undefined given a null cookie", async () => {
    const actual = await getMigrationData(
      "anotherMigrationKey",
      mockMigrationFlowIdDestination,
      mockMigrationFlowDestination,
      null,
    );

    expect(actual).toBeUndefined();
  });

  it("should migrate the source flow data to the destination flow", async () => {
    const userDataMock = { startAirport: "BER" };
    getSessionDataMock.mockResolvedValue({ userData: userDataMock });
    migrateSourceFlowDataToDestinationFlowMock.mockReturnValue(
      userDataMock as ReturnType<typeof migrateSourceFlowDataToDestinationFlow>,
    );

    const actual = await getMigrationData(
      migrationKey,
      mockMigrationFlowIdDestination,
      mockMigrationFlowDestination,
      "any cookie",
    );

    expect(migrateSourceFlowDataToDestinationFlowMock).toHaveBeenCalled();
    expect(actual).toStrictEqual(userDataMock);
  });

  it("should call migrateSourceFlowDataToDestinationFlow if migrating a new engine flow", async () => {
    await getMigrationData(
      migrationKey,
      "/erbschein/anfrage",
      erbscheinAnfrage,
      "cooookie",
    );
    expect(migrateSourceFlowDataToDestinationFlowMock).toHaveBeenCalled();
  });
});
