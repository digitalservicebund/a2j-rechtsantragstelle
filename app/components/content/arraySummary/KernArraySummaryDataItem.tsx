import { type KernHeadingProps } from "~/components/kern/KernHeading";
import type { BasicTypes } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import KernArraySummaryItemActions from "./KernArraySummaryItemActions";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";

type ArraySummaryItemProps = {
  readonly itemIndex: number;
  readonly items: Record<string, BasicTypes>;
  readonly category: string;
  readonly configuration: ArrayConfigClient;
  readonly subtitle?: KernHeadingProps;
  readonly itemLabels: ItemLabels;
};

const KernArraySummaryDataItems = ({
  itemIndex,
  items,
  category,
  configuration,
  subtitle,
  itemLabels,
}: ArraySummaryItemProps) => {
  const { url, initialInputUrl, hiddenFields, displayIndexOffset } =
    configuration;
  const itemsWithoutHiddenFields = Object.entries(items).filter(
    ([itemKey, itemValue]) => itemValue && !hiddenFields?.includes(itemKey),
  );

  if (itemsWithoutHiddenFields.length === 0) {
    return null;
  }

  const heading = applyStringReplacement(
    subtitle ?? "",
    {
      indexArray: (itemIndex + (displayIndexOffset ?? 1)).toString(),
    },
    false,
  );

  const editUrl = `${url}/${itemIndex}/${initialInputUrl}`;

  return (
    <div className="kern-summary">
      <div className="kern-summary__header gap-kern-space-small!">
        {heading && (
          <h3 className="kern-title kern-title--small" id={heading.elementId}>
            {heading.text}
          </h3>
        )}
      </div>
      <div className="kern-summary__body bg-white!">
        <dl className="kern-description-list">
          {itemsWithoutHiddenFields.map(([itemKey, itemValue]) => (
            <div className="kern-description-list-item" key={itemKey}>
              <dt className="kern-description-list-item__key">
                {getTranslationByKey(itemKey, itemLabels)}
              </dt>
              <dd className="kern-description-list-item__value">
                <pre>
                  {(itemLabels[`${itemKey}.${itemValue}`] ??
                  Array.isArray(itemValue)) // workaround for displaying nested array content
                    ? JSON.stringify(itemValue, null, 2)
                    : itemValue}
                </pre>
              </dd>
            </div>
          ))}
        </dl>

        <KernArraySummaryItemActions
          heading={heading as KernHeadingProps}
          category={category}
          itemIndex={itemIndex}
          editUrl={editUrl}
        />
      </div>
    </div>
  );
};

export default KernArraySummaryDataItems;
