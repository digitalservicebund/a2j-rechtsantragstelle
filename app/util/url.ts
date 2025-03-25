import { flowIdFromPathname } from "~/domains/flowIds";

export function isExternalUrl(url: string) {
  return url.startsWith("https://");
}

export function isFileDownloadUrl(url: string) {
  return url.endsWith("/download/pdf") || url.endsWith("?print");
}

const youtubeLinkRegex = RegExp(/(?:youtu\.be\/|youtube\.com\/watch\?v=)(\w+)/);

export function getYoutubeVideoId(url: string): string | undefined {
  const match = youtubeLinkRegex.exec(url);
  if (match) {
    return match[1];
  }
  return undefined;
}

export const isFlowIdInPathname = (pathname: string): boolean => {
  const flowId = flowIdFromPathname(pathname);
  return typeof flowId !== "undefined";
};
