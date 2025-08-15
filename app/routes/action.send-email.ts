import { parseFormData } from "@rvf/react-router";
import { redirect, type ActionFunctionArgs } from "react-router";
import {
  emailCaptureSchema,
  invalidEmailError,
  emailCaptureConsentName,
} from "~/components/content/emailCapture/emailCaptureHelpers";
import { flowIdFromPathname } from "~/domains/flowIds";
import { getSessionManager } from "~/services/session.server";
import { filterFormData } from "~/util/filterFormData";

export const loader = () => redirect("/");

const formbricksEnvironmentId = "clyy3haia0008wtwmvnuzk8s5";
const formbricksSurveyId = "s8cilvvp5qilg5on3qqnhqhe";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const url = formData.get("_url") as string | null;
  const relevantFormData = filterFormData(formData);
  const validationResult = await parseFormData(
    relevantFormData,
    emailCaptureSchema,
  );

  if (validationResult.error) {
    return redirect(`${url}?${invalidEmailError.code}`);
  }

  const response = await fetch(
    `https://app.formbricks.com/api/v1/client/${formbricksEnvironmentId}/responses`,
    {
      method: "post",
      body: JSON.stringify({
        surveyId: formbricksSurveyId,
        finished: true,
        data: {
          email: validationResult.data.email,
        },
      }),
    },
  );
  if (!response.ok) {
    return redirect(`${url}?error`);
  }
  const { getSession, commitSession } = getSessionManager(
    flowIdFromPathname(url ?? "") ?? "main",
  );
  const session = await getSession(request.headers.get("Cookie"));
  session.set(emailCaptureConsentName, true);
  const headers = { "Set-Cookie": await commitSession(session) };
  return redirect(`${url}?success`, { headers });
};
