export function stripLeadingZeros(s?: string) {
  return s ? s.replace(/^0+/, "") : "";
}

export function splitObjectsByFirstLetter<
  T extends Record<string, any>,
  K extends keyof T
>(objects: T[], key: K) {
  const result: Record<string, T[]> = {};
  objects.forEach((object) => {
    const firstLetter = object[key].charAt(0);
    if (!result[firstLetter]) result[firstLetter] = [];
    result[firstLetter].push(object);
  });
  return result;
}

export function normalizeURL(url: string) {
  return url?.startsWith("https") ? url : `https://${url}`;
}
