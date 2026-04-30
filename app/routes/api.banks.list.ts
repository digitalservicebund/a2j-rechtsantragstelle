import { type LoaderFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";
import bankCodes from "../../data/bankCodes.json";
import { type BankData } from "~/components/kern/formElements/input/IbanInput";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const validatedRequest = await validateCsrfSessionFormless(request);

  if (validatedRequest.isErr) {
    logWarning(`Error: request to banks route without CSRF token`);
    throw new Response(null, { status: 403 });
  }

  const bankData: BankData = (
    bankCodes as Array<{ Bankleitzahl: number; Bezeichnung: string }>
  ).reduce(
    (prev, curr) => ({
      ...prev,
      [curr.Bankleitzahl]: curr.Bezeichnung,
    }),
    {},
  );

  return Response.json(bankData);
};
