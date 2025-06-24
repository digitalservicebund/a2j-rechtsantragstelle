import { validationError } from "@rvf/react-router";
import { redirect, type ActionFunctionArgs } from "react-router";
import { consentCookieFromRequest } from "~/services/analytics/gdprCookie.server";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { filterFormData } from "~/util/filterFormData";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const url = formData.get("_url")?.toString() ?? "";
  const relevantFormData = filterFormData(formData);
  const validationResult = await validateFormData(url, relevantFormData);

  if (validationResult?.error) {
    return validationError(
      validationResult.error,
      validationResult.submittedData,
    );
  } else {
    const headers = await consentCookieFromRequest({ request });
    return redirect(`${url}?success`, { headers });
  }
};
