import { migrateSourceFlowDataToDestinationFlow } from "~/services/flow/newFlowEngine/migrateSourceFlowDataToDestinationFlow";
import { nachlassErbfolge } from "~/domains/nachlass/erbschein/erbfolge";
import { nachlassErbscheinAnfrage } from "~/domains/nachlass/erbschein/anfrage";
import { LoaderFunctionArgs, redirect } from "react-router";
import { getSessionManager, updateSession } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("MIGRATION");
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
  console.log("migratedData", migratedData);

  const { getSession: getDestinationSession, commitSession } =
    getSessionManager(destinationFlowId);

  const { getSession } = getSessionManager("/nachlass/erbschein/anfrage");

  const session = await getSession(request.headers.get("Cookie"));

  console.log("SESSION DATA", session.data);

  const destinationSession = await getDestinationSession(cookieHeader);
  console.log("destinationSession.data", destinationSession.data);

  updateSession(destinationSession, migratedData);

  const headers = await commitSession(destinationSession);
  console.log("COMMITTED", headers);

  return redirect(destinationFlowId, { headers });
};
