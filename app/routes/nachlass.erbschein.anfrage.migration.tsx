import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/newFlowEngine/migrateSourceFlowDataToDestinationFlow";
import { nachlassErbfolge } from "~/domains/nachlass/erbschein/erbfolge";
import { nachlassErbscheinAnfrage } from "~/domains/nachlass/erbschein/anfrage";
import { LoaderFunctionArgs, redirect } from "react-router";
import { getSessionManager, updateSession } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const sourceFlowId = "/nachlass/erbschein/erbfolge";
  const destinationFlowId = "/nachlass/erbschein/anfrage";

  const { getSession: getSourceSession } = getSessionManager(sourceFlowId);

  const sourceSession = await getSourceSession(cookieHeader);

  const migratedData = migrateSourceFlowDataToDestinationFlow(
    sourceSession.data,
    nachlassErbfolge,
    nachlassErbscheinAnfrage,
    destinationFlowId,
  );

  const { getSession: getDestinationSession, commitSession } =
    getSessionManager(destinationFlowId);

  const { getSession } = getSessionManager("/nachlass/erbschein/anfrage");

  const destinationSession = await getDestinationSession(cookieHeader);

  updateSession(destinationSession, migratedData);

  const headers = await commitSession(destinationSession);

  return redirect(destinationFlowId, { headers });
};
