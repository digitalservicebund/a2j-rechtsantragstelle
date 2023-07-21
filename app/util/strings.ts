export function stripLeadingZeros(s?: string) {
  return s ? s.replace(/^0+/, "") : "";
}

export function splitObjectsByFirstLetter<
  T extends Record<string, string>,
  K extends keyof T,
>(objects: T[], key: K) {
  const result: Record<string, T[]> = {};
  objects.forEach((object) => {
    const firstLetter = object[key].charAt(0);
    if (!result[firstLetter]) result[firstLetter] = [];
    result[firstLetter].push(object);
  });
  return result;
}

type Protocol = "http" | "https";

export function normalizeURL(url: string, protocol: Protocol = "https") {
  // Three cases: URL already is the desired protocol, URL is the other protocol, URL has no protocol
  if (url.startsWith(protocol + "://")) return url;
  const otherProtocol = protocol === "https" ? "http" : "https";
  if (url.startsWith(otherProtocol + "://"))
    return protocol + url.substring(otherProtocol.length);
  return protocol + "://" + url;
}

export function stripTrailingSlashFromURL(url: string) {
  const { pathname, search } = new URL(url);
  if (pathname.endsWith("/") && pathname.length > 1) {
    const safepath = pathname.slice(0, -1).replace(/\/+/g, "/");
    return safepath + search;
  }
  return undefined;
}
