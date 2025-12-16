import cn from "classnames";
import { useEffect, useRef, useId } from "react";
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

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const liveId = `selection-tooltip-live-${useId()}`;

  useEffect(() => {
    // focus the button so screen readers announce it on appearance
    btnRef.current?.focus();
  }, []);

  const visuallyHidden: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
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

  let liveText;
  if (mode === "delete") {
    liveText = "Markierung kann gelöscht werden";
  } else if (mode === "save") {
    liveText = "Markierung kann gespeichert werden";
  } else {
    liveText = "Auswahl überschneidet sich mit vorhandener Markierung";
  }

  return (
    <div
      className="fixed"
      style={wrapperStyle}
      role="dialog"
      aria-label={
        mode === "delete" ? "Markierung löschen" : "Markierung speichern"
      }
    >
      {/* assertive live region — visually hidden but announced when content changes */}
      <div id={liveId} style={visuallyHidden} aria-live="assertive">
        {liveText}
      </div>

      <button
        ref={btnRef}
        type="button"
        className={buttonClass}
        onClick={mode === "disabled" ? undefined : onAction}
        disabled={mode === "disabled"}
        aria-disabled={mode === "disabled"}
        aria-describedby={liveId}
      >
        <span className="leading-6">
          {mode === "delete" ? "Löschen" : "Speichern"}
        </span>
      </button>
    </div>
  );
};
