export const lookupOrKey = (key: string, lookup: Record<string, string>) =>
  lookup[key] ?? key;
