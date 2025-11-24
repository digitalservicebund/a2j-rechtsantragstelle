import type { ActionFunctionArgs } from "react-router";
import { useActionData } from "react-router";
import z from "zod";
import { bundIdSamlAttributes } from "~/services/bundid/attributes";
import { getBundIdSaml } from "~/services/bundid/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async () => {
  await throw404IfFeatureFlagDisabled("showBundID");
  return null;
};

const attributeSchema = z
  .object({
    [bundIdSamlAttributes.givenName]: z.string().optional(),
    [bundIdSamlAttributes.surname]: z.string().optional(),
  })
  .transform((data) => ({
    givenName: data[bundIdSamlAttributes.givenName],
    surname: data[bundIdSamlAttributes.surname],
  }));

export const action = async ({ request }: ActionFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showBundID");

  const formData = await request.formData();
  const samlResponse = formData.get("SAMLResponse");

  if (typeof samlResponse !== "string") {
    throw new Error("Invalid SAML Response");
  }

  const serviceProvider = getBundIdSaml();
  console.log(
    "validatePostResponseAsync using idpCert: ",
    serviceProvider.options.idpCert,
  );

  const { profile } = await serviceProvider.validatePostResponseAsync({
    SAMLResponse: samlResponse,
  });

  if (!profile) {
    throw new Error("Invalid SAML Response");
  }

  return attributeSchema.parse(profile);
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
