import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { type FlowId, parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { buildFlowController } from "./buildFlowController";
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
  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  const { config, guards } = flows[flowId];
  const cookieHeader = request.headers.get("Cookie");

  const lastStep = await lastStepFromRequest(cookieHeader);
  const destination =
    lastStep && flowId in lastStep
      ? flowId + lastStep[flowId]
      : buildFlowController({ config, guards }).getInitial();
  return redirect(destination);
}
