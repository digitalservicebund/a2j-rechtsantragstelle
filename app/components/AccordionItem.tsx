import KeyboardArrowDownIcon from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@digitalservicebund/icons/KeyboardArrowUp";
import RichText from "~/components/RichText";
import { useTranslations } from "~/services/translations/translationsContext";

export type AccordionItemProps = Readonly<{
  title: string;
  description: string;
  id?: number;
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
  id,
}: AccordionItemProps) {
  const { accordion } = useTranslations();
  if (jsEnabled) {
    return (
      <div className="border-2 border-blue-300">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex justify-between items-center text-left cursor-pointer text-lg font-medium px-2 bg-blue-100"
        >
          <span className="p-16 ds-label-01-bold">{title}</span>
          <span className="p-16 text-blue-800 flex items-center">
            {isOpen ? (
              <>
                <KeyboardArrowUpIcon /> {accordion.accordionItemHide}
              </>
            ) : (
              <>
                <KeyboardArrowDownIcon /> {accordion.accordionItemShow}
              </>
            )}
          </span>
        </button>
        {isOpen && (
          <RichText className="ds-body-01-reg p-16" html={description} />
        )}
      </div>
    );
  }

  return (
    <details key={id} className="group border-2 border-blue-300">
      <summary className="cursor-pointer text-lg font-medium px-2 bg-blue-100 flex justify-between items-center">
        <span className="p-16 ds-label-01-bold">{title}</span>
        <span className="p-16 text-blue-800 flex items-center">
          <span className="block group-open:hidden">
            <KeyboardArrowDownIcon /> {accordion.accordionItemShow}
          </span>
          <span className="hidden group-open:block">
            <KeyboardArrowUpIcon /> {accordion.accordionItemHide}
          </span>
        </span>
      </summary>
      <RichText className="ds-body-01-reg p-16" html={description} />
    </details>
  );
}
