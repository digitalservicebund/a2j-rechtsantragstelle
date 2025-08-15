export const addArrayIndexToPathUrl = (path: string, index: number): string => {
  const segments = path.split("/");

  if (segments.length < 2) {
    return path;
  }

  segments.splice(segments.length - 1, 0, index.toString());

  return segments.join("/");
};
