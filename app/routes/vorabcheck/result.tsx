import { useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import ResultPage from "~/components/ResultPage";
import { getStrapiResultPage, getStrapiVorabCheckCommon } from "~/services/cms";
import { buildFlowController } from "~/services/flow/buildFlowController";
import { getReasonsToDisplay } from "~/models/flows/common";
import {
  flowIDFromPathname,
  flowSpecifics,
  splatFromParams,
} from "./flowSpecifics";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta?.title ?? location.pathname },
];

export const loader = async ({ params, request }: LoaderArgs) => {
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const stepId = "ergebnis/" + splatFromParams(params);

  const { data } = await getSession(request.headers.get("Cookie"));

  const flowController = buildFlowController({
    flow: flowSpecifics[flowId].flow,
    data,
    guards: flowSpecifics[flowId].guards,
  });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial().url);

  const commonContent = await getStrapiVorabCheckCommon();
  const progressBar = flowController.getProgress(stepId);
  const progressStep = progressBar.current;
  const progressTotal = progressBar.total;
  const isLast = flowController.isFinal(stepId);

  // Slug change to keep Strapi slugs without ergebnis/
  const resultContent = await getStrapiResultPage({
    slug: pathname.replace(/ergebnis\//, ""),
  });
  const resultReasonsToDisplay = getReasonsToDisplay(
    resultContent.reasonings.data,
    data
  );

  return json({
    commonContent,
    resultContent,
    meta: resultContent?.meta,
    resultReasonsToDisplay,
    progressStep,
    progressTotal,
    isLast,
    previousStep: flowController.getPrevious(stepId)?.url,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const splat = splatFromParams(params);
  const flowId = flowIDFromPathname(new URL(request.url).pathname);

  const flowController = buildFlowController({
    flow: flowSpecifics[flowId].flow,
    data: (await getSession(request.headers.get("Cookie"))).data,
    guards: flowSpecifics[flowId].guards,
  });

  return redirect(flowController.getNext("ergebnis/" + splat).url);
};

export function Step() {
  const {
    commonContent,
    resultContent,
    resultReasonsToDisplay,
    progressStep,
    progressTotal,
    isLast,
    previousStep,
  } = useLoaderData<typeof loader>();

  return (
    <ResultPage
      content={{ ...resultContent, ...commonContent }}
      backDestination={previousStep}
      reasonsToDisplay={resultReasonsToDisplay}
      progressStep={progressStep}
      progressTotal={progressTotal}
      isLast={isLast}
    />
  );
}
