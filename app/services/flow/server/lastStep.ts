import { flows } from "~/models/flows/flows.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { throw404IfFeatureFlagEnabled } from "../../errorPages/throw404";
import { buildFlowController } from "./buildFlowController";
import {
  getSessionForContext,
  mainSessionFromRequest,
} from "../../session.server";
import { dataDeletionKey, lastStepKey } from "../constants";
import { type FlowId, flowIDFromPathname } from "~/models/flows/contexts";

type LastStep = Record<FlowId, string>;

async function lastStepFromRequest(request: Request) {
  const mainSession = await mainSessionFromRequest(request);
  return mainSession.get(lastStepKey) as undefined | LastStep;
}

async function setLastStep(request: Request) {
  const mainSession = await mainSessionFromRequest(request);
  return mainSession.get(lastStepKey) as undefined | LastStep;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await throw404IfFeatureFlagEnabled(request);
  const { pathname, searchParams } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const { config } = flows[flowId];

  let headers = {};
  if (searchParams.get(dataDeletionKey) !== null) {
    const cookie = request.headers.get("Cookie");
    const context = getSessionForContext(flowId);
    const session = await context.getSession(cookie);
    headers = { "Set-Cookie": await context.destroySession(session) };
  }
  const lastStep = await lastStepFromRequest(request);
  const destination =
    lastStep && flowId in lastStep
      ? lastStep[flowId]
      : buildFlowController({ config }).getInitial().url;
  return redirect(destination, { headers });
}
