import { LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { getDataListOptions } from "~/components/inputs/autoSuggestInput/getDataListOptions";
import { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";

const DataListTypeSchema = z.custom<DataListType>();

export async function loader({ params }: LoaderFunctionArgs) {
  const dataListTypeParameter = params.TYPE;
  const dataListTypeParse = DataListTypeSchema.safeParse(dataListTypeParameter);

  if (dataListTypeParse.success) {
    return json(getDataListOptions(dataListTypeParse.data));
  }

  return json([]);
}
