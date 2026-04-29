import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import KernButton from "~/components/kern/KernButton";
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
      className="right-16 left-16 border-b-2 border-blue-800 z-50 bg-blue-300"
      aria-label="Cookie banner"
      data-testid="cookie-banner"
    >
      <analyticsFetcher.Form
        method="post"
        action={`/action/set-analytics${jsAvailable ? "?js=1" : ""}`}
      >
        <div className="ds-stack ds-stack-16">
          <KernHeading
            tagName={content.heading.tagName}
            text={content.heading.text}
          />
          <div>
            <div className="ds-stack ds-stack-8">
              {content.paragraphs.map((paragraph) => (
                <KernRichText key={paragraph.html} html={paragraph.html} />
              ))}
            </div>
          </div>
          <div className="flex items-end gap-24 flex-wrap">
            <KernButton
              name={acceptCookiesFieldName}
              value="true"
              type="submit"
              look="primary"
              text={content.acceptButtonLabel}
              data-testid={buttonAcceptCookieTestId}
            />
            <KernButton
              name={acceptCookiesFieldName}
              value="false"
              type="submit"
              look="primary"
              text={content.declineButtonLabel}
              data-testid="decline-cookie"
            />
            {content.cookieSettingLinkUrl && (
              <a
                href={content.cookieSettingLinkUrl}
                className="flex gap-2 ds-link-01-bold items-start"
              >
                {content.cookieSettingLinkText}
              </a>
            )}
          </div>
        </div>
      </analyticsFetcher.Form>
    </section>
  );
}
