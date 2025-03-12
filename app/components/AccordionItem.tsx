import { useState } from "react";

export type AccordionItemProps = {
  title: string;
  description: string;
  id?: number;
};

const AccordionItem = ({ title, description }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full text-left cursor-pointer text-lg font-medium py-4 px-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {title}
      </button>
      {isOpen && <div className="p-4">{description}</div>}
    </div>
  );
};

export default AccordionItem;
