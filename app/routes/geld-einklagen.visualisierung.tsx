import { createMachine } from "xstate";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import { toDirectedGraph } from "@xstate/graph";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

function mermaidFlowchart(digraph: ReturnType<typeof toDirectedGraph>) {
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
      let arrow = edge.label.text === "SUBMIT" ? "-->" : ".->";

      if (edge.transition.cond?.name !== undefined)
        arrow = `${arrow}|${edge.transition.cond?.name}|`;

      flowchartDiagram = flowchartDiagram.concat(
        `    ${source} ${arrow} ${target}\n`
      );
    });
  });

  return flowchartDiagram;
}

export const loader = async () => {
  const machine = createMachine<GeldEinklagenVorabcheckContext>(
    geldEinklagenFlow,
    { guards }
  );
  const digraph = toDirectedGraph(machine);

  // Mermaid generates a picture when given a base64 encoded chart description
  const base64Graph = Buffer.from(mermaidFlowchart(digraph)).toString("base64");
  return json({ url: `https://mermaid.ink/img/${base64Graph}` });
};

export default function Index() {
  const { url } = useLoaderData<typeof loader>();
  return <img alt="current flow chart" src={url}></img>;
}
