import { deflateSync } from "node:zlib";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { toDirectedGraph } from "@xstate/graph";
import { createMachine, type AnyStateMachine } from "xstate";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import type { Config } from "~/services/flow/server/buildFlowController";
import { throw404OnProduction } from "../../services/errorPages/throw404";

function statesToGraph(
  children: ReturnType<typeof toDirectedGraph>["children"],
  showBacklinks: boolean,
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
      if (typeof edge.transition.guard === "string")
        arrow = `${arrow}|${edge.transition.guard}|`;
      const transition = `    ${source} ${arrow} ${target}\n`;

      if (showBacklinks || edge.label.text !== "BACK")
        outString = outString.concat(transition);
    });

    if (state.children.length > 0) {
      outString = outString.concat(
        `\n    subgraph ${state.id}\n${statesToGraph(
          state.children,
          showBacklinks,
        )}    end\n`,
      );
    }
  });
  return outString;
}

const mermaidFlowchart = (
  digraph: ReturnType<typeof toDirectedGraph>,
  showBacklinks = false,
) => {
  // Converts a graph into mermaid.js flowchart syntax
  // See https://mermaid.js.org/syntax/flowchart.html
  return `---
title: Vorabcheck Flowchart
---
flowchart TD
${statesToGraph(digraph.children, showBacklinks)}`;
};

// https://github.com/dankogai/js-base64/blob/main/base64.ts
const safeUri = (src: string) =>
  src.replace(/=/g, "").replace(/[+/]/g, (m0) => (m0 == "+" ? "-" : "_"));

function compressBase64(flowChartString: string) {
  const graphObjString = JSON.stringify({ code: flowChartString });
  const compressed = deflateSync(graphObjString, { level: 9 });
  return safeUri(Buffer.from(compressed).toString("base64"));
}

const getVisualizationString = (
  stateMachine: AnyStateMachine,
  showBacklinks = false,
) => {
  // normally this should be the machine but somehow the following line doesn't return the root inside the function:
  // const stateNode = stateMachine instanceof xstate.StateMachine ? stateMachine.root : stateMachine;
  const digraph = toDirectedGraph(stateMachine.root);

  // Mermaid generates a picture when given a base64 encoded chart description
  return mermaidFlowchart(digraph, showBacklinks);
};

export const loader = ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const url = new URL(request.url);
  const { flowId } = parsePathname(url.pathname);
  const { config, guards } = flows[flowId];
  const showBacklinks = url.searchParams.get("showBacklinks") !== null;
  const machine = createMachine(config as Config, { guards });
  const graph = getVisualizationString(machine, showBacklinks);
  const mermaidUrl = `https://mermaid.ink/img/pako:${compressBase64(graph)}?bgColor=!white`;
  return json({ url: mermaidUrl });
};
