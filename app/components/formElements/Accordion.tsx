import { useShouldPrint } from "../hooks/useShouldPrint";
import RichText from "./RichText";

export type AccordionItemProps = Readonly<{
  title: string;
  description: string;
}>;
export type AccordionProps = Readonly<{
  items: AccordionItemProps[];
}>;

export default function Accordion({ items }: AccordionProps) {
  const shouldPrint = useShouldPrint();
  return (
    <div className="kern-accordion-group">
      {items
        .filter((item) => item.title || item.description)
        .map((item) => (
          <details
            key={item.title}
            className="kern-accordion"
            open={shouldPrint}
          >
            <summary className="kern-accordion__header">
              <span className="kern-title">{item.title}</span>
            </summary>
            <section className="kern-accordion__body">
              <RichText html={item.description} />
            </section>
          </details>
        ))}
    </div>
  );
}
