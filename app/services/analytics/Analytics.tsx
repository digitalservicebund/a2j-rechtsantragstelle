import { useFetcher, useLocation } from "@remix-run/react";
import { config } from "~/services/env/web";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import Button from "~/components/Button";
import Container from "~/components/Container";
import Heading from "~/components/Heading";

// TODO: move all text into CMS
export const acceptCookiesFieldName = "accept-cookies";

type AnalyticsProps = {
  hasTrackingConsent?: boolean;
};

export function CookieBanner({ hasTrackingConsent }: AnalyticsProps) {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  const [posthogLoaded, setPosthogLoaded] = useState(false);
  const analyticsFetcher = useFetcher();
  const location = useLocation();

  useEffect(() => {
    if (
      hasTrackingConsent &&
      !posthogLoaded &&
      POSTHOG_API_KEY &&
      POSTHOG_API_HOST
    ) {
      posthog.init(POSTHOG_API_KEY, {
        // eslint-disable-next-line camelcase
        api_host: POSTHOG_API_HOST,
        // eslint-disable-next-line camelcase
        cross_subdomain_cookie: false, // set cookie for sub domain only
        loaded: () => {
          setPosthogLoaded(true);
        },
      });
    } else if (!hasTrackingConsent && posthogLoaded) {
      posthog.opt_out_capturing();
    } else if (hasTrackingConsent && posthogLoaded) {
      posthog.opt_in_capturing();
    }
  }, [
    location,
    hasTrackingConsent,
    posthogLoaded,
    POSTHOG_API_KEY,
    POSTHOG_API_HOST,
  ]);

  useEffect(() => {
    if (posthogLoaded) posthog.capture("$pageview");
  }, [posthogLoaded, location.pathname]);

  if (hasTrackingConsent !== undefined) {
    return <></>;
  }

  return (
    <div
      className="md:fixed bottom-16 right-16 left-16 md:border-2 border-b-2 border-blue-800 z-50 bg-blue-300"
      role="region"
      data-testid="cookie-banner"
    >
      <analyticsFetcher.Form method="post" action="/action/set-analytics">
        <Container paddingTop="32" paddingBottom="40">
          <div className="ds-stack-16">
            <Heading
              tagName="h2"
              text="Hinweis zum Datenschutz"
              look="ds-heading-03-reg"
            />
            <div>
              <div className="ds-stack-8">
                <p>
                  Wir setzen funktionale Cookies, damit der Service
                  funktioniert."
                </p>
                <p>
                  Wir verwenden auch Analyse-Cookies, um zu verstehen, wie Sie
                  den Service nutzen und um Verbesserungen vornehmen zu können."
                </p>
              </div>
            </div>
            <div className="flex items-end gap-24 flex-wrap">
              <Button
                name={acceptCookiesFieldName}
                value="true"
                type="submit"
                look="primary"
                text="Akzeptieren"
                size="large"
              />
              <Button
                name={acceptCookiesFieldName}
                value="false"
                type="submit"
                look="primary"
                text="Ablehnen"
                size="large"
              />
              <a href="/cookie-einstellungen" className="text-link">
                Cookie Einstellungen
              </a>
            </div>
          </div>
        </Container>
      </analyticsFetcher.Form>
    </div>
  );
}
