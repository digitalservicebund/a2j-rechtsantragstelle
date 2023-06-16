import { useFetcher, useLocation } from "@remix-run/react";
import { getWebConfig } from "../config";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { analyticsConsentFormField } from "~/routes/action.enable-analytics";
import { Button } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";

type AnalyticsProps = {
  hasTrackingConsent: boolean;
};

export function Analytics({ hasTrackingConsent }: AnalyticsProps) {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = getWebConfig();
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

  if (hasTrackingConsent) {
    return <></>;
  }

  return (
    <div className="fixed bottom-0 right-0 p-20">
      <analyticsFetcher.Form
        method="post"
        action="/action/enable-analytics"
        className="border border-gray-800 p-8"
      >
        <Heading tagName="h3" text="Cookies" look="ds-heading-03-reg" />
        <Paragraph text="We use cookies to analyze our traffic and create a smooth user experience." />
        <Button
          name={analyticsConsentFormField}
          value="true"
          type="submit"
          look="primary"
          text="Akzeptieren"
        />
      </analyticsFetcher.Form>
    </div>
  );
}
