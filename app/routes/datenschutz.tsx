import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import Button from "~/components/Button";
import Container from "~/components/Container";
import { acceptCookiesFieldName } from "~/components/cookieBanner/CookieBanner";
import Heading from "~/components/Heading";
import PageContent from "~/components/PageContent";
import {
  consentCookieFromRequest,
  trackingCookieValue,
} from "~/services/analytics/gdprCookie.server";
import {
  fetchTranslations,
  strapiPageFromRequest,
} from "~/services/cms/index.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const [{ content, pageMeta }, trackingConsent, cookieTranslations] =
    await Promise.all([
      strapiPageFromRequest({ request }),
      trackingCookieValue({ request }),
      fetchTranslations("cookieSetting"),
    ]);

  return {
    meta: pageMeta,
    content,
    trackingConsent,
    acceptCookiesFieldName,
    cookieTranslations,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const headers = await consentCookieFromRequest({ request });
  return redirect("/datenschutz/erfolg", { headers });
}

export default function Index() {
  const {
    trackingConsent,
    content,
    acceptCookiesFieldName,
    cookieTranslations,
  } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  useEffect(() => {
    setSubmitButtonDisabled(trackingConsent === undefined);
  }, [trackingConsent]);

  return (
    <>
      <PageContent content={content} />
      <Container paddingTop="0">
        <Form method="post" className="ds-stack-24">
          <Heading
            tagName="h2"
            text={cookieTranslations?.heading}
            look="ds-heading-02-reg"
            elementId="cookieSetting"
            className="pt-32 border-0 border-solid border-0 border-t-2 border-gray-400"
          />

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
                {cookieTranslations?.acceptLabel}
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
                {cookieTranslations?.declineLabel}
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
