import { getContext } from "~/flows/contexts";
import type { FlowId } from "~/flows/flowIds";
import { type Flow } from "~/flows/flows.server";
import { type CookieHeader, getSessionData } from ".";

const migrationKey = "daten-uebernahme";

async function doMigration(
  flowId: FlowId,
  migrationSource: FlowId,
  cookieHeader: string,
) {
  const { userData } = await getSessionData(migrationSource, cookieHeader);
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
  const { migrationSource } = flow;
  if (!migrationSource || !stepId.includes(migrationKey) || !cookieHeader)
    return undefined;
  return doMigration(flowId, migrationSource, cookieHeader);
}
