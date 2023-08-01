import { useFetcher, useLocation } from "@remix-run/react";
import { config } from "~/services/env/web";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Button, Container } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import { acceptCookiesFieldName } from "./gdprCookie.server";

// TODO: move all text into CMS

type AnalyticsProps = {
  hasTrackingConsent?: boolean;
};

export function ResetCookieLink() {
  const analyticsFetcher = useFetcher();
  return (
    <analyticsFetcher.Form method="post" action="/action/set-analytics">
      <button type="submit" name={acceptCookiesFieldName} value="undefined">
        Cookie Einwilligung widerrufen
      </button>
    </analyticsFetcher.Form>
  );
}

export function CookieBanner({ hasTrackingConsent }: AnalyticsProps) {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  const [posthogLoaded, setPosthogLoaded] = useState(false);
  const analyticsFetcher = useFetcher();
  const location = useLocation();

  useEffect(() => {
    if (hasTrackingConsent && POSTHOG_API_KEY && POSTHOG_API_HOST) {
      posthog.init(POSTHOG_API_KEY, {
        // eslint-disable-next-line camelcase
        api_host: POSTHOG_API_HOST,
        loaded: () => {
          setPosthogLoaded(true);
        },
      });
    }
  }, [location, hasTrackingConsent, POSTHOG_API_KEY, POSTHOG_API_HOST]);

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
                <Paragraph text="Wir setzen funktionale Cookies, damit der Service funktioniert." />
                <Paragraph text="Wir verwenden auch Analyse-Cookies, um zu verstehen, wie Sie den Service nutzen und um Verbesserungen vornehmen zu können." />
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
