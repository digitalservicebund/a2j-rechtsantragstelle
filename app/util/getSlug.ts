export default (url: string) => {
  const pathname = new URL(url).pathname;
  return pathname.substring(pathname.lastIndexOf("/") + 1);
};
