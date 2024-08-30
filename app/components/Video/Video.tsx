import { useCallback, useEffect, useState } from "react";
import Container from "~/components/Container";
import { useCookieConsent } from "~/components/cookieBanner/CookieConsentContext";
import { DataProtectionBanner } from "~/components/video/DataProtectionBanner";
import { useVideoTranslations } from "~/components/video/VideoTranslationContext";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { getYoutubeVideoId } from "~/util/url";

type VideoProps = {
  title: string;
  url: string;
};

const THUMBNAIL_TRANSLATION_KEY = "video-thumbnail";

const Video = ({ title, url }: VideoProps) => {
  const { hasTrackingConsent } = useCookieConsent();
  const [cookiesAccepted, setCookiesAccepted] = useState(hasTrackingConsent);
  const { translations } = useVideoTranslations();
  const ytVideoId = getYoutubeVideoId(url);

  const Thumbnail = () => (
    <img
      alt={getTranslationByKey(THUMBNAIL_TRANSLATION_KEY, translations)}
      className="opacity-60"
      src={`https://img.youtube.com/vi/${ytVideoId}/maxresdefault.jpg`}
    ></img>
  );

  const Video = () => (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?cc_load_policy=1&cc_lang_pref=de`}
      className="aspect-video"
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share;"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );

  /**
   * Event needs to fire in the case that user accepts cookies while on a page with video
   */
  useEffect(() => {
    setCookiesAccepted(hasTrackingConsent);
  }, [hasTrackingConsent]);

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true);
  }, []);

  return (
    <Container>
      <div className="flex flex-col relative">
        {cookiesAccepted ? (
          <Video />
        ) : (
          <>
            <Thumbnail />
            <DataProtectionBanner onCookiesAccepted={acceptCookies} />
          </>
        )}
      </div>
    </Container>
  );
};

export default Video;
