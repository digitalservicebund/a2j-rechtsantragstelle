import Heading from "./Heading";
import RichText from "./RichText";

export type SummaryDataOverviewProps = {
  readonly heading: string;
  readonly content?: string;
};

export default function SummaryDataOverview({
  heading,
  content,
}: SummaryDataOverviewProps) {
  return (
    <>
      <Heading text={heading} tagName="h1" look="" dataTestid="" />
      {content && (
        <RichText
          markdown={content}
          className="space-y-16 bg-white pt-32 pb-44 px-32"
        />
      )}
      {/* <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        <div key={""} className="first:pt-0 scroll-my-40">
          <Heading
            text={getTranslationByKey(itemKey, translations)}
            tagName="p"
            look="ds-label-01-bold"
            dataTestid="migration-field-value"
          />
          {renderMigrationValue(translations, itemValue, itemKey)}
        </div>

      {buttonUrl && (
        <Button href={buttonUrl} look="tertiary" size="large" className="w-fit">
          {getTranslationByKey(MIGRATION_BUTTON_TEXT_TRANSLATION, translations)}
        </Button>
      )}
      </div> */}
    </>
  );
}
