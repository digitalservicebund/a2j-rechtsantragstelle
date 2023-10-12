import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createMachine, type AnyStateMachine } from "xstate";
import { toDirectedGraph } from "@xstate/graph";
import { flowIDFromPathname, flowSpecifics } from "./flowSpecifics";
import { throw404OnProduction } from "../../services/errorPages/throw404";

function statesToGraph(
  children: ReturnType<typeof toDirectedGraph>["children"],
  ignoreBacklinks: boolean,
) {
  let outString = "";
  children.forEach((state) => {
    state.edges.forEach((edge) => {
      const source =
        edge.source.parent && !edge.source.parent?.id.startsWith("/")
          ? `${edge.source.parent?.id}.${edge.source.key}`
          : edge.source.key;
      const target =
        edge.target.parent && !edge.target.parent?.id.startsWith("/")
          ? `${edge.target.parent?.id}.${edge.target.key}`
          : edge.target.key;

      let arrow = edge.label.text === "SUBMIT" ? "-->" : ".->";
      if (edge.transition.cond?.name !== undefined)
        arrow = `${arrow}|${edge.transition.cond?.name}|`;
      const transition = `    ${source} ${arrow} ${target}\n`;

      if (!(ignoreBacklinks && edge.label.text === "BACK"))
        outString = outString.concat(transition);
    });

    if (state.children.length > 0) {
      outString = outString.concat(
        `\n    subgraph ${state.id}\n${statesToGraph(
          state.children,
          ignoreBacklinks,
        )}    end\n`,
      );
    }
  });
  return outString;
}

const mermaidFlowchart = (
  digraph: ReturnType<typeof toDirectedGraph>,
  ignoreBacklinks = false,
) => {
  // Converts a graph into mermaid.js flowchart syntax
  // See https://mermaid.js.org/syntax/flowchart.html
  return `---
title: Vorabcheck Flowchart
---
flowchart TD
${statesToGraph(digraph.children, ignoreBacklinks)}`;
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

export const loader = ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const url = new URL(request.url);
  const flowId = flowIDFromPathname(url.pathname);
  const { flow, guards } = flowSpecifics[flowId];
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
