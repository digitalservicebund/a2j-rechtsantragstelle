import { useCallback, useState } from "react";
import { GridItem } from "~/components/layout/grid/GridItem";
import { translations } from "~/services/translations/translations";
import { getYoutubeVideoId } from "~/util/url";
import { KernDataProtectionBanner } from "./KernDataProtectionBanner";

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
  return (
    <img
      alt={translations.video[THUMBNAIL_TRANSLATION_KEY].de}
      className="opacity-60"
      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
    ></img>
  );
};

const KernVideo = ({ title, url }: VideoProps) => {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>();
  const ytVideoId = getYoutubeVideoId(url);

  const acceptCookies = useCallback(() => {
    setCookiesAccepted(true);
  }, []);

  return (
    <GridItem
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
      className="px-kern-space-default"
    >
      <div className="flex flex-col relative">
        {cookiesAccepted && ytVideoId ? (
          <YoutubeIFrame videoId={ytVideoId} title={title} />
        ) : (
          <>
            <YoutubeThumbnail videoId={ytVideoId} />
            <KernDataProtectionBanner onCookiesAccepted={acceptCookies} />
          </>
        )}
      </div>
    </GridItem>
  );
};

export default KernVideo;
