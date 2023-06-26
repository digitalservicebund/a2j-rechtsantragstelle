import { toDirectedGraph } from "@xstate/graph";
import type { AnyStateMachine } from "xstate";

const mermaidFlowchart = (digraph: ReturnType<typeof toDirectedGraph>) => {
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
};

export const getVisualizationString = (stateMachine: AnyStateMachine) => {
  const digraph = toDirectedGraph(stateMachine);

  // Mermaid generates a picture when given a base64 encoded chart description
  return Buffer.from(mermaidFlowchart(digraph)).toString("base64");
};
