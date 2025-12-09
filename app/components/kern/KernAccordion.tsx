import { useRef } from "react";
import {
  AccordionItem,
  type AccordionItemProps,
} from "~/components/common/AccordionItem";
import { translations } from "~/services/translations/translations";
import { useShouldPrint } from "../hooks/useShouldPrint";
import KernRichText from "./KernRichText";

export type AccordionProps = Readonly<{
  items: AccordionItemProps[];
}>;

export default function Accordion({ items }: AccordionProps) {
  //   const shouldPrint = useShouldPrint(); doesnt work neither for KERN nor for the old accordion

  return (
    <div className="kern-accordion-group">
      {items
        .filter((item) => item.title || item.description)
        .map((item, index) => (
          <details className="kern-accordion">
            <summary className="kern-accordion__header">
              <span className="kern-title">{item.title}</span>
            </summary>
            <section className="kern-accordion__body">
              <KernRichText html={item.description} />
            </section>
          </details>
        ))}
    </div>
  );
}
