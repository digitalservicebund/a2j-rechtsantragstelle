import { createMachine } from "xstate";
import { guards } from "~/models/flows/beratungshilfe/guards";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { BeratungshilfeVorabcheckContext } from "~/models/flows/beratungshilfe/pages";
import { getVisualizationString } from "~/services/flow/visualization";

export const loader = async () => {
  const machine = createMachine<BeratungshilfeVorabcheckContext>(
    //@ts-ignore
    beratungshilfeFlow,
    { guards }
  );
  const base64Graph = getVisualizationString(machine);
  return json({ url: `https://mermaid.ink/img/${base64Graph}` });
};

export default function Index() {
  const { url } = useLoaderData<typeof loader>();
  return <img alt="current flow chart" src={url}></img>;
}
