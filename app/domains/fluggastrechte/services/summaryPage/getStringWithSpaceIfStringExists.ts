export const getStringWithSpaceIfStringExists = (value: string | undefined) => {
  return value ? `${value} ` : "";
};
