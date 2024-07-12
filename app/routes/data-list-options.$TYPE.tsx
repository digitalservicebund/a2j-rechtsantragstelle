import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getDataListOptions } from "~/components/inputs/autoSuggestInput/getDataListOptions";
import { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";

export async function loader({ params }: LoaderFunctionArgs) {
  const dataListType = params.TYPE as DataListType["dataList"];

  return json(getDataListOptions(dataListType));
}
