import type { FlowId } from "~/domains/flowIds";
import type { Flow } from "~/domains/flows.server";
import { getContext } from "~/domains/userData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { type CookieHeader, getSessionData } from ".";
import pick from "lodash/pick";

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

  const { userData } = await getSessionData(migration.source, cookieHeader);
  const { prunedData } = await pruneIrrelevantData(userData, migration.source);
  const destinationUserSchemas = getContext(migrationFlowIdDestination);
  return pick(prunedData, Object.keys(destinationUserSchemas)); // we only cares about attributes that also appear in the destination
}
