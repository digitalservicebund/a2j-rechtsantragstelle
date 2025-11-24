export function parseArrayIndexesFromPathname(pathname: string) {
  return (
    pathname
      .match(/(\/\d+)/g)
      ?.map((index) => Number(index.replace("/", ""))) ?? []
  );
}
