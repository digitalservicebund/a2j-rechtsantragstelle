import type { V2_MetaFunction } from "@remix-run/node";
import { formGraph } from "~/lib/vorabcheck";
import type Graph from "graphology";

const title = "Vorabcheck Flowchart";

export const meta: V2_MetaFunction = () => [
  { title },
  {
    name: "robots",
    content: "noindex",
  },
];

function mermaidFlowchart(graph: Graph) {
  // Converts a graph into mermaid.js flowchart syntax
  // See https://mermaid.js.org/syntax/flowchart.html
  let flowchartDiagram = `---
title: ${title}
---
flowchart TD\n`;

  graph.forEachEdge((_, attributes, source, target) => {
    const connectionString = attributes["condition"] ? ".-" : "-->";
    flowchartDiagram = flowchartDiagram.concat(
      `    ${source} ${connectionString} ${target}\n`
    );
  });
  return flowchartDiagram;
}

// Mermaid generates a picture when given a base64 encoded chart description
const mermaidURL = `https://mermaid.ink/img/${Buffer.from(
  mermaidFlowchart(formGraph)
).toString("base64")}`;

export default function Index() {
  return <img alt="current flow chart" src={mermaidURL}></img>;
}
