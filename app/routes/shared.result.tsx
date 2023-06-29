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
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import { guards as beratungshilfeGuards } from "~/models/flows/beratungshilfe/guards";
import { guards as geldEinklagenGuards } from "~/models/flows/geldEinklagen/guards";
import invariant from "tiny-invariant";
import type { MachineConfig } from "xstate";
import { getVerfuegbaresEinkommenFreibetrag } from "~/models/beratungshilfe";
import { context as geldEinklagenContext } from "~/models/flows/geldEinklagen/pages";
import { isKeyOfObject } from "~/util/objects";
import { context as contextBeratungshilfe } from "~/models/flows/beratungshilfe/pages";
import { getReasonsToDisplay } from "~/models/flows/common";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta?.title ?? location.pathname },
];

const flowSpecifics = {
  beratungshilfe: {
    flow: beratungshilfeFlow,
    guards: beratungshilfeGuards,
    context: contextBeratungshilfe,
  },
  "geld-einklagen": {
    flow: geldEinklagenFlow,
    guards: geldEinklagenGuards,
    context: geldEinklagenContext,
  },
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const pathname = new URL(request.url).pathname;
  const flowId = pathname.split("/")[1] as keyof typeof flowSpecifics;
  const flow = flowSpecifics[flowId].flow;

  const session = await getSession(request.headers.get("Cookie"));
  const flowController = buildFlowController({
    flow: flow as MachineConfig<any, any, any>,
    data: session.data,
    guards: flowSpecifics[flowId].guards,
  });

  if (splat === "") {
    // redirect to initial step
    return redirect(flowController.getInitial().url);
  }

  const stepId = "ergebnis/" + splat;

  if (!flowController.isReachable(stepId)) {
    return redirect(flowController.getInitial().url);
  }

  const verfuegbaresEinkommenFreibetrag = getVerfuegbaresEinkommenFreibetrag(
    session.data
  );
  const templateReplacements = {
    verfuegbaresEinkommenFreibetrag: verfuegbaresEinkommenFreibetrag.toString(),
  };

  const commonContent = await getStrapiVorabCheckCommon();
  const progressBar = flowController.getProgress(stepId);
  const progressStep = progressBar.current;
  const progressTotal = progressBar.total;
  const isLast = flowController.isFinal(stepId);
  const previousStep = flowController.isInitial(stepId)
    ? undefined
    : flowController.getPrevious(stepId).url;

  const slug = pathname;
  // Slug change to keep Strapi slugs without ergebnis/
  const resultContent = await getStrapiResultPage({
    slug: slug.replace(/ergebnis\//, ""),
  });
  const resultReasonsToDisplay = getReasonsToDisplay(
    resultContent.reasonings.data,
    session.data
  );

  return json({
    commonContent,
    resultContent,
    meta: resultContent?.meta,
    resultReasonsToDisplay,
    progressStep,
    progressTotal,
    isLast,
    previousStep,
    templateReplacements,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const pathname = new URL(request.url).pathname;
  const flowId = pathname.split("/")[1];
  const stepId = "ergebnis/" + splat;

  if (!isKeyOfObject(flowId, flowSpecifics)) {
    throw new Response(null, {
      status: 404,
      statusText: "Unknown Flow",
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const flowController = buildFlowController({
    flow: flowSpecifics[flowId].flow as MachineConfig<any, any, any>,
    data: session.data,
    guards: flowSpecifics[flowId].guards,
  });

  return redirect(flowController.getNext(stepId).url);
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
