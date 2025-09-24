// the linter doesn’t have special knowledge of summary and details natively toggleable
/* oxlint-disable jsx-a11y/click-events-have-key-events */
import KeyboardArrowDownIcon from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@digitalservicebund/icons/KeyboardArrowUp";
import { type MouseEventHandler } from "react";
import RichText from "~/components/common/RichText";

export type AccordionItemProps = Readonly<{
  title: string;
  description: string;
}>;

type Props = AccordionItemProps & {
  startOpened?: boolean;
  onSummaryClick?: MouseEventHandler;
  labels: {
    show: string;
    hide: string;
  };
  ref: React.Ref<HTMLDetailsElement>;
};

export function AccordionItem({
  title,
  description,
  startOpened,
  onSummaryClick,
  labels,
  ref,
}: Props) {
  return (
    <details className="group accordion-item" ref={ref} open={startOpened}>
      <summary
        onClick={onSummaryClick}
        className="flex justify-between cursor-pointer outline-none p-16 bg-blue-100 "
      >
        <span className="ds-label-01-bold">{title}</span>
        <span className="flex group-open:hidden text-blue-800 ds-label-03-bold items-start ">
          <KeyboardArrowDownIcon />
          <span className="pt-4">{labels.show}</span>
        </span>
        <span className="hidden group-open:flex text-blue-800 ds-label-03-bold items-start">
          <KeyboardArrowUpIcon />
          <span className="pt-4">{labels.hide}</span>
        </span>
      </summary>
      <RichText
        className="ds-body-02-reg px-16 pt-16 pb-24 gap-y-32 bg-white"
        html={description}
      />
    </details>
  );
}
