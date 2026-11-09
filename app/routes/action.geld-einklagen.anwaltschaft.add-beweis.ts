import { redirectDocument, type ActionFunctionArgs } from "react-router";
import { type BeweisType } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const formData = await request.formData();
  const nextIndex = formData.get("nextIndex");
  const beweisePathname = formData.get("beweisePathname");
  const beweisType = formData.get("type") as BeweisType | undefined;

  if (!nextIndex || !beweisType || !beweisePathname) {
    throw new Error("Missing required form data");
  }

  return redirectDocument(
    `${beweisePathname}/${nextIndex}/${beweisType}-daten`,
  );
};
