import type { Context } from "~/flows/contexts";
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
  const { source, fields } = migration;
  const { userData } = await getSessionData(source, cookieHeader);

  const userDataKeys: Context = Object.fromEntries(Object.entries(userData));

  return fields
    .filter((field) => field in userDataKeys)
    .filter((field) => field in getContext(flowId))
    .reduce((acc: Context, field) => {
      acc[field] = userDataKeys[field];
      return acc;
    }, {});
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
