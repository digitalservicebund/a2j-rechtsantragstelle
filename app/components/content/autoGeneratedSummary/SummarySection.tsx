import KeyboardArrowDownIcon from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@digitalservicebund/icons/KeyboardArrowUp";
import EditIcon from "@digitalservicebund/icons/EditOutlined";
import { StandaloneLink } from "~/components/common/StandaloneLink";
import type { SummaryItem } from "~/services/summary/types";
import { useRef } from "react";

const SummarySection = ({
  item,
  itemId,
  startOpened,
  onToggle,
}: {
  readonly item: SummaryItem;
  readonly itemId: string | number;
  readonly startOpened?: boolean;
  readonly onToggle?: (itemId: string | number, isOpen: boolean) => void;
}) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleToggle = () => {
    if (onToggle && detailsRef.current) {
      onToggle(itemId, detailsRef.current.open);
    }
  };

  return (
    <details
      ref={detailsRef}
      className="p-16 group bg-blue-200 mb-16"
      open={startOpened}
      onToggle={handleToggle}
    >
      <summary className="w-full flex justify-between items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="ds-subheading-01-reg text-left">{item.title}</span>
        <span className="flex items-center text-blue-800 ds-label-03-bold">
          <span className="group-open:hidden flex items-center">
            <KeyboardArrowDownIcon />
            <span className="ml-1">Einblenden</span>
          </span>
          <span className="hidden group-open:flex items-center">
            <KeyboardArrowUpIcon />
            <span className="ml-1">Ausblenden</span>
          </span>
        </span>
      </summary>

      {item.fields.map((field, index) => (
        <div
          key={field.id}
          className={`bg-white p-16 border-b border-gray-200 flex flex-col gap-16 mb-8 ${index === 0 && !item.arrayGroups ? "mt-16" : ""}`}
        >
          {field.multipleQuestions ? (
            field.multipleQuestions.map((qa) => (
              <dl key={qa.id} className="flex items-start gap-32">
                <dt className="ds-body-01-bold flex-1">{qa.question}</dt>
                <dd className="ds-body-01-reg flex-1">{qa.answer}</dd>
              </dl>
            ))
          ) : (
            <dl className="flex items-start gap-32">
              <dt className="ds-body-01-bold flex-1">{field.question}</dt>
              <dd className="ds-body-01-reg flex-1">{field.answer}</dd>
            </dl>
          )}

          {field.editUrl && (
            <div>
              <StandaloneLink
                url={field.editUrl}
                className="flex gap-2 ds-link-01-bold items-start"
                icon={<EditIcon className="shrink-0 inline" />}
                text="Bearbeiten"
              />
            </div>
          )}
        </div>
      ))}

      {item.arrayGroups?.map((arrayGroup, groupIndex) => (
        <div
          key={`array-group-${arrayGroup.id}`}
          className={`${groupIndex === 0 && item.fields.length === 0 ? "mt-16" : ""}`}
        >
          <div className="p-12 mb-8">
            <h4 className="ds-body-01">{arrayGroup.title}</h4>
          </div>

          {arrayGroup.items.map((arrayItem, itemIndex) => (
            <div
              key={`array-item-${arrayGroup.id}-${itemIndex}`}
              className="bg-white p-16 border-b border-gray-200 flex flex-col gap-16 mb-8 ml-0"
            >
              {arrayItem.multipleQuestions ? (
                arrayItem.multipleQuestions.map((qa) => (
                  <dl key={qa.id} className="flex items-start gap-32">
                    <dt className="ds-body-01-bold flex-1">{qa.question}</dt>
                    <dd className="ds-body-01-reg flex-1">{qa.answer}</dd>
                  </dl>
                ))
              ) : (
                <dl className="flex items-start gap-32">
                  <dt className="ds-body-01-bold flex-1">
                    {arrayItem.question}
                  </dt>
                  <dd className="ds-body-01-reg flex-1">{arrayItem.answer}</dd>
                </dl>
              )}

              {arrayItem.editUrl && (
                <div>
                  <StandaloneLink
                    url={arrayItem.editUrl}
                    className="flex gap-2 ds-link-01-bold items-start"
                    icon={<EditIcon className="shrink-0 inline" />}
                    text="Bearbeiten"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </details>
  );
};

export default SummarySection;
