export default (url: string) => {
  const { pathname } = new URL(url);
  return pathname.substring(pathname.lastIndexOf("/") + 1);
};
