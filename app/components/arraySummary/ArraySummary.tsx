import AddButton from "@digitalservicebund/icons/Add";
import EditButton from "@digitalservicebund/icons/CreateOutlined";
import type { ArrayData } from "~/flows/contexts";
import type { ArrayConfig } from "~/services/array";
import type { Translations } from "~/services/cms/index.server";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import ArraySummaryItemButton from "./ArraySummaryItemButton";
import Button from "../Button";
import Heading from "../Heading";
import RichText from "../RichText";

type ArraySummaryProps = {
  readonly category: string;
  readonly arrayData: {
    data: ArrayData;
    arrayConfiguration: ArrayConfig;
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
  const changeEntryString = getTranslationByKey(
    "arrayChangeStatementButtonLabel",
    translations,
  );
  const emptyArrayFallbackString = getTranslationByKey(
    "arrayStatementIsNoLabel",
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
  const { url, initialInputUrl } = arrayData.arrayConfiguration;
  const statementValue = Boolean(arrayData.arrayConfiguration.statementValue);

  const headingTitleTagNameArraySummaryItems =
    titleHeading.trim().length > 0 ? "h3" : "h2";

  return (
    <div className="ds-stack-8 scroll-my-40 mb-24">
      {titleHeading.trim().length > 0 && (
        <Heading
          dataTestid="array-summary-title"
          text={titleHeading}
          tagName="h2"
          look="ds-heading-03-bold"
        />
      )}
      {description && <RichText markdown={description} />}
      <div className="space-y-32">
        {statementValue ? (
          <>
            {arrayData.data.map((element, index) => {
              return (
                <div
                  key={`${subtitle}_${index}`}
                  className="space-y-8 bg-white p-16"
                >
                  {Object.entries(element)
                    .filter(
                      ([elementKey, elementValue]) =>
                        elementValue &&
                        !arrayData.arrayConfiguration.hiddenFields?.includes(
                          elementKey,
                        ),
                    )
                    .map(([elementKey, elementValue]) => {
                      return (
                        <div
                          key={elementKey}
                          className="first:pt-0 scroll-my-40"
                        >
                          <Heading
                            dataTestid="array-summary-item"
                            text={getTranslationByKey(
                              `${category}.${elementKey}`,
                              translations,
                            )}
                            tagName={headingTitleTagNameArraySummaryItems}
                            look="ds-label-02-bold"
                          />
                          {translations[
                            `${category}.${elementKey}.${String(elementValue)}`
                          ] ?? elementValue}
                        </div>
                      );
                    })}
                  <ArraySummaryItemButton
                    category={category}
                    csrf={csrf}
                    initialInputUrl={initialInputUrl}
                    itemIndex={index}
                    url={url}
                    translations={translations}
                  />
                </div>
              );
            })}
            <Button
              look="primary"
              size="small"
              className="hover:shadow-none "
              iconLeft={<AddButton />}
              data-testid={`add-${category}`}
              href={`${url}/${Number(nextItemIndex)}/${initialInputUrl}`}
            >{`${subtitle} ${addButtonText}`}</Button>
          </>
        ) : (
          <div
            className="bg-white p-16 ds-label-02-bold"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>{emptyArrayFallbackString}</strong>
            <Button
              look="ghost"
              className="hover:shadow-none pl-0 pt-8"
              iconLeft={<EditButton />}
              href={arrayData.arrayConfiguration.statementUrl}
            >
              {changeEntryString}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArraySummary;
