export function isExternalUrl(url: string) {
  return url.startsWith("https://");
}

export function isFileDowloadUrl(url: string) {
  return url.endsWith("/download/pdf");
}

export function getYoutubeVideoId(url: string): string | undefined {
  const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)(\w+)/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
  return undefined;
}
