import { type LoaderFunctionArgs } from "react-router";
import { loadResultData } from "./newEngineResult.server";
export { ResultPage as default } from "./components/ResultPage";

export const loader = (args: LoaderFunctionArgs) => loadResultData(args);
