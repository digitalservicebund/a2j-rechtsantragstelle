import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { Icon } from "../../common/Icon";
import ButtonContainer from "~/components/formElements/ButtonContainer";
import Button from "~/components/formElements/Button";
import RichText, {
  type RichTextProps,
} from "~/components/formElements/RichText";
import Heading, { type HeadingProps } from "~/components/formElements/Heading";

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
      className="right-16 left-16 z-50 border-b border-kern-layout-border!"
      aria-label="Cookie banner"
      data-testid="cookie-banner"
    >
      <analyticsFetcher.Form
        method="post"
        action={`/action/set-analytics${jsAvailable ? "?js=1" : ""}`}
      >
        <div className="p-kern-space-default! gap-kern-space-default!">
          <Heading
            managedByParent={true}
            className="kern-heading-medium"
            text={content.heading.text}
          />
          {content.paragraphs.map((paragraph) => (
            <RichText key={paragraph.html} html={paragraph.html} />
          ))}

          <ButtonContainer className="flex! items-center! pt-kern-space-default!">
            <Button
              name={acceptCookiesFieldName}
              value="false"
              type="submit"
              look="secondary"
              text={content.declineButtonLabel}
              data-testid="decline-cookie"
            />
            <Button
              name={acceptCookiesFieldName}
              value="true"
              type="submit"
              look="primary"
              text={content.acceptButtonLabel}
              data-testid={buttonAcceptCookieTestId}
            />
            {content.cookieSettingLinkUrl && (
              <a href={content.cookieSettingLinkUrl} className="kern-link">
                <Icon name="arrow-forward" />
                {content.cookieSettingLinkText}
              </a>
            )}
          </ButtonContainer>
        </div>
      </analyticsFetcher.Form>
    </section>
  );
}
