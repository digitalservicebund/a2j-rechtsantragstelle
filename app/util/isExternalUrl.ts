export function isExternalUrl(url: string) {
  return url.startsWith("https://") || url.endsWith(".pdf");
}
