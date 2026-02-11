import { BoldPlugin } from "@platejs/basic-nodes/react";
import { ListPlugin } from "@platejs/list/react";
import { MarkdownPlugin } from "@platejs/markdown";
import type { Value } from "platejs";
import { ParagraphPlugin, createPlateEditor } from "platejs/react";

const markdownEditor = createPlateEditor({
  plugins: [ParagraphPlugin, BoldPlugin, ListPlugin, MarkdownPlugin],
});

const markdownApi = markdownEditor.getApi(MarkdownPlugin).markdown;

const normalizeMarkdownInput = (markdown?: string) => markdown ?? "";

const nodeText = (node: any): string => {
  if (!node) return "";

  if (typeof node.text === "string") return node.text;

  const children = node.children;
  if (!Array.isArray(children) || children.length === 0) return "";

  return children.map(nodeText).join("");
};

export const richTextMarkdownToPlateValue = (markdown?: string): Value => {
  return markdownApi.deserialize(
    normalizeMarkdownInput(markdown),
  ) as unknown as Value;
};

export const plateValueToRichTextMarkdown = (value: Value): string => {
  return markdownApi.serialize({ value: (value ?? []) as any });
};

export const richTextMarkdownToPlainText = (markdown: string): string => {
  const value = richTextMarkdownToPlateValue(markdown);
  if (!Array.isArray(value) || value.length === 0) return "";

  return value
    .map((block) => nodeText(block))
    .join("\n")
    .trimEnd();
};

export const countWordsInRichTextMarkdown = (markdown: string): number => {
  const plain = richTextMarkdownToPlainText(markdown)
    .replaceAll(/\s+/g, " ")
    .trim();

  if (plain.length === 0) return 0;
  return plain.split(" ").filter(Boolean).length;
};
