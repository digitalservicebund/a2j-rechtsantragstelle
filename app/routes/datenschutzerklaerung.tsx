import { useState, useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData, useNavigation } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { acceptCookiesFieldName } from "~/components/layout/cookieBanner/CookieBanner";
import {
  consentCookieFromRequest,
  trackingCookieValue,
} from "~/services/analytics/gdprCookie.server";
import {
  fetchTranslations,
  strapiPageFromRequest,
} from "~/services/cms/index.server";
import { GridSection } from "~/components/layout/grid/GridSection";
import { GridItem } from "~/components/layout/grid/GridItem";
import { Grid } from "~/components/layout/grid/Grid";
import Heading from "~/components/formElements/Heading";
import Button from "~/components/formElements/Button";

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
  return redirect("/datenschutzerklaerung/erfolg", { headers });
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
    <div className="flex flex-col grow">
      <ContentComponents content={content} />
      <GridSection>
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 3, span: 7 }}
            xlColumn={{ start: 3, span: 7 }}
            className="pb-80"
          >
            <Form
              method="post"
              className="flex flex-col gap-kern-space-x-large"
            >
              <Heading
                tagName="h2"
                text={cookieTranslations?.heading}
                elementId="cookieSetting"
                size="large"
              />

              <fieldset
                className="kern-fieldset px-kern-space-default!"
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
              <div className="px-kern-space-default">
                <Button
                  type="submit"
                  look="primary"
                  text="Speichern"
                  id="submitButton"
                  disabled={
                    isSubmitting ||
                    (submitButtonDisabled && trackingConsent === undefined)
                  }
                />
              </div>
            </Form>
          </GridItem>
        </Grid>
      </GridSection>
    </div>
  );
}
