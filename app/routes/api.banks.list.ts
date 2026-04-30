import { type LoaderFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";
import bankCodes from "../../data/bankCodes.json";
import { bankDataSchema } from "~/components/kern/formElements/input/IbanInput";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const validatedRequest = await validateCsrfSessionFormless(request);

  if (validatedRequest.isErr) {
    logWarning(`Error: request to banks route without CSRF token`);
    throw new Response(null, { status: 403 });
  }

  const parsedBankData = await bankDataSchema.safeParseAsync(bankCodes);
  if (!parsedBankData.success) {
    throw new Response(
      `Unable to successfully parse schema: ${parsedBankData.error.message}`,
      { status: 500 },
    );
  }
  return Response.json(parsedBankData.data);
};
