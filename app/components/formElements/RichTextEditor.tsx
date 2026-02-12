import { useField } from "@rvf/react-router";
import classNames from "classnames";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import { Markdown } from "@tiptap/markdown";
import { Plugin } from "@tiptap/pm/state";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import HardBreak from "@tiptap/extension-hard-break";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Details } from "~/components/content/Details";
import InputLabel from "~/components/formElements/InputLabel";
import InputError from "./InputError";
import RichText from "../common/RichText";
import { type ErrorMessageProps } from "../common/types";
import { useJsAvailable } from "../hooks/useJsAvailable";
import Textarea from "./Textarea";
import { RICH_TEXT_WORD_LIMIT } from "~/services/validation/richTextField";

type RichTextEditorProps = Readonly<{
  name: string;
  description?: string;
  label?: ReactNode;
  details?: {
    title: string;
    content: string;
  };
  placeholder?: string;
  errorMessages?: ErrorMessageProps[];
}>;

const looksLikeHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const countWordsFromText = (text: string) =>
  (text.trim().match(/\S+/gu) ?? []).length;

const WordLimit = Extension.create<{
  limit: number;
  onLimitExceeded?: (words: number) => void;
}>({
  name: "wordLimit",

  addOptions() {
    return {
      limit: RICH_TEXT_WORD_LIMIT,
      onLimitExceeded: undefined,
    };
  },

  addProseMirrorPlugins() {
    const limit = this.options.limit;
    const onLimitExceeded = this.options.onLimitExceeded;

    return [
      new Plugin({
        filterTransaction: (transaction, _state) => {
          if (!transaction.docChanged) return true;

          const nextText = transaction.doc.textBetween(
            0,
            transaction.doc.content.size,
            " ",
            " ",
          );
          const words = countWordsFromText(nextText);

          if (words > limit) {
            onLimitExceeded?.(words);
            return false;
          }

          return true;
        },
      }),
    ];
  },
});

const RichTextEditorTextareaFallback = (props: RichTextEditorProps) => (
  <Textarea
    name={props.name}
    description={props.description}
    label={props.label}
    details={props.details}
    placeholder={props.placeholder}
    errorMessages={props.errorMessages}
  />
);

const RichTextEditorClient = ({
  name,
  description,
  label,
  details,
  placeholder,
  errorMessages,
}: RichTextEditorProps) => {
  const field = useField(name);
  const errorId = `${name}-error`;
  const [wordLimitError, setWordLimitError] = useState<string | null>(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isBulletListActive, setIsBulletListActive] = useState(false);
  const fieldError = field.error();

  const { defaultValue } = field.getInputProps();
  const defaultHtml = typeof defaultValue === "string" ? defaultValue : "";

  const rawFieldValue = field.value();
  const fieldValue = typeof rawFieldValue === "string" ? rawFieldValue : "";

  const setRvfValue = (value: string) => field.setValue(value);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      BulletList,
      ListItem,
      HardBreak,
      Markdown,
      WordLimit.configure({
        limit: RICH_TEXT_WORD_LIMIT,
        onLimitExceeded: () => {
          setWordLimitError(`Maximal ${RICH_TEXT_WORD_LIMIT} Wörter erlaubt.`);
        },
      }),
    ],
    content: "",
    immediatelyRender: false,
    injectCSS: false,
    onCreate: ({ editor }) => {
      const initial = fieldValue.length > 0 ? fieldValue : defaultHtml;
      if (!initial) return;

      if (looksLikeHtml(initial)) {
        editor.commands.setContent(initial, { emitUpdate: false });
      } else {
        editor.commands.setContent(initial, {
          emitUpdate: false,
          contentType: "markdown",
        });
      }

      // Always store markdown in RVF/Redis.
      setRvfValue(editor.getMarkdown());
    },
    onUpdate: ({ editor }) => {
      const words = countWordsFromText(editor.getText());
      setWordLimitError(
        words > RICH_TEXT_WORD_LIMIT
          ? `Maximal ${RICH_TEXT_WORD_LIMIT} Wörter erlaubt.`
          : null,
      );
      setRvfValue(editor.getMarkdown());
    },
    onSelectionUpdate: ({ editor }) => {
      setIsBoldActive(editor.isActive("bold"));
      setIsBulletListActive(editor.isActive("bulletList"));
    },
    editorProps: {
      attributes: {
        class: classNames(
          "ds-textarea forced-colors:border-4 ph-no-capture prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] p-3 border border-gray-300 rounded-b-md",
          {
            "border-red-500": fieldError || wordLimitError,
          },
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.setOptions({
      editorProps: {
        attributes: {
          class: classNames(
            "ds-textarea forced-colors:border-4 ph-no-capture prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] p-3 border border-gray-300 rounded-b-md",
            {
              "border-red-500": fieldError || wordLimitError,
            },
          ),
        },
      },
    });
  }, [editor, fieldError, wordLimitError]);

  useEffect(() => {
    if (!editor) return;

    const currentMarkdown = editor.getMarkdown();
    if (currentMarkdown === fieldValue) return;

    if (looksLikeHtml(fieldValue)) {
      editor.commands.setContent(fieldValue, { emitUpdate: false });
      return;
    }

    editor.commands.setContent(fieldValue, {
      emitUpdate: false,
      contentType: "markdown",
    });
  }, [editor, fieldValue]);

  if (!editor) {
    return null;
  }

  return (
    <div className="ds-stack ds-stack-8">
      {label && (
        <InputLabel classname="ds-label-01-reg" id={name}>
          {label}
        </InputLabel>
      )}
      {description && (
        <RichText className="ds-body-02-reg text-gray-900" html={description} />
      )}
      {details && <Details {...details} />}
      <input
        type="hidden"
        id={`${name}-hidden`}
        name={name}
        value={fieldValue}
      />
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-300">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={classNames(
              "px-3 py-2 text-base border rounded hover:bg-gray-100 w-[100px]",
              isBoldActive
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white",
            )}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={classNames(
              "px-3 py-2 text-base border rounded hover:bg-gray-100 w-[100px]",
              isBulletListActive
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white",
            )}
            title="Bullet List"
          >
            •
          </button>
        </div>
        <div className="relative">
          <EditorContent
            editor={editor}
            id={name}
            aria-invalid={fieldError !== null || wordLimitError !== null}
            aria-describedby={
              fieldError || wordLimitError ? errorId : undefined
            }
            aria-errormessage={
              fieldError || wordLimitError ? errorId : undefined
            }
            aria-required={
              !!errorMessages?.find((err) => err.code === "required")
            }
          />
          {editor && !editor.getText() && placeholder && (
            <div className="absolute top-3 left-3 text-gray-400 pointer-events-none z-0">
              {placeholder}
            </div>
          )}
        </div>
      </div>
      <InputError id={errorId}>
        {wordLimitError ??
          errorMessages?.find((err) => err.code === fieldError)?.text ??
          fieldError}
      </InputError>
    </div>
  );
};

const RichTextEditor = (props: RichTextEditorProps) => {
  const jsAvailable = useJsAvailable();
  return jsAvailable ? (
    <RichTextEditorClient {...props} />
  ) : (
    <RichTextEditorTextareaFallback {...props} />
  );
};

export default RichTextEditor;
