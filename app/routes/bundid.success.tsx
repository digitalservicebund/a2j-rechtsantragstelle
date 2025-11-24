import type { ActionFunctionArgs } from "react-router";
import { useActionData } from "react-router";
import z from "zod";
import { validateSamlResponse } from "~/services/bundid/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async () => {
  await throw404IfFeatureFlagDisabled("showBundID");
  return null;
};

const samlResponseSchema = z.object({ SAMLResponse: z.string() });

export const action = async ({ request }: ActionFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showBundID");

  const formData = await request.formData();
  const formEntries = Object.fromEntries(formData.entries());
  return await validateSamlResponse(samlResponseSchema.parse(formEntries));
};

export default function View() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <div>
        <span>Vorname: {actionData?.givenName}</span>
      </div>
      <div>
        <span>Nachname: {actionData?.surname}</span>
      </div>
    </div>
  );
}
