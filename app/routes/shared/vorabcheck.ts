import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { loadVorabcheckData, runVorabcheckAction } from "./vorabcheck.server";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

export const loader = (args: LoaderFunctionArgs) => loadVorabcheckData(args);

export const action = (args: ActionFunctionArgs) => runVorabcheckAction(args);
