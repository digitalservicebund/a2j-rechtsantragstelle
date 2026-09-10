import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/newFlowEngine/migrateSourceFlowDataToDestinationFlow";
import { erbscheinErbfolge } from "~/domains/nachlass/erbschein/erbfolge";
import { erbscheinAnfrage } from "~/domains/nachlass/erbschein/anfrage";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSessionManager, updateSession } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const referer = request.headers.get("Referer");

  const sourceFlowId = "/erbschein/erbfolge";
  const destinationFlowId = "/erbschein/anfrage";

  if (!referer?.includes(sourceFlowId)) {
    return redirect(sourceFlowId);
  }

  const cookieHeader = request.headers.get("Cookie");

  const { getSession: getSourceSession } = getSessionManager(sourceFlowId);

  const sourceSession = await getSourceSession(cookieHeader);

  const migratedData = migrateSourceFlowDataToDestinationFlow(
    sourceSession.data,
    erbscheinErbfolge,
    erbscheinAnfrage,
    destinationFlowId,
  );

  const { getSession: getDestinationSession, commitSession } =
    getSessionManager(destinationFlowId);

  const destinationSession = await getDestinationSession(cookieHeader);

  updateSession(destinationSession, migratedData);

  const headers = await commitSession(destinationSession);

  return redirect(destinationFlowId, { headers });
};
