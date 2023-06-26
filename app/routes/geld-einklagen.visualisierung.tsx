import { createMachine } from "xstate";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";
import { guards } from "~/models/flows/geldEinklagen/guards";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getVisualizationString } from "~/services/flow/visualization";

export const loader = async () => {
  const machine = createMachine<GeldEinklagenVorabcheckContext>(
    geldEinklagenFlow,
    { guards }
  );
  const base64Graph = getVisualizationString(machine);
  return json({ url: `https://mermaid.ink/img/${base64Graph}` });
};

export default function Index() {
  const { url } = useLoaderData<typeof loader>();
  return <img alt="current flow chart" src={url}></img>;
}
