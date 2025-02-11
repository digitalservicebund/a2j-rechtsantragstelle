export const getSortedFields = (
  pageFields: string[],
  sortedFields?: string,
) => {
  if (typeof sortedFields === "undefined" || sortedFields.length === 0) {
    return pageFields;
  }

  const sorted = sortedFields.split("\n");

  return [...pageFields].sort((x, y) => {
    const indexX = sorted.indexOf(x);
    const indexY = sorted.indexOf(y);

    if (indexX === -1 && indexY === -1) {
      return pageFields.indexOf(x) - pageFields.indexOf(y);
    }
    if (indexX === -1) return 1;
    if (indexY === -1) return -1;

    return indexX - indexY;
  });
};
