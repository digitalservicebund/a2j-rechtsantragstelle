import EditButton from "@digitalservicebund/icons/CreateOutlined";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import type { Context } from "~/domains/contexts";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";

type CardProps = {
  data: Context | undefined;
  subtitle?: string;
  title?: string;
  showVariableName?: boolean;
  buttonUrl: string;
  translations: Translations;
};

const formatTextWithBreaks = (text: string) =>
  text.split("\n").map((line) => (
    <>
      {line}
      <br />
    </>
  ));

function SummaryDataOverviewCard({
  data,
  title,
  subtitle,
  showVariableName = true,
  buttonUrl,
  translations,
}: CardProps) {
  if (!data) return;

  return (
    <div className="first:pt-0 scroll-my-40 !mt-8">
      <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        {title && (
          <Heading
            text={title}
            tagName="p"
            look="ds-heading-03-bold"
            dataTestid="migration-field-value"
          />
        )}
        {subtitle}
        {Object.entries(data).map(([key, value]) => {
          return (
            value && (
              <div key={key} className="first:pt-0 scroll-my-40">
                {showVariableName && (
                  <Heading
                    text={getTranslationByKey(key, translations)}
                    tagName="p"
                    look="ds-label-01-bold"
                    dataTestid="migration-field-value"
                  />
                )}
                {formatTextWithBreaks(value as string)}
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
