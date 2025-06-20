import { useRef } from "react";
import {
  AccordionItem,
  type AccordionItemProps,
} from "~/components/AccordionItem";
import { translations } from "~/services/translations/translations";
import { useShouldPrint } from "~/services/hooks/useShouldPrint";

export type AccordionProps = Readonly<{
  items: AccordionItemProps[];
}>;

export default function Accordion({ items }: AccordionProps) {
  const shouldPrint = useShouldPrint();
  const itemsRef = useRef<HTMLDetailsElement[]>([]);
  const labels = {
    show: translations.accordion.show.de,
    hide: translations.accordion.hide.de,
  };

  return (
    // without overflow-hidden the rounded borders are overwritten by square content edges
    <section className="border-2 rounded-lg border-blue-500 overflow-hidden">
      {items
        .filter((item) => item.title || item.description)
        .map((item, index) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            description={item.description}
            labels={labels}
            open={shouldPrint}
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
