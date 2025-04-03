import KeyboardArrowDownIcon from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@digitalservicebund/icons/KeyboardArrowUp";
import RichText from "~/components/RichText";
import { useTranslations } from "~/services/translations/translationsContext";

export type Props = AccordionItemProps &
  Readonly<{
    isOpen: boolean;
    onToggle: () => void;
    jsEnabled: boolean;
  }>;

export type AccordionItemProps = Readonly<{
  title: string;
  description: string;
  id: number;
}>;

export default function AccordionItem({
  title,
  description,
  isOpen,
  onToggle,
  jsEnabled,
}: Props) {
  const { accordion } = useTranslations();

  // When JS is enabled, intercept clicks on the summary to prevent
  // the default native toggle behavior and instead call the parent's handler.
  const handleSummaryClick = (event: React.MouseEvent) => {
    if (jsEnabled) {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <details
      className="group last:border-b-0 border-b-2 p-2 border-blue-500 align-middle"
      // When JS is enabled, control the open state via the parent's state.
      {...(jsEnabled ? { open: isOpen } : {})}
    >
      <summary
        onClick={handleSummaryClick}
        className="flex align-middle justify-between cursor-pointer p-16 bg-blue-100"
      >
        <span className="ds-label-01-bold">{title}</span>
        <span className="align-middle text-blue-800 ds-label-03-bold">
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
