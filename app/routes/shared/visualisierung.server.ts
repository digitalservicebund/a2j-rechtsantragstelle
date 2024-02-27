import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { createMachine, type AnyStateMachine } from "xstate";
import { toDirectedGraph } from "@xstate/graph";
import { flows } from "~/models/flows/flows.server";
import { throw404OnProduction } from "../../services/errorPages/throw404";
import { flowIDFromPathname } from "~/models/flows/contexts";

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

const getVisualizationString = (
  stateMachine: AnyStateMachine,
  showBacklinks = false,
) => {
  // normally this should be the machine but somehow the following line doesn't return the root inside the function:
  // const stateNode = stateMachine instanceof xstate.StateMachine ? stateMachine.root : stateMachine;
  const digraph = toDirectedGraph(stateMachine.root);

  // Mermaid generates a picture when given a base64 encoded chart description
  const flowChart = mermaidFlowchart(digraph, showBacklinks);
  return Buffer.from(flowChart).toString("base64");
};

export const loader = ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const url = new URL(request.url);
  const flowId = flowIDFromPathname(url.pathname);
  const { config, guards } = flows[flowId];
  const showBacklinks = url.searchParams.get("showBacklinks") !== null;

  //@ts-ignore
  const machine = createMachine(config, { guards });
  const base64Graph = getVisualizationString(machine, showBacklinks);
  return json({ url: `https://mermaid.ink/img/${base64Graph}` });
};
