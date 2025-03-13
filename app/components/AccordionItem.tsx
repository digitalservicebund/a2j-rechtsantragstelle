import RichText from "~/components/RichText";

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
  if (jsEnabled) {
    return (
      <div className="border-2 border-blue-300">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex justify-between items-center text-left cursor-pointer text-lg font-medium py-4 px-2 bg-blue-100"
        >
          <span className="p-4 ds-label-01-bold">{title}</span>
          <span className="p-4 text-blue-800">
            {isOpen ? "⌃ Ausblenden" : "⌄ Einblenden"}
          </span>
        </button>
        {isOpen && <RichText className="ds-body-01-reg" html={description} />}
      </div>
    );
  }

  return (
    <div key={id} className="mb-4">
      <details className="group border-2 border-blue-300">
        <summary className="cursor-pointer text-lg font-medium py-4 px-2 bg-blue-100 flex justify-between items-center">
          <span className="p-4 ds-label-01-bold">{title}</span>
          <span className="p-4 text-blue-800">
            <span className="block group-open:hidden">⌄ Einblenden</span>
            <span className="hidden group-open:block">⌃ Ausblenden</span>
          </span>
        </summary>
        <RichText className="ds-body-01-reg" html={description} />
      </details>
    </div>
  );
}
