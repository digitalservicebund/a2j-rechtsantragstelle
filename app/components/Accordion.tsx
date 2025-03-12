import { useState, useEffect } from "react";
import AccordionItem, { AccordionItemProps } from "~/components/AccordionItem";

export type AccordionProps = {
  items: AccordionItemProps[];
  id?: number;
};

export default function Accordion({ items }: AccordionProps) {
  const [jsEnabled, setJsEnabled] = useState<boolean>(false);

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  if (jsEnabled) {
    return (
      <div>
        {items.map((item, index) => (
          <AccordionItem key={item.id ?? index} {...item} />
        ))}
      </div>
    );
  }

  // Fallback for no JavaScript using native details/summary,
  // which allows multiple items to be open.
  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id ?? index}>
          <details>
            <summary className="cursor-pointer text-lg font-medium py-4 px-2">
              {item.title}
            </summary>
            <div className="p-4">{item.description}</div>
          </details>
        </div>
      ))}
    </div>
  );
}
