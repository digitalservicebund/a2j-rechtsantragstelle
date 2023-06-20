import { useFetcher, useLocation } from "@remix-run/react";
import { getWebConfig } from "../config";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { analyticsConsentFormField } from "~/routes/action.set-analytics";
import type { CommonWrapperProps } from "~/components";
import { Button, Container } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import ButtonContainer from "~/components/ButtonContainer";

type AnalyticsProps = {
  hasTrackingConsent?: boolean;
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

  if (hasTrackingConsent !== undefined) {
    return <></>;
  }
  const containerProps: CommonWrapperProps = {
    paddingBottom: "16",
    paddingTop: "16",
    backgroundColor: "white",
  };

  return (
    <div
      className="fixed bottom-0 right-0 m-20 border border-gray-800"
      role="region"
    >
      <analyticsFetcher.Form method="post" action="/action/set-analytics">
        <Container {...containerProps}>
          <Heading
            tagName="h2"
            text="Cookie Consent"
            look="ds-heading-03-reg"
          />
        </Container>
        <Container {...containerProps}>
          <Paragraph text="Wir verwenden Cookies um ein optimales Benutzererlebnis zu ermöglichen." />
        </Container>
        <Container {...containerProps}>
          <ButtonContainer>
            <Button
              name={analyticsConsentFormField}
              value="false"
              type="submit"
              look="tertiary"
              text="Ablehnen"
            />
            <Button
              name={analyticsConsentFormField}
              value="true"
              type="submit"
              look="primary"
              text="Akzeptieren"
            />
          </ButtonContainer>
        </Container>
      </analyticsFetcher.Form>
    </div>
  );
}
