import { BoldPlugin } from "@platejs/basic-nodes/react";
import { ListPlugin } from "@platejs/list/react";
import classNames from "classnames";
import type { Value } from "platejs";
import {
  ParagraphPlugin,
  Plate,
  PlateContent,
  PlateElement,
  type PlateElementProps,
  usePlateEditor,
} from "platejs/react";

import {
  plateValueToRichTextMarkdown,
  richTextMarkdownToPlateValue,
} from "~/services/richText/plateMarkdown";

import { RichTextEditorToolbar } from "./RichTextEditorToolbar";
import { useMemo } from "react";

function ParagraphElement(props: PlateElementProps) {
  return <PlateElement as="div" className="whitespace-pre-wrap" {...props} />;
}

export function PlateRichTextEditor({
  initialMarkdown,
  placeholder,
  invalid,
  describedBy,
  errorMessage,
  onChangeMarkdown,
  onBlurValidate,
}: {
  initialMarkdown: string;
  placeholder?: string;
  invalid: boolean;
  describedBy?: string;
  errorMessage?: string;
  onChangeMarkdown: (markdown: string) => void;
  onBlurValidate: () => void;
}) {
  const initialValue = useMemo<Value>(
    () => richTextMarkdownToPlateValue(initialMarkdown),
    [initialMarkdown],
  );

  const editor = usePlateEditor({
    plugins: [
      ParagraphPlugin.withComponent(ParagraphElement),
      BoldPlugin,
      ListPlugin,
    ],
    value: initialValue,
  });

  if (!editor) return null;

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        onChangeMarkdown(plateValueToRichTextMarkdown(value));
      }}
    >
      <RichTextEditorToolbar editor={editor} />

      <div
        className={classNames(
          "plate-rich-text mt-8 rounded border p-12 min-h-[120px]",
          invalid ? "border-red-600" : "border-gray-300",
        )}
      >
        <PlateContent
          className="outline-none"
          placeholder={placeholder}
          aria-invalid={invalid}
          aria-describedby={invalid ? describedBy : undefined}
          aria-errormessage={invalid ? errorMessage : undefined}
          onBlur={onBlurValidate}
        />
      </div>
    </Plate>
  );
}
