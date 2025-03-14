import { useState, useEffect } from "react";
import AccordionItem, { AccordionItemProps } from "~/components/AccordionItem";

export type AccordionProps = Readonly<{
  items: AccordionItemProps[];
  className?: string;
}>;

export default function Accordion({ items, className }: AccordionProps) {
  const [jsEnabled, setJsEnabled] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const hasItems = items && items.length > 0;

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  return (
    <div>
      {hasItems && (
        <section
          className={`rounded-lg border-2 border-blue-500 ${className ?? ""}`}
        >
          {items.map((item, index) => (
            <AccordionItem
              key={item.id ?? index}
              title={item.title}
              description={item.description}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? -1 : index))
              }
              jsEnabled={jsEnabled}
            />
          ))}
        </section>
      )}
    </div>
  );
}
