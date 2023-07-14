import { redirect } from "@remix-run/node";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import { buildFlowController } from "~/services/flow/buildFlowController";

export const loader = () =>
  redirect(buildFlowController({ flow: beratungshilfeFlow }).getInitial().url);
