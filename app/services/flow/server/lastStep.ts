import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { type FlowId, flowIDFromPathname } from "~/models/flows/contexts";
import { flows } from "~/models/flows/flows.server";
import { buildFlowController } from "./buildFlowController";
import { throw404IfFeatureFlagEnabled } from "../../errorPages/throw404";
import {
  type CookieHeader,
  mainSessionFromCookieHeader,
} from "../../session.server";
import { lastStepKey } from "../constants";

type LastStep = Record<FlowId, string>;

async function lastStepFromRequest(cookieHeader: CookieHeader) {
  const mainSession = await mainSessionFromCookieHeader(cookieHeader);
  return mainSession.get(lastStepKey) as undefined | LastStep;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await throw404IfFeatureFlagEnabled(request);
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const { config, guards } = flows[flowId];
  const cookieHeader = request.headers.get("Cookie");

  const lastStep = await lastStepFromRequest(cookieHeader);
  const destination =
    lastStep && flowId in lastStep
      ? lastStep[flowId]
      : buildFlowController({ config, guards }).getInitial();
  return redirect(destination);
}
