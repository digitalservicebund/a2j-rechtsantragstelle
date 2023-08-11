import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createMachine, type AnyStateMachine } from "xstate";
import { toDirectedGraph } from "@xstate/graph";
import { flowIDFromPathname, flowSpecifics } from "./flowSpecifics";
import {
  throw404IfFeatureFlagEnabled,
  throw404OnProduction,
} from "../../services/errorPages/throw404";

const mermaidFlowchart = (
  digraph: ReturnType<typeof toDirectedGraph>,
  ignoreBacklinks = false,
) => {
  // Converts a graph into mermaid.js flowchart syntax
  // See https://mermaid.js.org/syntax/flowchart.html
  let flowchartDiagram = `---
title: Vorabcheck Flowchart
---
flowchart TD\n`;

  digraph.children.forEach((state) => {
    state.edges.forEach((edge) => {
      const source = edge.source.path[0];
      const target = edge.target.path[0];
      if (ignoreBacklinks && edge.label.text === "BACK") return;
      let arrow = edge.label.text === "SUBMIT" ? "-->" : ".->";

      if (edge.transition.cond?.name !== undefined)
        arrow = `${arrow}|${edge.transition.cond?.name as string}|`;

      flowchartDiagram = flowchartDiagram.concat(
        `    ${source} ${arrow} ${target}\n`,
      );
    });
  });

  return flowchartDiagram;
};

const getVisualizationString = (
  stateMachine: AnyStateMachine,
  ignoreBacklinks = true,
) => {
  const digraph = toDirectedGraph(stateMachine);

  // Mermaid generates a picture when given a base64 encoded chart description
  const flowChart = mermaidFlowchart(digraph, ignoreBacklinks);
  return Buffer.from(flowChart).toString("base64");
};

export const loader = async ({ request }: LoaderArgs) => {
  throw404OnProduction();
  await throw404IfFeatureFlagEnabled(request);
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const { flow, guards } = flowSpecifics[flowId];
  const url = new URL(request.url);
  const ignoreBacklinks = url.searchParams.get("ignoreBacklinks") !== null;

  //@ts-ignore
  const machine = createMachine(flow, { guards });
  const base64Graph = getVisualizationString(machine, ignoreBacklinks);
  return json({ url: `https://mermaid.ink/img/${base64Graph}` });
};

export function Index() {
  const { url } = useLoaderData<typeof loader>();
  return <img alt="current flow chart" src={url}></img>;
}
