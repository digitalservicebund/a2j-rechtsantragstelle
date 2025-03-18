import KeyboardArrowDownIcon from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@digitalservicebund/icons/KeyboardArrowUp";
import RichText from "~/components/RichText";
import { useTranslations } from "~/services/translations/translationsContext";

export type AccordionItemProps = Readonly<{
  title: string;
  description: string;
  id: number;
  isOpen?: boolean;
  onToggle?: () => void;
  jsEnabled?: boolean;
}>;

export default function AccordionItem({
  title,
  description,
  isOpen,
  onToggle,
  jsEnabled,
}: AccordionItemProps) {
  const { accordion } = useTranslations();

  // When JS is enabled, intercept clicks on the summary to prevent
  // the default native toggle behavior and instead call the parent's handler.
  const handleSummaryClick = (event: React.MouseEvent) => {
    if (jsEnabled) {
      event.preventDefault();
      onToggle?.();
    }
  };

  return (
    <details
      className="group border-2 rounded border-blue-500"
      // When JS is enabled, control the open state via the parent's state.
      {...(jsEnabled ? { open: isOpen } : {})}
    >
      <summary
        onClick={handleSummaryClick}
        className="w-full flex justify-between items-center text-left cursor-pointer text-lg font-medium px-16 gap-x-8 bg-blue-100"
      >
        <span className="p-16 ds-label-01-bold">{title}</span>
        <span className="p-16 text-blue-800 flex items-center">
          {jsEnabled ? (
            <>
              <span className={isOpen ? "flex" : "hidden"}>
                <KeyboardArrowUpIcon /> {accordion.accordionItemHide}
              </span>
              <span className={!isOpen ? "flex" : "hidden"}>
                <KeyboardArrowDownIcon /> {accordion.accordionItemShow}
              </span>
            </>
          ) : (
            <>
              <span className="flex group-open:hidden">
                <KeyboardArrowDownIcon /> {accordion.accordionItemShow}
              </span>
              <span className="hidden group-open:flex">
                <KeyboardArrowUpIcon /> {accordion.accordionItemHide}
              </span>
            </>
          )}
        </span>
      </summary>
      <RichText
        className="ds-body-02-reg px-16 pt-16 pb-24 gap-y-32"
        html={description}
      />
    </details>
  );
}
