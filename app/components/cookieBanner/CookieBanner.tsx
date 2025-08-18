import { useEffect } from "react";
import { useFetcher } from "react-router";
import Button from "~/components/common/Button";
import Container from "~/components/common/Container";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText, { type RichTextProps } from "~/components/RichText";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { useJsAvailable } from "../hooks/useJsAvailable";
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
}: Readonly<{ content: CookieBannerContentProps }>) {
  const { posthogClient, hasTrackingConsent } = useAnalytics();
  const jsAvailable = useJsAvailable();
  const analyticsFetcher = useFetcher();

  useEffect(() => {
    if (posthogClient) {
      if (!hasTrackingConsent && posthogClient.has_opted_in_capturing()) {
        posthogClient.opt_out_capturing();
      } else if (
        hasTrackingConsent &&
        posthogClient.has_opted_out_capturing()
      ) {
        posthogClient.opt_in_capturing();
      }
    }
  }, [hasTrackingConsent, posthogClient]);

  const buttonAcceptCookieTestId = jsAvailable
    ? "accept-cookie_with_js"
    : "accept-cookie_without_js";

  if (hasTrackingConsent !== undefined) {
    return <></>;
  }

  return (
    <section
      className="right-16 left-16 border-b-2 border-blue-800 z-50 bg-blue-300"
      aria-label="Cookie banner"
      data-testid="cookie-banner"
    >
      <analyticsFetcher.Form
        method="post"
        action={`/action/set-analytics${jsAvailable ? "?js=1" : ""}`}
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
