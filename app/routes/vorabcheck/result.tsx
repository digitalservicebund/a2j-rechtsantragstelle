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

  // Slug change to keep Strapi slugs without ergebnis/
  const slug = pathname.replace(/ergebnis\//, "");
  const resultContent = await getStrapiResultPage({ slug });

  return json({
    commonContent: await getStrapiVorabCheckCommon(),
    resultContent,
    meta: resultContent.meta,
    reasonsToDisplay: getReasonsToDisplay(resultContent.reasonings.data, data),
    progress: flowController.getProgress(stepId),
    isLast: flowController.isFinal(stepId),
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
    reasonsToDisplay,
    progress,
    isLast,
    previousStep,
  } = useLoaderData<typeof loader>();

  return (
    <ResultPage
      content={resultContent}
      common={commonContent}
      backDestination={previousStep}
      reasonsToDisplay={reasonsToDisplay}
      progressStep={progress.current}
      progressTotal={progress.total}
      isLast={isLast}
    />
  );
}
