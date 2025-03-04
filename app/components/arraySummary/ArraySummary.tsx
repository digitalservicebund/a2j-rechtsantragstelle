import AddButton from "@digitalservicebund/icons/Add";
import type { ArrayData } from "~/domains/contexts";
import type { ArrayConfigClient } from "~/services/array";
import {
  getTranslationByKey,
  type Translations,
} from "~/services/translations/getTranslationByKey";
import ArraySummaryDataItems from "./ArraySummaryDataItems";
import Button from "../Button";
import Heading from "../Heading";
import RichText from "../RichText";

type ArraySummaryProps = {
  readonly category: string;
  readonly arrayData: {
    data: ArrayData;
    configuration: ArrayConfigClient;
  };
  readonly translations?: Translations;
  readonly csrf: string;
};

const ArraySummary = ({
  category,
  arrayData,
  csrf,
  translations = {},
}: ArraySummaryProps) => {
  const addButtonText = getTranslationByKey(
    "arrayAddButtonLabel",
    translations,
  );
  const titleHeading = getTranslationByKey(
    `${category}.label.title`,
    translations,
  );
  const subtitle = getTranslationByKey(
    `${category}.label.subtitle`,
    translations,
  );
  const description: string | undefined =
    translations[`${category}.description`];
  const nextItemIndex = String(arrayData.data.length);
  const { url, initialInputUrl, disableAddButton } = arrayData.configuration;
  const hasTitleHeading = titleHeading.trim().length > 0;

  return (
    <div>
      <div className="ds-stack-8">
        {hasTitleHeading && (
          <Heading
            dataTestid="array-summary-title"
            text={titleHeading}
            tagName="h2"
            look="ds-heading-03-bold"
          />
        )}
        {description && <RichText html={description} />}
        <div className="space-y-32">
          {arrayData.data
            .filter((items) => items !== undefined)
            .map((items, index) => (
              <ArraySummaryDataItems
                // eslint-disable-next-line react/no-array-index-key
                key={`${subtitle}_${index}`}
                configuration={arrayData.configuration}
                itemIndex={index}
                items={items}
                category={category}
                csrf={csrf}
                headingTitleTagNameItem={hasTitleHeading ? "h3" : "h2"}
                translations={translations}
              />
            ))}
          <Button
            look="primary"
            size="small"
            className={`hover:shadow-none ${
              disableAddButton ? "is-disabled pointer-events-none" : ""
            }`}
            iconLeft={<AddButton />}
            data-testid={`add-${category}`}
            href={`${url}/${Number(nextItemIndex)}/${initialInputUrl}`}
          >{`${subtitle} ${addButtonText}`}</Button>
        </div>
      </div>
    </div>
  );
};

export default ArraySummary;
