import { useState, useEffect } from "react";
import AccordionItem, { AccordionItemProps } from "~/components/AccordionItem";

export type AccordionProps = {
  items: AccordionItemProps[];
  className?: string;
};

export default function Accordion({
  items,
  className = "rounded-lg border-2 border-blue-500",
}: AccordionProps): JSX.Element {
  const [jsEnabled, setJsEnabled] = useState<boolean>(false);

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  if (jsEnabled) {
    return (
      <section className={className}>
        {items.map((item, index) => (
          <AccordionItem key={item.id ?? index} {...item} />
        ))}
      </section>
    );
  }

  // Fallback for no JavaScript using native details/summary,
  // which allows multiple items to be open.
  return (
    <section className={className}>
      {items.map((item, index) => (
        <div key={item.id ?? index} className="mb-4">
          <details>
            <summary className="cursor-pointer text-lg font-medium py-4 px-2">
              {item.title}
            </summary>
            <div className="p-4">{item.description}</div>
          </details>
        </div>
      ))}
    </section>
  );
}
