export function originFromUrlString(urlString?: string) {
  return URL.parse(urlString ?? "")?.origin;
}
