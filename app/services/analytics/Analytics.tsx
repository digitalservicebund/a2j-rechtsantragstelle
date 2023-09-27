import { useFetcher, useLocation } from "@remix-run/react";
import { config } from "~/services/env/web";
import { useEffect, useState } from "react";
import { posthog, PostHog } from "posthog-js";
import Button from "~/components/Button";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import type { StrapiCookieBanner } from "~/services/cms/models/StrapiCookieBannerSchema";
import CryptoJS from "crypto-js";

export const acceptCookiesFieldName = "accept-cookies";

type AnalyticsProps = {
  hasTrackingConsent?: boolean;
  content: StrapiCookieBanner;
  ip: string;
};

function captureUniquePageView(ip: string) {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();

  if (!POSTHOG_API_KEY || !POSTHOG_API_HOST) {
    return;
  }

  new PostHog().init(
    POSTHOG_API_KEY,
    {
      /* eslint-disable camelcase */
      api_host: POSTHOG_API_HOST,
      disable_cookie: true,
      disable_persistence: true,
      disable_session_recording: true,
      disable_compression: true,
      advanced_disable_decide: true,
      advanced_disable_feature_flags: true,
      advanced_disable_feature_flags_on_first_load: true,
      advanced_disable_toolbar_metrics: true,
      capture_pageleave: false,
      capture_pageview: false,
      autocapture: false,

      loaded: (posthog: PostHog) => {
        posthog.capture("page view", {
          distinct_id: CryptoJS.MD5(ip).toString(),
        });
      },
      /* eslint-enable camelcase */
    },
    "capture only",
  );
}

export function CookieBanner({
  hasTrackingConsent,
  content,
  ip,
}: AnalyticsProps) {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  const [posthogLoaded, setPosthogLoaded] = useState(false);
  const analyticsFetcher = useFetcher();
  const location = useLocation();

  useEffect(() => {
    // captureUniquePageView(ip);
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
              tagName={content.heading.tagName}
              text={content.heading.text}
              look={content.heading.look}
            />
            <div>
              <div className="ds-stack-8">
                {content.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph.text}</p>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-24 flex-wrap">
              <Button
                name={acceptCookiesFieldName}
                value="true"
                type="submit"
                look="primary"
                text={content.acceptButtonLabel}
                size="large"
              />
              <Button
                name={acceptCookiesFieldName}
                value="false"
                type="submit"
                look="primary"
                text={content.declineButtonLabel}
                size="large"
              />
              <a href="/cookie-einstellungen" className="text-link">
                {content.cookieSettingLinkText}
              </a>
            </div>
          </div>
        </Container>
      </analyticsFetcher.Form>
    </div>
  );
}
