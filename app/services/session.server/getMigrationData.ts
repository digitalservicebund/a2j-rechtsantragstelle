import type { FlowId } from "~/domains/flowIds";
import { flows, type Flow } from "~/domains/flows.server";
import { type CookieHeader, getSessionData } from ".";
import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/flowEngine/migrateSourceFlowDataToDestinationFlow";

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

  return migrateSourceFlowDataToDestinationFlow(
    userData,
    sourceFlow,
    migrationFlowDestination,
    migrationFlowIdDestination,
  );
}
