import { useState } from "react";

export type AccordionItemProps = {
  title: string;
  description: string;
  id?: number;
};

export default function AccordionItem({
  title,
  description,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleAccordion = (): void => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={"border-2 border-blue-300"}>
      <button
        type="button"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center text-left cursor-pointer text-lg font-medium py-4 px-2 bg-blue-100"
      >
        <span className={"p-4 ds-label-01-bold"}>{title}</span>
        <span className="p-4 text-blue-800">
          {isOpen ? "⌃ Ausblenden" : "⌄ Einblenden"}
        </span>
      </button>
      {isOpen && <div className="p-4">{description}</div>}
    </div>
  );
}
