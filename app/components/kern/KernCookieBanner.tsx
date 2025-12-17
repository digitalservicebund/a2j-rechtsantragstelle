import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import KernButton from "./KernButton";
import KernRichText, { type RichTextProps } from "./KernRichText";
import { type HeadingProps } from "../common/Heading";

export const acceptCookiesFieldName = "accept-cookies";

type CookieBannerContentProps = {
  heading: HeadingProps;
  paragraphs: RichTextProps[];
  acceptButtonLabel: string;
  declineButtonLabel: string;
  cookieSettingLinkText: string;
  cookieSettingLinkUrl: string;
};

export function KernCookieBanner({
  content,
}: Readonly<{ content: CookieBannerContentProps }>) {
  const { posthogClient, hasTrackingConsent } = useAnalytics();
  const jsAvailable = useJsAvailable();
  const analyticsFetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(true);

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

  function closeModal() {
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div
      className="kern-dialog fixed bottom-4 z-50 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 w-[calc(100%-2rem)] max-w-sm"
      aria-label="Cookie banner"
      data-testid="cookie-banner"
    >
      <analyticsFetcher.Form
        method="post"
        action={`/action/set-analytics${jsAvailable ? "?js=1" : ""}`}
      >
        <header className="kern-dialog__header flex! justify-between! items-center!">
          <h2 className="kern-title">{content.heading.text}</h2>
          <KernButton
            type="button"
            look="ghost"
            iconLeft={
              <span
                className="kern-icon kern-icon--close bg-kern-action-default!"
                aria-hidden="true"
              />
            }
            onClick={closeModal}
          />
        </header>
        <section className="kern-dialog__body">
          {content.paragraphs.map((paragraph) => (
            <KernRichText key={paragraph.html} html={paragraph.html} />
          ))}
          {content.cookieSettingLinkUrl && (
            <a href={content.cookieSettingLinkUrl} className="kern-link">
              <span
                className="kern-icon kern-icon--arrow-forward"
                aria-hidden="true"
              />
              {content.cookieSettingLinkText}
            </a>
          )}
        </section>
        <footer className="kern-dialog__footer">
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
        </footer>
      </analyticsFetcher.Form>
    </div>
  );
}
