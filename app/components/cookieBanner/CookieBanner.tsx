import { useFetcher, useLocation } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import Button from "~/components/Button";
import Container from "~/components/Container";
import { CookieConsentContext } from "~/components/cookieBanner/CookieConsentContext";
import Heading, { type HeadingProps } from "~/components/Heading";
import RichText, { type RichTextProps } from "~/components/RichText";
import { usePosthog } from "~/services/analytics/PosthogContext";
import { idFromCookie } from "~/services/analytics/posthogHelpers";
import { StandaloneLink } from "../StandaloneLink";

export const acceptCookiesFieldName = "accept-cookies";

type CookieBannerContentProps = {
  heading: HeadingProps;
  paragraphs: RichTextProps[];
  acceptButtonLabel: string;
  declineButtonLabel: string;
  cookieSettingLinkText: string;
  cookieSettingLinkUrl: string;
};

export function CookieBanner({
  content,
}: Readonly<{
  content: CookieBannerContentProps;
}>) {
  const hasTrackingConsent = useContext(CookieConsentContext);
  const { posthog, cookieHeader } = usePosthog();
  const [clientJavaScriptAvailable, setClientJavaScriptAvailable] =
    useState(false);
  const analyticsFetcher = useFetcher();
  const location = useLocation();

  useEffect(() => {
    const captureConsent = async () => {
      if (!hasTrackingConsent && posthog?.optOut) {
        await posthog.optOut();
      } else if (hasTrackingConsent && posthog?.optIn) {
        await posthog.optIn();
      }
    };

    captureConsent().catch((reason) => {
      console.log("failed :(");
      console.error(reason);
    });
  }, [location, hasTrackingConsent, posthog]);

  const buttonAcceptCookieTestId = clientJavaScriptAvailable
    ? "accept-cookie_with_js"
    : "accept-cookie_without_js";

  useEffect(() => {
    if (posthog?.capture)
      posthog.capture({
        event: "$pageview",
        distinctId: idFromCookie(cookieHeader),
      });
  }, [posthog, location.pathname, cookieHeader]);

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
          <div className="ds-stack ds-stack-16">
            <Heading
              tagName={content.heading.tagName}
              text={content.heading.text}
              look={content.heading.look}
            />
            <div>
              <div className="ds-stack ds-stack-8">
                {content.paragraphs.map((paragraph) => (
                  <RichText key={paragraph.html} html={paragraph.html} />
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
