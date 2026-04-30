// oxlint-disable no-console
import { type LoaderFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";
import bankCodes from "../../data/bankCodes/data.json";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const validatedRequest = await validateCsrfSessionFormless(request);

  if (validatedRequest.isErr) {
    logWarning(`Error: request to banks route without CSRF token`);
    throw new Response(null, { status: 403 });
  }

  const rawBankData = bankCodes as Array<{
    Bankleitzahl: number;
    Bezeichnung: string;
  }>;

  let bankData: Record<number, string> = {};
  for (let i = 0, len = rawBankData.length; i < len; i++) {
    bankData[rawBankData[i].Bankleitzahl] = rawBankData[i].Bezeichnung;
  }

  return Response.json(bankData);
};
