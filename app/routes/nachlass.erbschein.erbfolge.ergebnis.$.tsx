import type { LoaderFunctionArgs } from "react-router";
import { erbfolgeResultExtras } from "~/domains/nachlass/erbschein/erbfolge/resultExtras";
import { loadResultData } from "~/routes/shared/newEngineResult";

export { ResultPage as default } from "~/routes/shared/components/ResultPage";

export const loader = (args: LoaderFunctionArgs) =>
  loadResultData(args, erbfolgeResultExtras);
