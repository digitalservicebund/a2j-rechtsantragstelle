import { useCallback, useState } from "react";
import Container from "~/components/Container";
import { DataProtectionBanner } from "~/components/video/DataProtectionBanner";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";
import { getYoutubeVideoId } from "~/util/url";

type VideoProps = {
  title: string;
  url: string;
};

const THUMBNAIL_TRANSLATION_KEY = "video-thumbnail";

const YoutubeIFrame = ({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) => (
  <iframe
    src={`https://www.youtube-nocookie.com/embed/${videoId}?cc_load_policy=1&cc_lang_pref=de`}
    className="aspect-video"
    title={title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share;"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  ></iframe>
);

const YoutubeThumbnail = ({ videoId }: { videoId?: string }) => {
  const { video: translations } = useTranslations();
  return (
    <img
      alt={getTranslationByKey(THUMBNAIL_TRANSLATION_KEY, translations)}
      className="opacity-60"
      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
    ></img>
  );
};

const Video = ({ title, url }: VideoProps) => {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>();
  const ytVideoId = getYoutubeVideoId(url);

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true);
  }, []);

  return (
    <Container>
      <div className="flex flex-col relative">
        {cookiesAccepted && ytVideoId ? (
          <YoutubeIFrame videoId={ytVideoId} title={title} />
        ) : (
          <>
            <YoutubeThumbnail videoId={ytVideoId} />
            <DataProtectionBanner onCookiesAccepted={acceptCookies} />
          </>
        )}
      </div>
    </Container>
  );
};

export default Video;
