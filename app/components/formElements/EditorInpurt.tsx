import { useRef, useEffect } from "react";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createHeadlessEditor } from "@lexical/headless";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { type EditorState } from "lexical";
import { useField } from "@rvf/react";
import { EditorToolbar } from "./EditorToolbar";

type EditorInputProps = Readonly<{
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
}>;

const editorConfig: InitialConfigType = {
  namespace: "RichTextEditor",
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  theme: {
    list: {
      listitem: "editor-listitem",
      nested: {
        listitem: "editor-nested-listitem",
      },
      ol: "editor-list-ol",
      ul: "editor-list-ul",
    },
    paragraph: "editor-paragraph",
    placeholder: "editor-placeholder",
    text: {
      bold: "editor-text-bold",
      italic: "editor-text-italic",
      underline: "editor-text-underline",
    },
  },
  onError: (error: Error) => {
    // oxlint-disable-next-line no-console
    console.error("Lexical editor error:", error);
  },
};

function EditorInitializer({ defaultValue }: { defaultValue?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (defaultValue) {
      try {
        // Try to parse as JSON first (editor state)
        const parsed = JSON.parse(defaultValue);
        editor.setEditorState(editor.parseEditorState(parsed));
      } catch {
        // If JSON parsing fails, treat it as markdown with <br> tags
        try {
          // Replace <br> tags with double newlines for markdown paragraph breaks
          const markdownContent = defaultValue
            .replaceAll("<br>", "\x00")
            .trim();

          editor.update(() => {
            $convertFromMarkdownString(markdownContent, TRANSFORMERS);
          });
        } catch (error) {
          // oxlint-disable-next-line no-console
          console.warn(
            "Failed to parse editor state from default value:",
            error,
          );
        }
      }
    }
  }, [editor, defaultValue]);

  return null;
}

export function EditorInput({
  name,
  placeholder = "Enter text...",
  className = "",
}: EditorInputProps) {
  const field = useField(name);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const defaultValue = field.getInputProps().defaultValue as string | undefined;

  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      const editor = createHeadlessEditor({
        nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
        onError: () => {},
      });

      editor.setEditorState(
        editor.parseEditorState(JSON.stringify(editorState.toJSON())),
      );

      editor.update(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        // Replace paragraph breaks with <br> tags
        const withBrTags = markdown.replace(/\n\n+/g, "\n<br>\n");
        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = withBrTags;
        }
      });
    });
  };

  return (
    <>
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue}
      />
      <LexicalComposer initialConfig={editorConfig}>
        <EditorInitializer defaultValue={defaultValue} />
        <EditorToolbar />
        <div className={`editor-container ${className}`}>
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input editor-scrollable" />
              }
              placeholder={
                <div className="editor-placeholder">{placeholder}</div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>

          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </div>
      </LexicalComposer>
    </>
  );
}
