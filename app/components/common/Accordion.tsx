import { useRef } from "react";
import {
  AccordionItem,
  type AccordionItemProps,
} from "~/components/common/AccordionItem";
import { translations } from "~/services/translations/translations";
import { useShouldPrint } from "../hooks/useShouldPrint";

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
    <section>
      {items
        .filter((item) => item.title || item.description)
        .map((item, index) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            description={item.description}
            labels={labels}
            startOpened={shouldPrint}
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
