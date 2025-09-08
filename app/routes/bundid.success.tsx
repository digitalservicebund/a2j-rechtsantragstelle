/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ActionFunctionArgs } from "react-router";
import { useActionData } from "react-router";
// @ts-ignore optional dependency
import * as samlify from "samlify";
import {
  getBundIdIdentityProvider,
  getBundIdServiceProvider,
} from "~/services/bundid/index.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

export const loader = async () => {
  await throw404IfFeatureFlagDisabled("showBundID");
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await throw404IfFeatureFlagDisabled("showBundID");

  const formData = await request.formData();
  const samlResponse = formData.get("SAMLResponse");

  if (typeof samlResponse !== "string") {
    throw new Error("Invalid SAML Response");
  }

  const samlHttpRequest = {
    body: {
      SAMLResponse: samlResponse,
    },
  };

  const identityProvider = getBundIdIdentityProvider();
  const serviceProvider = getBundIdServiceProvider();

  samlify.setSchemaValidator({
    validate: (_: string) => {
      return Promise.resolve("skipped");
    },
  });

  const response = await serviceProvider.parseLoginResponse(
    identityProvider,
    "post",
    samlHttpRequest,
  );
  const responseAttributes = response.extract.attributes;

  const BUNDID_PRENAME_KEY = "urn:oid:2.5.4.42";
  const BUNDID_SURNAME_KEY = "urn:oid:2.5.4.4";
  return {
    prename: responseAttributes[BUNDID_PRENAME_KEY],
    surname: responseAttributes[BUNDID_SURNAME_KEY],
  };
};

export default function View() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      <div>
        <span>Vorname: {actionData?.prename}</span>
      </div>
      <div>
        <span>Nachname: {actionData?.surname}</span>
      </div>
    </div>
  );
}
