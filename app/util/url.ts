export function isExternalUrl(url: string) {
  return url.startsWith("https://");
}

export function isFileDowloadUrl(url: string) {
  return url.endsWith("/download/pdf");
}
