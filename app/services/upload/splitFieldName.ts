export const splitFieldName = (fieldName: string) => ({
  fieldName: fieldName.split("[")[0],
  inputIndex: Number(
    new RegExp(/\[\d+\]/).exec(fieldName)?.[0].replaceAll(/[[\]]/g, ""),
  ),
});
