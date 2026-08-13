import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";
import {
  loadFormularData,
  runFormularAction,
} from "~/routes/shared/newEngineFormular.server";

export const loader = (args: LoaderFunctionArgs) => loadFormularData(args);

export const action = (args: ActionFunctionArgs) => runFormularAction(args);
