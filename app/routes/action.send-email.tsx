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
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const url = formData.get("_url")?.toString() ?? "";
  const relevantFormData = filterFormData(formData);
  const validationResult = await parseFormData(
    relevantFormData,
    emailCaptureSchema,
  );

  const headers = await consentCookieFromRequest({ request });
  return redirect(
    `${url}?${validationResult.error ? invalidEmailError.code : "success"}`,
    { headers },
  );
};
