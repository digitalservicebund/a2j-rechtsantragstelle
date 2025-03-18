import { useRef } from "react";
import AccordionItem, { type AccordionItemProps } from "./AccordionItem";

export type AccordionProps = Readonly<{
  items: AccordionItemProps[];
}>;

export default function Accordion({ items }: AccordionProps) {
  const itemsRef = useRef<HTMLDetailsElement[]>([]);

  return (
    <section className="border-2 rounded-lg border-blue-500">
      {items.map((item, index) => (
        <AccordionItem
          key={item.title}
          title={item.title}
          description={item.description}
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
