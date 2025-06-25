import { parseFormData } from "@rvf/react-router";
import { redirect, type ActionFunctionArgs } from "react-router";
import {
  emailCaptureSchema,
  invalidEmailError,
} from "~/components/userFeedback/EmailCapture";
import { consentCookieFromRequest } from "~/services/analytics/gdprCookie.server";
import { filterFormData } from "~/util/filterFormData";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const url = formData.get("_url") as string | null;
  const relevantFormData = filterFormData(formData);
  const validationResult = await parseFormData(
    relevantFormData,
    emailCaptureSchema,
  );

  const headers = await consentCookieFromRequest({ request });
  if (validationResult.error) {
    return redirect(`${url}?${invalidEmailError.code}`, { headers });
  }
  return redirect(`${url}?success`, { headers });
};
