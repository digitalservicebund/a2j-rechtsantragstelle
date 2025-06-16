import type { LoaderFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";
import { getDataListOptions } from "./getDataListOptions";
import type { DataListType } from "../cms/components/StrapiAutoSuggestInput";

export function createDataListLoader(dataListType: DataListType) {
  return async function loader({ request }: LoaderFunctionArgs) {
    const validatedRequest = await validateCsrfSessionFormless(request);

    if (validatedRequest.isErr) {
      logWarning(`Error: request to ${dataListType} route without CSRF token`);
      throw new Response(null, { status: 403 });
    }

    return Response.json(getDataListOptions(dataListType));
  };
}
