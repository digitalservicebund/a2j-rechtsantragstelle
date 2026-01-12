import KernRichText from "./KernRichText";

type KernAccordionItemProps = Readonly<{
  title: string;
  description: string;
}>;
export type KernAccordionProps = Readonly<{
  items: KernAccordionItemProps[];
}>;

export default function KernAccordion({ items }: KernAccordionProps) {
  return (
    <div className="kern-accordion-group">
      {items
        .filter((item) => item.title || item.description)
        .map((item) => (
          <details key={item.title} className="kern-accordion">
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
