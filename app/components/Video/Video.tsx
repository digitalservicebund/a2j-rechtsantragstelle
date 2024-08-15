import { useEffect, useRef, useState } from "react";
import { RichTextProps } from "~/components/RichText";
import { DataProtectionBanner } from "~/components/Video/DataProtectionBanner";

type VideoProps = {
  title: string;
  url: string;
  dataProtection: RichTextProps;
};

const Video = ({ title, url, dataProtection }: VideoProps) => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [thumbnailDimensions, setThumbnailDimensions] = useState<DOMRect>();
  const thumbnailRef = useRef<HTMLImageElement | null>(null);
  const ytVideoId = url.match(/(?<=(v=)|(be\/))\w+/g)?.at(0);
  const thumbnail = (
    <img
      ref={thumbnailRef}
      alt={`${title} Miniaturbild`}
      className="w-full opacity-60"
      src={`https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`}
    ></img>
  );
  const video = (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?cc_load_policy=1&cc_lang_pref=de`}
      className="w-full"
      height={thumbnailDimensions?.height}
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

  return (
    <div className="flex flex-col">
      {cookiesAccepted ? (
        video
      ) : (
        <>
          {thumbnail}
          <DataProtectionBanner
            onCookiesAccepted={() => setCookiesAccepted(true)}
            dataProtection={dataProtection}
          />
        </>
      )}
    </div>
  );
};

export default Video;
