import { useState, useEffect } from "react";
import AccordionItem, { AccordionItemProps } from "~/components/AccordionItem";

export type AccordionProps = Readonly<{
  items: AccordionItemProps[];
  className?: string;
}>;

export default function Accordion({ items, className }: AccordionProps) {
  const [jsEnabled, setJsEnabled] = useState<boolean>(false);
  const hasItems = items && items.length > 0;

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  if (jsEnabled) {
    return (
      <>
        {hasItems && (
          <section
            className={`rounded-lg border-2 border-blue-500" ${className ?? ""}`}
          >
            {items.map((item, index) => (
              <AccordionItem key={item.id ?? index} {...item} />
            ))}
          </section>
        )}
      </>
    );
  }

  return (
    <>
      {hasItems && (
        <section
          className={`rounded-lg border-2 border-blue-500" ${className ?? ""}`}
        >
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
      )}
    </>
  );
}
