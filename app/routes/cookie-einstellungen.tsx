import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Button, Container } from "~/components";
import PageContent from "~/components/PageContent";
import { acceptCookiesFieldName } from "~/services/analytics/Analytics";
import {
  consentCookieFromRequest,
  trackingCookieValue,
} from "~/services/analytics/gdprCookie.server";
import { strapiPageFromRequest } from "~/services/cms/index.server";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta?.title ?? location.pathname },
];

export async function loader({ request }: LoaderArgs) {
  const { content, meta } = await strapiPageFromRequest({ request });
  const trackingConsent = await trackingCookieValue({ request });
  return { meta, content, trackingConsent, acceptCookiesFieldName };
}

export async function action({ request }: ActionArgs) {
  const headers = { "Set-Cookie": await consentCookieFromRequest({ request }) };
  return redirect("/cookie-einstellungen/erfolg", { headers });
}

export default function Index() {
  const { trackingConsent, content, acceptCookiesFieldName } =
    useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(
    trackingConsent === undefined,
  );

  return (
    <>
      <PageContent content={content} />
      <Container paddingTop="0">
        <Form method="post" className="ds-stack-24">
          <fieldset
            className="border-0 p-0 m-0 ds-stack-16"
            disabled={isSubmitting}
            onChange={() => setSubmitButtonDisabled(false)}
          >
            <div>
              <input
                type="radio"
                className="ds-radio"
                id="cookieTrue"
                value="true"
                name={acceptCookiesFieldName}
                defaultChecked={trackingConsent === "true"}
              />
              <label htmlFor="cookieTrue">
                Ich bin mit der Nutzung von Analyse-Cookies einverstanden
              </label>
            </div>
            <div>
              <input
                type="radio"
                className="ds-radio"
                id="cookieFalse"
                name={acceptCookiesFieldName}
                value="false"
                defaultChecked={trackingConsent === "false"}
              />
              <label htmlFor="cookieFalse">
                Ich bin mit der Nutzung von Analyse-Cookies nicht einverstanden
              </label>
            </div>
          </fieldset>
          <div>
            <Button
              type="submit"
              look="primary"
              size="large"
              text="Speichern"
              id="submitButton"
              disabled={
                isSubmitting ||
                (submitButtonDisabled && trackingConsent === undefined)
              }
            />
          </div>
        </Form>
      </Container>
    </>
  );
}
