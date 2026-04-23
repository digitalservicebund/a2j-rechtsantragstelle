export const addArrayIndexToPathUrl = (path: string, index: number): string => {
  const segments = path.split("/");

  if (segments.length < 2) {
    return path;
  }

  const startSegment = segments.length - 1;

  segments.splice(startSegment, 0, index.toString());

  return segments.join("/");
};
