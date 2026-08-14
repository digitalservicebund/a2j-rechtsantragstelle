import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { erbfolgeLoaderExtras } from "~/domains/nachlass/erbschein/shared/erbfolgeExtras";
import {
  loadVorabcheckData,
  runVorabcheckAction,
} from "~/routes/shared/newEngineVorabcheck.server";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

export const loader = (args: LoaderFunctionArgs) =>
  loadVorabcheckData(args, erbfolgeLoaderExtras);

export const action = (args: ActionFunctionArgs) => runVorabcheckAction(args);
