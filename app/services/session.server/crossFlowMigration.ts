import { getContext } from "~/flows/contexts";
import type { FlowId } from "~/flows/flowIds";
import type { FlowMigration, Flow } from "~/flows/flows.server";
import { type CookieHeader, getSessionData } from ".";

const migrationKey = "daten-uebernahme";

async function doMigration(
  flowId: FlowId,
  migration: FlowMigration,
  cookieHeader: string,
) {
  const { source } = migration;
  const { userData } = await getSessionData(source, cookieHeader);

  return Object.fromEntries(
    Object.entries(userData).filter(([key]) => key in getContext(flowId)),
  );
}

export function getMigrationData(
  stepId: string,
  flowId: FlowId,
  flow: Flow,
  cookieHeader: CookieHeader,
) {
  const { migration } = flow;
  if (!migration || !stepId.includes(migrationKey) || !cookieHeader)
    return undefined;

  return doMigration(flowId, migration, cookieHeader);
}
