import type { BasicTypes, ObjectType } from "~/domains/userData";
import type { ArrayConfigClient } from "~/services/array";
import { type ItemLabels } from "~/services/array/getArraySummaryData";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import ArraySummaryItemActions from "./ArraySummaryItemActions";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import {
  type DateObject,
  toDateString,
} from "~/services/validation/dateObject";

type ArraySummaryItemProps = {
  readonly itemIndex: number;
  readonly items: Record<string, BasicTypes | ObjectType>;
  readonly category: string;
  readonly configuration: ArrayConfigClient;
  readonly subtitle?: HeadingProps;
  readonly itemLabels: ItemLabels;
};

const isItemValueDateObject = (
  itemValue: BasicTypes | ObjectType,
): itemValue is DateObject => {
  return (
    typeof itemValue === "object" &&
    "day" in itemValue &&
    "month" in itemValue &&
    "year" in itemValue
  );
};

const ArraySummaryDataItems = ({
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
          <Heading
            {...heading}
            managedByParent
            className="kern-title kern-title--small"
          />
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
                {isItemValueDateObject(itemValue)
                  ? toDateString(itemValue)
                  : (itemLabels[`${itemKey}.${itemValue}`] ?? itemValue)}
              </dd>
            </div>
          ))}
        </dl>

        <ArraySummaryItemActions
          heading={heading as HeadingProps}
          category={category}
          itemIndex={itemIndex}
          editUrl={editUrl}
        />
      </div>
    </div>
  );
};

export default ArraySummaryDataItems;
