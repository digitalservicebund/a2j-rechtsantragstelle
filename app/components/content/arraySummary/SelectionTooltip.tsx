import cn from "classnames";
import type { FC } from "react";

type Props = {
  readonly position: { top: number; left: number };
  readonly mode: "save" | "delete" | "disabled";
  readonly onAction: () => void;
};

export const SelectionTooltip: FC<Props> = ({ position, mode, onAction }) => {
  const wrapperStyle = {
    top: position.top - 45,
    left: position.left,
    transform: "translateX(-50%)",
  };

  const buttonClass = cn(
    "inline-flex items-center justify-center whitespace-nowrap px-3 py-2 min-w-[80px] min-h-[36px]",
    "text-sm text-white font-medium leading-6 rounded shadow-md border-0 transition",
    {
      "bg-gray-400 cursor-not-allowed opacity-90": mode === "disabled",
      "bg-red-600 hover:bg-red-900 cursor-pointer": mode === "delete",
      "bg-blue-600 hover:bg-blue-900 cursor-pointer": mode === "save",
    },
  );

  return (
    <div className="fixed" style={wrapperStyle}>
      <button
        type="button"
        className={buttonClass}
        onClick={mode === "disabled" ? undefined : onAction}
        disabled={mode === "disabled"}
        aria-disabled={mode === "disabled"}
      >
        <span className="leading-6">
          {mode === "delete" ? "Löschen" : "Speichern"}
        </span>
      </button>
    </div>
  );
};
