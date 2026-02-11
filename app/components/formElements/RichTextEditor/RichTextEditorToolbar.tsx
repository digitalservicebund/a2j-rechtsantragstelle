import { ListStyleType, toggleList } from "@platejs/list";
import { type usePlateEditor } from "platejs/react";
import classNames from "classnames";

type PlateEditor = NonNullable<ReturnType<typeof usePlateEditor>>;

function ToolbarButton({
  children,
  onMouseDown,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={classNames(
        "px-8 py-4 border rounded text-sm font-medium border-gray-300 bg-white hover:bg-gray-50",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditorToolbar({ editor }: { editor: PlateEditor }) {
  return (
    <div className="flex flex-wrap gap-8">
      <ToolbarButton
        ariaLabel="Fett"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.tf.bold.toggle()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>

      <ToolbarButton
        ariaLabel="Aufzählung"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          toggleList(editor, { listStyleType: ListStyleType.Disc })
        }
      >
        Liste
      </ToolbarButton>

      <ToolbarButton
        ariaLabel="Nummerierte Liste"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          toggleList(editor, {
            listStyleType: ListStyleType.Decimal,
          })
        }
      >
        1.
      </ToolbarButton>
    </div>
  );
}
