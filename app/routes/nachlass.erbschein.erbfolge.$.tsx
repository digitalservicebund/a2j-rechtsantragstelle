import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { erbfolgeVorabcheckLoaderExtras } from "~/domains/nachlass/erbschein/erbfolge/vorabcheckExtras";
import {
  loadVorabcheckData,
  runVorabcheckAction,
} from "~/routes/shared/newEngineVorabcheck.server";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

export const loader = (args: LoaderFunctionArgs) =>
  loadVorabcheckData(args, erbfolgeVorabcheckLoaderExtras);

export const action = (args: ActionFunctionArgs) => runVorabcheckAction(args);
