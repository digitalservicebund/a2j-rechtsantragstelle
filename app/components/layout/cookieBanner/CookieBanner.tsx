import { useEffect } from "react";
import { useFetcher } from "react-router";
import { Icon } from "~/components/common/Icon";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import KernHeading, {
  type KernHeadingProps,
} from "~/components/kern/KernHeading";
import KernRichText, {
  type RichTextProps,
} from "~/components/kern/KernRichText";
import { useAnalytics } from "~/services/analytics/useAnalytics";

export const acceptCookiesFieldName = "accept-cookies";

type CookieBannerContentProps = {
  heading: KernHeadingProps;
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
          <KernHeading
            managedByParent={true}
            className="kern-heading-medium"
            text={content.heading.text}
          />
          {content.paragraphs.map((paragraph) => (
            <KernRichText key={paragraph.html} html={paragraph.html} />
          ))}

          <KernButtonContainer className="flex! items-center! pt-kern-space-default!">
            <KernButton
              name={acceptCookiesFieldName}
              value="false"
              type="submit"
              look="secondary"
              text={content.declineButtonLabel}
              data-testid="decline-cookie"
            />
            <KernButton
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
          </KernButtonContainer>
        </div>
      </analyticsFetcher.Form>
    </section>
  );
}
