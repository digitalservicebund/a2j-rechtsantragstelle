import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { geldEinklageFormularLoaderExtras } from "~/domains/geldEinklagen/formular/geldEinklageFormularExtras";
import {
  runFormularAction,
  loadFormularData,
} from "~/routes/shared/newEngineFormular.server";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export const loader = (args: LoaderFunctionArgs) =>
  loadFormularData(args, geldEinklageFormularLoaderExtras);

export const action = (args: ActionFunctionArgs) => runFormularAction(args);
