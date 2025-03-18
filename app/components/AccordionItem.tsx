import KeyboardArrowDownIcon from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@digitalservicebund/icons/KeyboardArrowUp";
import { forwardRef, type MouseEventHandler } from "react";
import RichText from "~/components/RichText";
import { useTranslations } from "~/services/translations/translationsContext";

export type AccordionItemProps = Readonly<{
  title: string;
  description: string;
}>;

export default forwardRef<
  HTMLDetailsElement,
  AccordionItemProps & { onSummaryClick?: MouseEventHandler }
>(function AccordionItem({ title, description, onSummaryClick }, ref) {
  const { accordion } = useTranslations();

  return (
    <details
      className="group border last:border-b-0 border-b-2 p-2 border-blue-500 align-middle"
      ref={ref}
    >
      <summary
        onClick={onSummaryClick}
        className="flex align-middle justify-between cursor-pointer p-16 bg-blue-100"
        role="button"
      >
        <span className="ds-label-01-bold">{title}</span>
        <span className="flex group-open:hidden text-blue-800">
          <KeyboardArrowDownIcon /> {accordion?.accordionItemShow}
        </span>
        <span className="hidden group-open:flex text-blue-800">
          <KeyboardArrowUpIcon /> {accordion?.accordionItemHide}
        </span>
      </summary>
      <RichText
        className="ds-body-02-reg px-16 pt-16 pb-24 gap-y-32"
        html={description}
      />
    </details>
  );
});
