import type { FlowId } from "~/domains/flowIds";
import { flows, type Flow } from "~/domains/flows.server";
import { pruneIrrelevantData } from "~/services/flow/pruner/pruner";
import { type CookieHeader, getSessionData } from ".";
import pick from "lodash/pick";
import { getAllPageSchemaByFlowId } from "~/domains/pageSchemas";
import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/newFlowEngine/migrateSourceFlowDataToDestinationFlow";

export const migrationKey = "daten-uebernahme";

export async function getMigrationData(
  stepId: string,
  migrationFlowIdDestination: FlowId,
  migrationFlowDestination: Flow,
  cookieHeader: CookieHeader,
) {
  const { migration } = migrationFlowDestination;
  if (!migration || !stepId.includes(migrationKey) || !cookieHeader)
    return undefined;

  const userData = await getSessionData(migration.source, cookieHeader);
  const sourceFlow = flows[migration.source];
  // TODO: remove after migration to new flow engine
  if (
    "newEngineConfig" in migrationFlowDestination &&
    "newEngineConfig" in sourceFlow
  ) {
    return migrateSourceFlowDataToDestinationFlow(
      userData,
      sourceFlow,
      migrationFlowDestination,
      migrationFlowIdDestination,
    );
  }
  const { prunedData } = pruneIrrelevantData(userData, migration.source);
  const destinationUserSchemas = getAllPageSchemaByFlowId(
    migrationFlowIdDestination,
  );

  return pick(prunedData, Object.keys(destinationUserSchemas)); // we only cares about attributes that also appear in the destination
}
