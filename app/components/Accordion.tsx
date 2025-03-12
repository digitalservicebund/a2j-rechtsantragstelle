import { useState, useEffect } from "react";

export type AccordionProps = {
  title: string;
  description: string;
  className?: string;
};

export default function Accordion({
  title,
  description,
  className,
}: Readonly<AccordionProps>): JSX.Element {
  const [jsEnabled, setJsEnabled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  if (jsEnabled) {
    return (
      <div className={className}>
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
  }

  // Fallback for no JavaScript using native details/summary.
  return (
    <div className={className}>
      <details>
        <summary className="cursor-pointer text-lg font-medium py-4 px-2">
          {title}
        </summary>
        <div className="p-4">{description}</div>
      </details>
    </div>
  );
}
