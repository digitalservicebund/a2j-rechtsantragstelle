import type { SummaryItem } from "~/services/summary/types";
import { useRef } from "react";
import { KernIcon } from "../../kern/common/KernIcon";

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
    <div className="kern-accordion-group">
      <details
        ref={detailsRef}
        className="kern-accordion"
        open={startOpened}
        onToggle={handleToggle}
      >
        <summary className="kern-accordion__header">
          <span className="kern-title">{item.title}</span>
        </summary>
        <section className="kern-accordion__body">
          {item.fields.map((field, index) => (
            <div
              key={field.id}
              className={`bg-white p-kern-space-default flex flex-col gap-kern-space-x-large mb-kern-space-small ${index === 0 && !item.arrayGroups ? "mt-kern-space-small" : ""}`}
            >
              {field.multipleQuestions ? (
                field.multipleQuestions.map((qa) => (
                  <dl
                    key={qa.id}
                    className="flex items-start gap-kern-space-x-large"
                  >
                    <dt className="kern-label text-kern-static-medium flex-1">
                      {qa.question}
                    </dt>
                    <dd className="kern-body text-kern-static-medium  flex-1">
                      {qa.answer}
                    </dd>
                  </dl>
                ))
              ) : (
                <dl className="flex items-start gap-kern-space-x-large">
                  <dt className="kern-label text-kern-static-medium flex-1">
                    {field.question}
                  </dt>
                  <dd className="kern-body text-kern-static-medium  flex-1">
                    {field.answer}
                  </dd>
                </dl>
              )}

              {field.editUrl && (
                <a href={field.editUrl} className="kern-link no-underline!">
                  <KernIcon name="edit" />
                  Bearbeiten
                </a>
              )}
            </div>
          ))}

          {item.arrayGroups?.map((arrayGroup, groupIndex) => (
            <div
              key={`array-group-${arrayGroup.id}`}
              className={`${groupIndex === 0 && item.fields.length === 0 ? "mt-16" : ""}`}
            >
              <div className="p-12 mb-8">
                <h4 className="kern-label">{arrayGroup.title}</h4>
              </div>

              {arrayGroup.items.map((arrayItem, itemIndex) => (
                <div
                  // oxlint-disable-next-line react/no-array-index-keys
                  key={`array-item-${arrayGroup.id}-${itemIndex}`}
                  className="bg-white p-kern-space-default flex flex-col gap-kern-space-x-large mb-kern-space-small "
                >
                  {arrayItem.multipleQuestions ? (
                    arrayItem.multipleQuestions.map((qa) => (
                      <dl
                        key={qa.id}
                        className="flex items-start gap-kern-space-x-large"
                      >
                        <dt className="kern-label text-kern-static-medium flex-1">
                          {qa.question}
                        </dt>
                        <dd className="kern-body text-kern-static-medium  flex-1">
                          {qa.answer}
                        </dd>
                      </dl>
                    ))
                  ) : (
                    <dl className="flex items-start  gap-kern-space-x-large">
                      <dt className="kern-label text-kern-static-medium flex-1">
                        {arrayItem.question}
                      </dt>
                      <dd className="kern-body text-kern-static-medium  flex-1">
                        {arrayItem.answer}
                      </dd>
                    </dl>
                  )}

                  {arrayItem.editUrl && (
                    <a
                      href={arrayItem.editUrl}
                      className="kern-link no-underline!"
                    >
                      <KernIcon name="edit" />
                      Bearbeiten
                    </a>
                  )}
                </div>
              ))}
            </div>
          ))}
        </section>
      </details>
    </div>
  );
};

export default SummarySection;
