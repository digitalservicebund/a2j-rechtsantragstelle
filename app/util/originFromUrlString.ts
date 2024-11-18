export function originFromUrlString(urlString?: string) {
  try {
    return new URL(urlString ?? "").origin;
  } catch {
    return undefined;
  }
}
