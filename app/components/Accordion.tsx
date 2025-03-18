import { useRef } from "react";
import AccordionItem, {
  type AccordionItemProps,
} from "~/components/AccordionItem";
import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { useTranslations } from "~/services/translations/translationsContext";

export type AccordionProps = Readonly<{
  items: AccordionItemProps[];
}>;

export default function Accordion({ items }: AccordionProps) {
  const itemsRef = useRef<HTMLDetailsElement[]>([]);
  const { accordion } = useTranslations();
  const labels = {
    show: getTranslationByKey("accordionItemShow", accordion),
    hide: getTranslationByKey("accordionItemHide", accordion),
  };

  return (
    <section className="border-2 rounded-lg border-blue-500">
      {items
        .filter((item) => item.title || item.description)
        .map((item, index) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            description={item.description}
            labels={labels}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            onSummaryClick={(event) =>
              itemsRef.current
                .filter((item) => item !== event.currentTarget.parentElement)
                .forEach((item) => {
                  item.open = false;
                })
            }
          />
        ))}
    </section>
  );
}
