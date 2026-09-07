import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { erbfolgeLoaderExtras } from "~/domains/nachlass/erbschein/shared/erbfolgeExtras";
import {
  loadFormularData,
  runFormularAction,
} from "~/routes/shared/newEngineFormular.server";

export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export const loader = (args: LoaderFunctionArgs) =>
  loadFormularData(args, erbfolgeLoaderExtras);

export const action = (args: ActionFunctionArgs) => runFormularAction(args);
