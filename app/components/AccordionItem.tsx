import KeyboardArrowDownIcon from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@digitalservicebund/icons/KeyboardArrowUp";
import { forwardRef, type MouseEventHandler } from "react";
import RichText from "~/components/RichText";

export type AccordionItemProps = Readonly<{
  title: string;
  description: string;
}>;

export default forwardRef<
  HTMLDetailsElement,
  AccordionItemProps & {
    onSummaryClick?: MouseEventHandler;
    labels: {
      show: string;
      hide: string;
    };
  }
>(function AccordionItem({ title, description, onSummaryClick, labels }, ref) {
  return (
    <details
      className="group last:border-b-0 border-b-2 border-blue-500"
      ref={ref}
    >
      <summary
        onClick={onSummaryClick}
        className="flex justify-between cursor-pointer p-16 bg-blue-100 "
        role="button"
      >
        <span className="ds-label-01-bold">{title}</span>
        <span className="flex group-open:hidden text-blue-800 ds-label-03-bold items-center">
          <KeyboardArrowDownIcon /> {labels.show}
        </span>
        <span className="hidden group-open:flex text-blue-800 ds-label-03-bold items-center">
          <KeyboardArrowUpIcon /> {labels.hide}
        </span>
      </summary>
      <RichText
        className="ds-body-02-reg px-16 pt-16 pb-24 gap-y-32"
        html={description}
      />
    </details>
  );
});
