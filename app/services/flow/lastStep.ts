import {
  flowIDFromPathname,
  flowSpecifics,
} from "~/routes/shared/flowSpecifics";
import { mainSessionFromRequest } from "../security/csrf.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { throw404IfFeatureFlagEnabled } from "../errorPages/throw404";
import { buildFlowController } from "./buildFlowController";

type LastStep = Record<keyof typeof flowSpecifics, string>;
export const lastStepKey = "lastStep";

async function lastStepFromRequest(request: Request) {
  const mainSession = await mainSessionFromRequest(request);
  return mainSession.get(lastStepKey) as undefined | LastStep;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await throw404IfFeatureFlagEnabled(request);
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const { flow } = flowSpecifics[flowId];
  const lastStep = await lastStepFromRequest(request);
  const destination =
    lastStep && flowId in lastStep
      ? lastStep[flowId]
      : buildFlowController({ flow }).getInitial().url;
  return redirect(destination);
}
