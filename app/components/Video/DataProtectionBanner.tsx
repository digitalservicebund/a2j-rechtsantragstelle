import Button from "~/components/Button";
import Heading from "~/components/Heading";
import RichText, { RichTextProps } from "~/components/RichText";

export const DataProtectionBanner = ({
  onCookiesAccepted,
  dataProtection,
}: {
  onCookiesAccepted: () => void;
  dataProtection: RichTextProps;
}) => {
  return (
    <section
      className="border-2 border-blue-800 z-50 bg-blue-300 relative -mt-24"
      aria-label="Datenschutz banner"
    >
      <div className="p-16 gap-y-28 flex flex-col flex-wrap">
        {/* TODO: Use strapi translations */}
        <Heading text="Hinweis zum Datenschutz" look="ds-heading-03-reg" />
        <RichText markdown={dataProtection.markdown} />
        <Button
          onClick={onCookiesAccepted}
          text={"Video Aktivieren"}
          className="max-w-fit"
          size="large"
        />
      </div>
    </section>
  );
};
