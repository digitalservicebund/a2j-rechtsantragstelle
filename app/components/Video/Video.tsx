import { useCallback, useEffect, useRef, useState } from "react";
import Container from "~/components/Container";
import { useCookieConsent } from "~/components/CookieBanner/CookieConsentContext";
import { DataProtectionBanner } from "~/components/Video/DataProtectionBanner";
import { useVideoTranslations } from "~/components/Video/VideoTranslationContext";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { getYoutubeVideoId } from "~/util/url";

type VideoProps = {
  title: string;
  url: string;
};

/**
 * Default size the video should be, in the case the user has already accepted cookies
 * (size will not get set by video thumbnail)
 */
const DEFAULT_SIZE: Partial<DOMRect> = {
  width: 480,
  height: 360,
};

const THUMBNAIL_TRANSLATION_KEY = "video-thumbnail";

const Video = ({ title, url }: VideoProps) => {
  const { hasTrackingConsent } = useCookieConsent();
  const [cookiesAccepted, setCookiesAccepted] = useState(hasTrackingConsent);
  const { translations } = useVideoTranslations();
  const [thumbnailDimensions, setThumbnailDimensions] =
    useState<Partial<DOMRect>>(DEFAULT_SIZE);
  const thumbnailRef = useRef<HTMLImageElement | null>(null);
  const ytVideoId = getYoutubeVideoId(url);

  const Thumbnail = () => (
    <img
      ref={thumbnailRef}
      alt={getTranslationByKey(THUMBNAIL_TRANSLATION_KEY, translations)}
      className="w-full opacity-60"
      src={`https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`}
    ></img>
  );

  const Video = () => (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?cc_load_policy=1&cc_lang_pref=de`}
      className="w-full"
      width={thumbnailDimensions.width}
      height={thumbnailDimensions.height}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );

  useEffect(() => {
    if (thumbnailRef.current) {
      setThumbnailDimensions(thumbnailRef.current.getBoundingClientRect());
    }
  }, []);

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true);
  }, []);

  return (
    <Container>
      <div className="flex flex-col">
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
