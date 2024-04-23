import { useFetcher, useLocation } from "@remix-run/react";
import { config } from "~/services/env/web";
import { useEffect, useState } from "react";
import { posthog } from "posthog-js";
import Button from "~/components/Button";
import Container from "~/components/Container";
import Heading, { HeadingPropsSchema } from "~/components/Heading";
import { z } from "zod";
import RichText, { RichTextPropsSchema } from "~/components/RichText";

export const acceptCookiesFieldName = "accept-cookies";

export const CookieBannerContentPropsSchema = z.object({
  heading: HeadingPropsSchema,
  paragraphs: z.array(RichTextPropsSchema),
  acceptButtonLabel: z.string(),
  declineButtonLabel: z.string(),
  cookieSettingLinkText: z.string().nullable(),
  cookieSettingLinkUrl: z.string().nullable(),
});

const CookieBannerPropsSchema = z.object({
  hasTrackingConsent: z.boolean().optional(),
  content: CookieBannerContentPropsSchema,
});

type CookieBannerProps = z.infer<typeof CookieBannerPropsSchema>;

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

  useEffect(() => {
    setClientJavaScriptAvailable(true);
  }, []);

  if (hasTrackingConsent !== undefined) {
    return <></>;
  }

  return (
    <div
      className="md:fixed bottom-16 right-16 left-16 md:border-2 border-b-2 border-blue-800 z-50 bg-blue-300"
      role="region"
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
                  <RichText key={index} markdown={paragraph.markdown} />
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
              {content.cookieSettingLinkUrl && (
                <a href={content.cookieSettingLinkUrl} className="text-link">
                  {content.cookieSettingLinkText}
                </a>
              )}
            </div>
          </div>
        </Container>
      </analyticsFetcher.Form>
    </div>
  );
}
