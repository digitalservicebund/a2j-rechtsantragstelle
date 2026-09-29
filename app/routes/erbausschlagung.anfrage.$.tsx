import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { erbausschlagungLoaderExtras } from "~/domains/nachlass/erbausschlagung/anfrage/erbausschlagungExtras";
import {
  loadFormularData,
  runFormularAction,
} from "~/routes/shared/newEngineFormular.server";

export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export const loader = (args: LoaderFunctionArgs) =>
  loadFormularData(args, erbausschlagungLoaderExtras);

export const action = (args: ActionFunctionArgs) => runFormularAction(args);
