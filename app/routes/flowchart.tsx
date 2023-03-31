import type { LoaderFunction, V2_MetaFunction } from "@remix-run/node";
import { formGraph } from "~/lib/vorabcheck/flow.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const title = "Vorabcheck Flowchart";

export const meta: V2_MetaFunction = () => [
  { title },
  { name: "robots", content: "noindex" },
];

export const loader: LoaderFunction = async () => {
  // Converts a graph into mermaid.js flowchart syntax, see https://mermaid.js.org/syntax/flowchart.html
  let flowchartDiagram = `---
title: ${title}
---
flowchart TD\n`;
  formGraph.forEachEdge((_, attributes, source, target) => {
    const connectionString = attributes["condition"] ? ".-" : "-->";
    flowchartDiagram = flowchartDiagram.concat(
      `    ${source} ${connectionString} ${target}\n`
    );
  });

  // Mermaid generates a picture when given a base64 encoded chart description
  const diagramB64 = Buffer.from(flowchartDiagram).toString("base64");
  return json({ url: `https://mermaid.ink/img/${diagramB64}` });
};

export default function Index() {
  const { url } = useLoaderData<typeof loader>();
  return <img alt="current flow chart" src={url}></img>;
}
