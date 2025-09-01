export const validEstimatedTimePathnames = [
  "/prozesskostenhilfe/formular/start/start",
  "/beratungshilfe/antrag/start/start",
];

export const shouldShowEstimatedTime = (pathname: string) =>
  validEstimatedTimePathnames.includes(pathname);
