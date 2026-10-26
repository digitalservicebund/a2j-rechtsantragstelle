import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { geldEinklagenAnwaltschaftLoaderExtras } from "~/domains/geldEinklagen/anwaltschaft/geldEinklagenAnwaltschaftExtras";
import {
  loadFormularData,
  runFormularAction,
} from "~/routes/shared/formular.server";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";

export const loader = (args: LoaderFunctionArgs) =>
  loadFormularData(args, geldEinklagenAnwaltschaftLoaderExtras);

export const action = (args: ActionFunctionArgs) => runFormularAction(args);
