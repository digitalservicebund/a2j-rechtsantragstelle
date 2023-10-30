import { type FlowSpecifics } from "~/routes/shared/flowSpecifics";
import { getSessionForContext } from ".";

export async function getMigrationData(
  currentFlow: FlowSpecifics[keyof FlowSpecifics],
  cookieId: string | null,
) {
  if (!("migrationSource" in currentFlow) || cookieId === null) return {};
  const { migrationSource, context } = currentFlow;
  const session = getSessionForContext(migrationSource);
  const migrationSession = await session.getSession(cookieId);
  return Object.fromEntries(
    Object.entries(migrationSession.data).filter(([key]) => key in context),
  );
}
