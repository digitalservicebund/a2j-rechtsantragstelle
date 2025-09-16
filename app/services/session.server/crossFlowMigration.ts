import type { FlowId } from "~/domains/flowIds";
import type { Flow } from "~/domains/flows.server";
import { getContext } from "~/domains/userData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { type CookieHeader, getSessionData } from ".";

export const migrationKey = "daten-uebernahme";

async function doMigration(
  migrationFlowIdDestination: FlowId,
  migrationFlowIdSource: FlowId,
  cookieHeader: string,
) {
  const { userData } = await getSessionData(
    migrationFlowIdSource,
    cookieHeader,
  );

  const { prunedData: prunedUserData } = await pruneIrrelevantData(
    userData,
    migrationFlowIdSource,
  );

  return Object.fromEntries(
    Object.entries(prunedUserData).filter(
      ([key]) => key in getContext(migrationFlowIdDestination),
    ),
  );
}

export async function getMigrationData(
  stepId: string,
  migrationFlowIdDestination: FlowId,
  migrationFlowDestination: Flow,
  cookieHeader: CookieHeader,
) {
  const { migration } = migrationFlowDestination;
  if (!migration || !stepId.includes(migrationKey) || !cookieHeader)
    return undefined;

  return await doMigration(
    migrationFlowIdDestination,
    migration.source,
    cookieHeader,
  );
}
