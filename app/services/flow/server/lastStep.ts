import { flows } from "~/models/flows/flows.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { throw404IfFeatureFlagEnabled } from "../../errorPages/throw404";
import { buildFlowController } from "./buildFlowController";
import {
  type CookieHeader,
  getSessionManager,
  mainSessionFromCookieHeader,
} from "../../session.server";
import { dataDeletionKey, lastStepKey } from "../constants";
import { type FlowId, flowIDFromPathname } from "~/models/flows/contexts";

type LastStep = Record<FlowId, string>;

async function lastStepFromRequest(cookieHeader: CookieHeader) {
  const mainSession = await mainSessionFromCookieHeader(cookieHeader);
  return mainSession.get(lastStepKey) as undefined | LastStep;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await throw404IfFeatureFlagEnabled(request);
  const { pathname, searchParams } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const { config, guards } = flows[flowId];
  const cookieHeader = request.headers.get("Cookie");

  let headers = {};
  if (searchParams.get(dataDeletionKey) !== null) {
    const sessionManager = getSessionManager(flowId);
    const session = await sessionManager.getSession(cookieHeader);
    headers = { "Set-Cookie": await sessionManager.destroySession(session) };
  }
  const lastStep = await lastStepFromRequest(cookieHeader);
  const destination =
    lastStep && flowId in lastStep
      ? lastStep[flowId]
      : buildFlowController({ config, guards }).getInitial();
  return redirect(destination, { headers });
}
