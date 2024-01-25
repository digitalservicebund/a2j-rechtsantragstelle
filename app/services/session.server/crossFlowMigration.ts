import { type Flow } from "~/models/flows/flows.server";
import { type FlowId, getContext } from "~/models/flows/contexts";
import { getSessionForContext } from ".";

export async function getMigrationData(
  flowId: FlowId,
  currentFlow: Flow,
  cookieId: string | null,
) {
  const { migrationSource } = currentFlow;
  if (!migrationSource || cookieId === null) return {};
  const context = getContext(flowId);
  const session = getSessionForContext(migrationSource);
  const migrationSession = await session.getSession(cookieId);
  return Object.fromEntries(
    Object.entries(migrationSession.data).filter(([key]) => key in context),
  );
}
