import { isFlowId, type Flow } from "~/routes/shared/flowSpecifics";
import { getSessionForContext } from ".";

export async function getMigrationData(
  currentFlow: Flow,
  cookieId: string | null,
) {
  const { migrationSource, context } = currentFlow;
  if (!migrationSource || !isFlowId(migrationSource) || cookieId === null)
    return {};
  const session = getSessionForContext(migrationSource);
  const migrationSession = await session.getSession(cookieId);
  return Object.fromEntries(
    Object.entries(migrationSession.data).filter(([key]) => key in context),
  );
}
