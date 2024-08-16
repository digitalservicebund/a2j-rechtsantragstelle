export function isExternalUrl(url: string) {
  return url.startsWith("https://");
}

export function isFileDowloadUrl(url: string) {
  return url.endsWith("/download/pdf");
}

export function getYoutubeVideoId(url: string) {
  return url.match(/(?<=(v=)|(be\/))\w+/g)?.at(0);
}
