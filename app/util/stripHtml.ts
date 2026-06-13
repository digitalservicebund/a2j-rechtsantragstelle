export function stripHtml(content: string): string {
  return content.replace(/[<>]/g, "");
}
