import { useState, useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, useNavigation } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import KernButton from "~/components/kern/KernButton";
import KernHeading from "~/components/kern/KernHeading";
import { acceptCookiesFieldName } from "~/components/layout/cookieBanner/CookieBanner";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
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

export default function KernDatenschutz() {
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
    <div className="flex flex-col grow">
      <ContentComponents content={content} />
      <GridSection>
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 3, span: 7 }}
            xlColumn={{ start: 3, span: 7 }}
          >
            <Form method="post">
              <KernHeading
                tagName="h2"
                text={cookieTranslations?.heading}
                elementId="cookieSetting"
                className="text-3xl! pb-22!"
              />

              <fieldset
                className="kern-fieldset pb-22!"
                disabled={isSubmitting}
                onChange={() => setSubmitButtonDisabled(false)}
              >
                <legend className="kern-label">Einverständnis</legend>
                <div className="kern-fieldset__body">
                  <div className="kern-form-check">
                    <input
                      type="radio"
                      className="kern-form-check__radio"
                      id="cookieTrue"
                      value="true"
                      name={acceptCookiesFieldName}
                      defaultChecked={trackingConsent === "true"}
                    />
                    <label className="kern-label" htmlFor="cookieTrue">
                      {cookieTranslations?.acceptLabel}
                    </label>
                  </div>
                  <div className="kern-form-check">
                    <input
                      type="radio"
                      className="kern-form-check__radio"
                      id="cookieFalse"
                      name={acceptCookiesFieldName}
                      value="false"
                      defaultChecked={trackingConsent === "false"}
                    />
                    <label className="kern-label" htmlFor="cookieFalse">
                      {cookieTranslations?.declineLabel}
                    </label>
                  </div>
                </div>
              </fieldset>
              <KernButton
                type="submit"
                look="primary"
                text="Speichern"
                id="submitButton"
                disabled={
                  isSubmitting ||
                  (submitButtonDisabled && trackingConsent === undefined)
                }
              />
            </Form>
          </GridItem>
        </Grid>
      </GridSection>
    </div>
  );
}
