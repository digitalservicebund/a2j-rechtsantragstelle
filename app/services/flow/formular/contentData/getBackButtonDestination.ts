import { arrayIsNonEmpty } from "~/util/array";
import { insertIndexesIntoPath } from "../../stepIdConverter";

export const getBackButtonDestination = (
  backDestination: string | undefined,
  pathname: string,
  arrayIndexes: number[],
) => {
  if (arrayIsNonEmpty(arrayIndexes) && backDestination) {
    return insertIndexesIntoPath(pathname, backDestination, arrayIndexes);
  }

  return backDestination;
};
