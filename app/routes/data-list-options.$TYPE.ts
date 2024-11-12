import { type LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import type { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import { getDataListOptions } from "~/services/dataListOptions/getDataListOptions";

const DataListTypeSchema = z.custom<DataListType>();

export async function loader({ params }: LoaderFunctionArgs) {
  const dataListTypeParameter = params.TYPE;
  const dataListTypeParse = DataListTypeSchema.safeParse(dataListTypeParameter);

  if (dataListTypeParse.success) {
    return getDataListOptions(dataListTypeParse.data);
  }

  return [];
}
