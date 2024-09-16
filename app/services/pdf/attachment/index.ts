export const newPageHint = "Bitte im Anhang prüfen";

export type AttachmentEntries = {
  title: string;
  text?: string;
  level?: "h2" | "h3" | "h4";
}[];
