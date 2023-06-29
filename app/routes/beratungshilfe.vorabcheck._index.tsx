import { redirect } from "@remix-run/node";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import { buildFlowController } from "~/services/flow/buildFlowController";

export const loader = async () => {
  return redirect(
    buildFlowController({ flow: beratungshilfeFlow, data: {} }).getInitial().url
  );
};
