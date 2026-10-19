import { type LoaderFunctionArgs } from "react-router";
import { loadResultData } from "./result.server";
export { ResultPage as default } from "./components/ResultPage";

export const loader = (args: LoaderFunctionArgs) => loadResultData(args);
