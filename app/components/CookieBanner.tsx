import { useFetcher, useLocation } from "@remix-run/react";
import { posthog } from "posthog-js";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import Container from "~/components/Container";
import Heading, { type HeadingProps } from "~/components/Heading";
import RichText, { type RichTextProps } from "~/components/RichText";
import { config } from "~/services/env/web";
import { StandaloneLink } from "./StandaloneLink";

export const acceptCookiesFieldName = "accept-cookies";

export type CookieBannerContentProps = {
  heading: HeadingProps;
  paragraphs: RichTextProps[];
  acceptButtonLabel: string;
  declineButtonLabel: string;
  cookieSettingLinkText: string;
  cookieSettingLinkUrl: string;
};

type CookieBannerProps = Readonly<{
  hasTrackingConsent?: boolean;
  content: CookieBannerContentProps;
}>;

export function CookieBanner({
  hasTrackingConsent,
  content,
}: CookieBannerProps) {
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  const [posthogLoaded, setPosthogLoaded] = useState(false);
  const [clientJavaScriptAvailable, setClientJavaScriptAvailable] =
    useState(false);
  const analyticsFetcher = useFetcher();
  const location = useLocation();

  useEffect(() => {
    if (hasTrackingConsent && !posthogLoaded && POSTHOG_API_KEY) {
      posthog.init(POSTHOG_API_KEY, {
        // eslint-disable-next-line camelcase
        api_host: POSTHOG_API_HOST,
        // eslint-disable-next-line camelcase
        cross_subdomain_cookie: false, // set cookie for subdomain only
        // eslint-disable-next-line camelcase
        opt_out_persistence_by_default: true,
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

  const buttonAcceptCookieTestId = clientJavaScriptAvailable
    ? "accept-cookie_with_js"
    : "accept-cookie_without_js";

  useEffect(() => {
    if (posthogLoaded) posthog.capture("$pageview");
  }, [posthogLoaded, location.pathname]);

  useEffect(() => {
    setClientJavaScriptAvailable(true);
  }, []);

  if (hasTrackingConsent !== undefined) {
    return <></>;
  }

  return (
    <section
      className="md:fixed bottom-16 right-16 left-16 md:border-2 border-b-2 border-blue-800 z-50 bg-blue-300"
      aria-label="Cookie banner"
      data-testid="cookie-banner"
    >
      <analyticsFetcher.Form
        method="post"
        action={`/action/set-analytics${
          clientJavaScriptAvailable ? "?js=1" : ""
        }`}
      >
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
                  <RichText
                    key={`${index} ${paragraph}`}
                    markdown={paragraph.markdown}
                  />
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
                data-testid={buttonAcceptCookieTestId}
              />
              <Button
                name={acceptCookiesFieldName}
                value="false"
                type="submit"
                look="primary"
                text={content.declineButtonLabel}
                size="large"
                data-testid="decline-cookie"
              />
              {content.cookieSettingLinkUrl && (
                <StandaloneLink
                  text={content.cookieSettingLinkText}
                  url={content.cookieSettingLinkUrl}
                />
              )}
            </div>
          </div>
        </Container>
      </analyticsFetcher.Form>
    </section>
  );
}
