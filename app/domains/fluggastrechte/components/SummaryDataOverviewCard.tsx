import EditButton from "@digitalservicebund/icons/CreateOutlined";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import type { Context } from "~/domains/contexts";
import type { Translations } from "~/services/translations/getTranslationByKey";

type CardProps = {
  readonly data: Context | undefined;
  readonly subtitle?: string;
  readonly title?: string;
  readonly showValueHeading?: boolean;
  readonly buttonUrl: string;
  readonly translations: Translations;
};

function getTranslationByKey(key: string, translations?: Translations): string {
  const translation = translations?.[key];
  return translation ?? key;
}
const formatTextWithBreaks = (text: string) =>
  text.split("\n").map((line) => <p key={line}>{line}</p>);

function SummaryDataOverviewCard({
  data,
  title,
  subtitle,
  showValueHeading = true,
  buttonUrl,
  translations,
}: CardProps) {
  if (!data) return;

  return (
    <div className="first:pt-0 scroll-my-40 !mt-8">
      <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        {title && (
          <Heading
            text={getTranslationByKey(title, translations)}
            tagName="p"
            look="ds-heading-03-bold"
          />
        )}
        {subtitle}
        {Object.entries(data).map(([key, value]) => {
          return (
            value && (
              <div key={key} className="first:pt-0 scroll-my-40">
                {showValueHeading && (
                  <Heading
                    text={getTranslationByKey(key, translations)}
                    tagName="p"
                    look="ds-label-01-bold"
                  />
                )}
                {formatTextWithBreaks(
                  getTranslationByKey(value as string, translations),
                )}
              </div>
            )
          );
        })}
        <Button
          iconLeft={<EditButton />}
          href={buttonUrl}
          look="tertiary"
          size="large"
          className="w-fit"
        >
          Bearbeiten
        </Button>
      </div>
    </div>
  );
}

export default SummaryDataOverviewCard;
