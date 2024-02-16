import { type Flow } from "~/models/flows/flows.server";
import { type FlowId, getContext } from "~/models/flows/contexts";
import { getSessionForContext } from ".";

const migrationKey = "daten-uebernahme";

async function doMigration(
  flowId: FlowId,
  migrationSource: FlowId,
  cookieId: string,
) {
  const { data } =
    await getSessionForContext(migrationSource).getSession(cookieId);
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => key in getContext(flowId)),
  );
}

export function getMigrationData(
  stepId: string,
  flowId: FlowId,
  flow: Flow,
  cookieId: string | null,
) {
  const { migrationSource } = flow;
  if (!migrationSource || !stepId.includes(migrationKey) || cookieId === null)
    return undefined;
  return doMigration(flowId, migrationSource, cookieId);
}
