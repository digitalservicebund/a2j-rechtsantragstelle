import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useEffect, useState } from "react";

type ToolbarButtonProps = Readonly<{
  isActive?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}>;

function ToolbarButton({
  isActive,
  onClick,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`toolbar-button ${isActive ? "toolbar-button-active" : ""}`}
      aria-label={title}
    >
      {children}
    </button>
  );
}

export function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        setIsBold($isRangeSelection(selection) && selection.hasFormat("bold"));
        setIsItalic(
          $isRangeSelection(selection) && selection.hasFormat("italic"),
        );
        setIsUnderline(
          $isRangeSelection(selection) && selection.hasFormat("underline"),
        );
      });
    });
  }, [editor]);

  const handleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const handleItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const handleUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const handleBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const handleNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="editor-toolbar">
      <ToolbarButton
        isActive={isBold}
        onClick={handleBold}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </ToolbarButton>

      <ToolbarButton
        isActive={isItalic}
        onClick={handleItalic}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </ToolbarButton>

      <ToolbarButton
        isActive={isUnderline}
        onClick={handleUnderline}
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </ToolbarButton>

      <div className="toolbar-divider" />

      <ToolbarButton onClick={handleBulletList} title="Bullet List">
        •
      </ToolbarButton>

      <ToolbarButton onClick={handleNumberedList} title="Numbered List">
        1.
      </ToolbarButton>
    </div>
  );
}
