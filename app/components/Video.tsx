import { useEffect, useRef, useState } from "react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import RichText from "~/components/RichText";

type VideoProps = {
  title: string;
  url: string;
};

const Video = ({ title, url }: VideoProps) => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [thumbnailDimensions, setThumbnailDimensions] = useState<DOMRect>();
  const thumbnailRef = useRef<HTMLImageElement | null>(null);
  const ytVideoId = url.match(/(?<=\/embed\/)\w+/g)?.at(0);
  const thumbnail = (
    <img
      ref={thumbnailRef}
      alt={`${title} Miniaturbild`}
      className="w-full opacity-60"
      src={`http://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`}
    ></img>
  );
  const video = (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?cc_load_policy=1&cc_lang_pref=en`}
      className="w-full"
      height={thumbnailDimensions?.height}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
    <>
      {cookiesAccepted ? video : thumbnail}
      {!cookiesAccepted && (
        <DatenschutzBanner onCookiesAccepted={() => setCookiesAccepted(true)} />
      )}
    </>
  );
};

/* TODO: add translations */
const DatenschutzBanner = ({
  onCookiesAccepted,
}: {
  onCookiesAccepted: () => void;
}) => {
  return (
    <section
      className="border-2 border-blue-800 z-50 bg-blue-300 relative -mt-24"
      aria-label="Datenschutz banner"
      data-testid="datenschutz-banner"
    >
      <div className="p-16 gap-y-28 flex flex-wrap">
        <Heading text="Hinweis zum Datenschutz" look="ds-heading-03-reg" />
        <RichText markdown="Durch Anklicken aktivieren Sie das YouTube-Video. Dadurch können evtl. personenbezogene Daten an Google weitergeleitet werden. Außerdem werden Cookies gespeichert. Weitere Informationen finden Sie in unseren Datenschutzbedingungen" />
        <Button
          onClick={onCookiesAccepted}
          text="Video Aktivieren"
          className="min-w-max"
          size="large"
        />
      </div>
    </section>
  );
};

export default Video;
